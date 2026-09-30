import { bindingScopeValues, Container, ContainerModule, inject, injectable } from 'inversify';
import { type Callback, Disposable } from 'tsjam';

import { jest } from '@jest/globals';

import { autoInstantiateServices, disposeAllInContainer } from 'ioc-utils.js';

const testIOC = new Container({ defaultScope: bindingScopeValues.Singleton });

// --------------------
// Test Services
// --------------------

const $TestIdentifierService = Symbol('IocTestIdentifierService');

@injectable()
class TestIdentifierService {
  readonly name = 'IocTestIdentifierService';
}

@injectable()
class TestService {
  constructor(@inject($TestIdentifierService) readonly dep: TestIdentifierService) {}
}

@injectable()
class DisposableService extends Disposable {
  constructor(
    readonly onInit: Callback,
    readonly onDispose: Callback,
  ) {
    super();
    onInit();
  }

  override dispose(): void {
    super.dispose();
    this.onDispose();
  }
}

/** Plain root-scoped dependency for container-hierarchy checks. */
@injectable()
export class TestCounterService {
  readonly count = 0;
}

@injectable()
class GameService extends Disposable {
  private static instanceId = 0;
  constructor(readonly counterService: TestCounterService) {
    super();
    GameService.instanceId++;
  }

  get instanceId(): number {
    return GameService.instanceId;
  }
}

// --------------------
// Test Module Configs
// --------------------

const testCommonModuleConfig = new ContainerModule(({ bind }) => {
  bind<TestIdentifierService>($TestIdentifierService).to(TestIdentifierService);
  bind(TestService).toSelf();
});

const testCounterModuleConfig = new ContainerModule(({ bind }) => {
  bind(TestCounterService).toSelf();
});

const testGameModuleConfig = new ContainerModule(({ bind }) => {
  bind(GameService).toSelf();
});

// --------------------
// Test cases
// --------------------

describe('IOC Container', () => {
  beforeEach(() => {
    testIOC.snapshot();
  });
  afterEach(() => {
    testIOC.unbindAll();
  });

  it('Should be able to use modules as configuration', () => {
    testIOC.load(testCommonModuleConfig, testCounterModuleConfig);

    expect(testIOC.isBound($TestIdentifierService)).toBe(true);
    expect(testIOC.isBound(TestService)).toBe(true);
    expect(testIOC.isBound(TestCounterService)).toBe(true);
  });

  it('Should be able to auto instantiate Services', () => {
    const initSpy = jest.fn();
    @injectable()
    class MonitoringService {
      constructor() {
        initSpy();
      }
    }

    testIOC.bind(MonitoringService).toSelf();
    expect(initSpy).toHaveBeenCalledTimes(0);
    autoInstantiateServices(testIOC, [MonitoringService]);
    expect(initSpy).toHaveBeenCalledTimes(1);
  });

  it('Should throw on on missing binding', () => {
    expect(() => testIOC.get('$NotBoundService')).toThrow('No bindings found for service: "$NotBoundService".');
  });

  it('Should not throw on optional get', () => {
    const service = testIOC.get('$NotBoundService', { optional: true });
    expect(service).toBeUndefined();
  });

  it('Should be able to dispose all Services - explicit onDeactivation', () => {
    const initSpy = jest.fn();
    const disposeSpy = jest.fn();

    testIOC
      .bind(DisposableService)
      .toDynamicValue(() => new DisposableService(initSpy, disposeSpy))
      .onDeactivation((instance) => instance.dispose());
    // instantiate
    testIOC.get(DisposableService);
    expect(initSpy).toHaveBeenCalledTimes(1);
    // dispose
    disposeAllInContainer(testIOC);
    expect(disposeSpy).toHaveBeenCalledTimes(1);
    // all bindings has to be cleared
    expect(testIOC.isBound(DisposableService)).toBe(false);
  });

  it('Can dispose all service in container', () => {
    const initSpy = jest.fn();
    const disposeSpy = jest.fn();

    testIOC
      .bind(DisposableService)
      .toConstantValue(new DisposableService(initSpy, disposeSpy))
      .onDeactivation((instance) => instance.dispose());

    // instantiate
    testIOC.get(DisposableService);
    expect(initSpy).toHaveBeenCalledTimes(1);
    expect(disposeSpy).not.toHaveBeenCalled();
    // dispose
    disposeAllInContainer(testIOC);
    expect(initSpy).toHaveBeenCalledTimes(1);
    expect(disposeSpy).toHaveBeenCalled();

    // No binding left
    expect(testIOC.isBound(DisposableService)).toBe(false);
  });

  it('Should be able to use parent services in child container', () => {
    testIOC.load(testCommonModuleConfig, testCounterModuleConfig);

    let gameIOC = new Container({ parent: testIOC, defaultScope: bindingScopeValues.Singleton });
    gameIOC.load(testGameModuleConfig);
    // root service resolved
    const service = gameIOC.get(TestCounterService);
    expect(service.count).toBeDefined();
    // game service with root dependency resolved
    const gameA = gameIOC.get(GameService);
    expect(gameA.instanceId).toBe(1);
    // game service should not be available on root level
    expect(testIOC.isBound(GameService)).toBe(false);
    // kill gameA
    disposeAllInContainer(gameIOC);
    // start gameB
    gameIOC = new Container({ parent: testIOC, defaultScope: bindingScopeValues.Singleton });
    gameIOC.load(testGameModuleConfig);
    // another instance has to be created within gameB
    const gameB = gameIOC.get(GameService);
    expect(gameB.instanceId).toBe(2);
  });
});

import type { ContainerModule, ServiceIdentifier } from 'inversify';

export type IOCModuleDescriptor = Readonly<{
  autoInstantiate: readonly ServiceIdentifier<unknown>[];
  module: ContainerModule;
}>;

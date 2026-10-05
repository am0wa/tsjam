import { RxVisible } from 'reactive/rx-visible.js';

import { RxTestUtils } from './rx-test-utils.js';

describe('Rx-Visible', () => {
  it('should emit on changes', () => {
    return new Promise((done) => {
      const o = new RxVisible();
      const testSub = RxTestUtils.testSubscribe(o.visible$, () => done({}));
      expect(o.isVisible).toBe(false);
      o.show();
      expect(o.isVisible).toBe(true);
      expect(testSub.fireCount).toBe(2);
      expect(testSub.received.length).toBe(2);
      o.show();
      // idempotent change by default
      expect(testSub.fireCount).toBe(2);
      expect(testSub.received.length).toBe(2);
      o.hide();
      expect(o.isVisible).toBe(false);
      expect(testSub.fireCount).toBe(3);
      expect(testSub.received.length).toBe(3);
      o.dispose();
    });
  });

  it('shown$ emits on becoming visible, and right away if already visible', () => {
    const o = new RxVisible();
    const shown: string[] = [];
    o.shown$.subscribe((v) => shown.push(v));
    expect(shown).toEqual([]);
    o.show();
    o.hide();
    o.show();
    expect(shown).toEqual(['shown', 'shown']);

    const late: string[] = [];
    o.shown$.subscribe((v) => late.push(v));
    expect(late).toEqual(['shown']);
    o.dispose();
  });

  it('visible$ completes on dispose, later changes are ignored', () => {
    const o = new RxVisible();
    const values: boolean[] = [];
    let completed = false;
    o.visible$.subscribe({ next: (v) => values.push(v), complete: () => (completed = true) });
    o.dispose();
    o.show();
    expect(completed).toBe(true);
    expect(values).toEqual([false]);
  });

  it('show can be used as an event handler', () => {
    const o = new RxVisible();
    const onClick: (event: { readonly type: string }) => void = o.show;
    onClick({ type: 'click' });
    expect(o.isVisible).toBe(true);
    o.dispose();
  });
});

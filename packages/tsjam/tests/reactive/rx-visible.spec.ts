import { RxVisible } from 'reactive/rx-visible';

import { RxTestUtils } from './rx-test-utils';

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
});

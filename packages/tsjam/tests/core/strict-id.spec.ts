import { type IdFactory, NumberId, StringId } from 'core/strict-id.js';

type UserId = StringId<'User'>;
type OrderId = StringId<'Order'>;

describe('strict-id', () => {
  it('StringId.create - brands the raw value', () => {
    const id: UserId = StringId.create<'User'>('u1');
    expect(id).toBe('u1');
  });

  it('StringId.factoryOf - falls back to the default for missing values', () => {
    const userIds: IdFactory<string, UserId> = StringId.factoryOf<'User'>();
    expect(userIds.create('u1')).toBe('u1');
    expect(userIds.create(undefined)).toBe('');
    expect(userIds.create(null)).toBe('');
    expect(userIds.unknown).toBe('');
    expect(StringId.factoryOf<'User'>('n/a').create(null)).toBe('n/a');
  });

  it('NumberId.factoryOf - falls back to -1 by default', () => {
    const orderNo = NumberId.factoryOf<'OrderNo'>();
    expect(orderNo.create(7)).toBe(7);
    expect(orderNo.create(0)).toBe(0);
    expect(orderNo.create(null)).toBe(-1);
    expect(orderNo.unknown).toBe(-1);
  });

  it('ids of different names are not assignable to each other', () => {
    const userId: UserId = StringId.create<'User'>('u1');
    // @ts-expect-error – a UserId is not an OrderId
    const orderId: OrderId = userId;
    // @ts-expect-error – a raw string is not an id
    const raw: UserId = 'u1';
    expect([orderId, raw]).toEqual(['u1', 'u1']);
  });
});

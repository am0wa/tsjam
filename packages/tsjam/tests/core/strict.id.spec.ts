import { NumberId, StringId } from 'core/strict-id.js';

describe('Strict-id', () => {
  it('StringId – should be assignable to string, not vice-versa', () => {
    let name = '';
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    name = 'John' as StringId<'Username'>;
    expect(name).toBe('John');
    name = StringId.create<'Username'>('John Doe');
    expect(name).toBe('John Doe');
  });

  it('NumberId – should be assignable to number, not vice-versa', () => {
    let phone = -1;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    phone = 77737 as NumberId<'Phonenumber'>;
    expect(phone).toBe(77737);
    phone = NumberId.create<'Phonenumber'>(77757);
    expect(phone).toBe(77757);
  });

  it('StringId: Username – factoryOf', () => {
    let name = '';
    type Username = StringId<'Username'>;
    const Username = StringId.factoryOf<'Phonenumber'>();
    name = Username.create('John');
    expect(name).toBe('John');
    name = Username.create('John Doe');
    expect(name).toBe('John Doe');
  });

  it('NumberId: Phonenumber – factoryOf', () => {
    let phone = -1;
    type Phonenumber = NumberId<'Phonenumber'>;
    const Phonenumber = NumberId.factoryOf<'Phonenumber'>();
    phone = Phonenumber.create(77737);
    expect(phone).toBe(77737);
    phone = Phonenumber.create(77757);
    expect(phone).toBe(77757);
  });
});

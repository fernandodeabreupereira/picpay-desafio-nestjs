import 'reflect-metadata';
import { validate } from 'class-validator';
import { HasTwoDecimalPlacesOrNoDecimal } from './has-two-decimal-places-or-no-decimal.decorator';

class TestClass {
  @HasTwoDecimalPlacesOrNoDecimal()
  value: any;
}

describe('HasTwoDecimalPlacesOrNoDecimal Decorator', () => {
  it('should pass when the value contains no decimal places', async () => {
    const instance = new TestClass();
    instance.value = 42;

    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it('should pass when the value contains two decimal places', async () => {
    const instance = new TestClass();
    instance.value = 42.99;

    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });

  it('should fail when the value contains more than two decimal places', async () => {
    const instance = new TestClass();
    instance.value = 42.123;

    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when the value is not a number', async () => {
    const instance = new TestClass();
    instance.value = 'not_a_number';

    const errors = await validate(instance);
    expect(errors.length).toBeGreaterThan(0);
  });
});

import 'reflect-metadata';
import { ROUTE_IS_PUBLIC_KEY, RouteIsPublic } from './route-is-public.decorator';


describe('RouteIsPublic Decorator', () => {
  it('should set the isPublic metadata to true', () => {
    // Arrange
    @RouteIsPublic()
    class TestClass { }

    // Act
    const isPublic = Reflect.getMetadata(ROUTE_IS_PUBLIC_KEY, TestClass);

    // Assert
    expect(isPublic).toBe(true);
  });
});

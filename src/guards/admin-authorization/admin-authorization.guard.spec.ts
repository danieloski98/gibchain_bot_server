import { AdminAuthorizationGuard } from './admin-authorization.guard';

describe('AdminAuthorizationGuard', () => {
  it('should be defined', () => {
    expect(new AdminAuthorizationGuard()).toBeDefined();
  });
});

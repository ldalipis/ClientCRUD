import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// Mock crypto for tests
Object.defineProperty(window, 'crypto', {
  value: { randomUUID: () => 'test-uuid' },
});

import { beforeAll, afterAll } from 'vitest';

// Mock environment variables for testing
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  process.env.SESSION_SECRET = 'test-session-secret-that-is-long-enough-for-testing';
  process.env.OPENAI_API_KEY = 'test-openai-key';
  process.env.DEEPSEEK_API_KEY = 'test-deepseek-key';
  process.env.STRIPE_SECRET_KEY = 'sk_test_123';
  process.env.SENDGRID_API_KEY = 'test-sendgrid-key';
  process.env.REPLIT_DOMAINS = 'localhost,test.replit.dev';
  process.env.REPL_ID = 'test-repl-id';
});

afterAll(() => {
  // Cleanup if needed
});
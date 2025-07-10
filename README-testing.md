# Testing Guide for Pure Living Pro

## Overview

Pure Living Pro includes a comprehensive testing setup using Vitest for unit and integration tests. The testing framework covers critical business logic, API endpoints, and middleware functionality.

## Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
tests/
├── setup.ts              # Test configuration and mocks
├── server/
│   ├── middleware/        # Middleware tests
│   └── storage.test.ts    # Database layer tests
└── api/                   # API integration tests
    ├── auth.test.ts
    ├── blog.test.ts
    └── products.test.ts
```

## Test Categories

### Unit Tests
- **Middleware**: Error handling, validation, RBAC
- **Storage Layer**: Database operations and business logic
- **Utilities**: Helper functions and data transformations

### Integration Tests
- **API Endpoints**: Request/response validation
- **Authentication**: Login flow and permissions
- **Database Operations**: End-to-end data flow

## Mocking Strategy

- Database operations are mocked in unit tests
- External API calls (OpenAI, Stripe) are mocked
- Authentication is mocked for protected endpoints
- Environment variables are set in test setup

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Naming**: Test names should describe the expected behavior
3. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
4. **Mock External Dependencies**: Don't rely on external services in tests
5. **Test Error Conditions**: Include negative test cases

## Coverage Goals

- Aim for >80% code coverage on critical business logic
- 100% coverage on middleware and error handling
- Focus on edge cases and error conditions

## Test Data

Test data is generated programmatically and stored in test setup files. No real user data or API keys are used in tests.
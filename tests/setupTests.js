require('@testing-library/jest-dom');

// Mock chrome API
global.chrome = {
  runtime: {
    sendMessage: jest.fn()
  }
};
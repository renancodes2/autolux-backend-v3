module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  clearMocks: true,
};

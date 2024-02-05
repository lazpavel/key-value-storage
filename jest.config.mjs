export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/**/__tests__/**/*.test.[jt]s?(x)'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
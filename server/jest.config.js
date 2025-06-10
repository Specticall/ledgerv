const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  globalSetup: "<rootDir>/src/test/jest.setup.ts",
  globalTeardown: "<rootDir>/src/test/jest.teardown.ts",
  transform: {
    ...tsJestTransformCfg,
  },
};

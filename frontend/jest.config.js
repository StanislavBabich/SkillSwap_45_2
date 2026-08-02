export default {
  testEnvironment: "jsdom",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",

    // чтобы Jest понимал alias @shared/**
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",

    // моки файлов
    "\\.(jpg|jpeg|png|gif)$": "<rootDir>/tests/__mocks__/fileMock.js",
  },

  transform: {
    "\\.svg$": "<rootDir>/jest-svg-transform.cjs",
    "\\.(css|less|sass|scss)$": "<rootDir>/jest-css-transform.cjs",
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

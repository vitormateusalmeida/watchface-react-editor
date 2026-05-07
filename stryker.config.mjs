export default {
  packageManager: "pnpm",
  testRunner: "vitest",
  checkers: ["typescript"],
  mutate: [
    "src/lib/**/*.{ts,tsx}",
    "src/vendor/watchface-js/src/watchFaceBinTools/imageParser.js",
    "!src/**/*.d.ts",
  ],
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "quality/reports/mutation/index.html",
  },
  thresholds: {
    high: 0,
    low: 0,
    break: 0,
  },
  coverageAnalysis: "perTest",
}

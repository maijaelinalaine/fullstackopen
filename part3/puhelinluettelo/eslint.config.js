const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    rules: {
      semi: "error",
      "prefer-const": "error",
    },
  },
]);

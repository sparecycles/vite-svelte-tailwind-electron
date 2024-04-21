module.exports = {
  root: true,
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  env: {
    es2022: true,
    node: true,
  },
  rules: {
    "prefer-const": ["error", { destructuring: "all" }],
  },
  overrides: [
    {
      files: ["*.cjs"],
      parserOptions: {
        sourceType: "commonjs",
        ecmaVersion: 2020,
      },
    },
    {
      files: ["*.ts"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
      ],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { ignoreRestSiblings: true },
        ],
      },
    },
  ],
};

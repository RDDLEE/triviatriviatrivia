module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:storybook/recommended"
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "postcss.config.js", "vite.config.ts", "tailwind.config.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "quotes": [1, "double"],
    "object-shorthand": [
      1,
      "never"
    ],
    "arrow-body-style": [
      1,
      "always"
    ],
    "semi": [
      1,
      "always"
    ],
    "no-extra-semi": [1],
    "no-trailing-spaces": [
      1,
      {},
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "args": "all",
        "argsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ],
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/strict-boolean-expressions": ["warn", {
      allowString: true,
      allowNumber: true,
    }],
    "comma-dangle": ["warn", {
      "arrays": "only-multiline",
      "objects": "only-multiline",
      "imports": "only-multiline",
      "exports": "only-multiline",
      "functions": "only-multiline"
    }],
    "eqeqeq": ["warn", "always"]
  },
}

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  rules: {
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
      "error",
      {
        "args": "all",
        "argsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ]
  },
}

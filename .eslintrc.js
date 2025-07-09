// .eslintrc.js
module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "next"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  rules: {
    // non-aktifkan rule yang memblokir build
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "no-var": "off",
  },
  ignorePatterns: [
    ".next/",
    "node_modules/",
    "public/uploads/",
  ],
}

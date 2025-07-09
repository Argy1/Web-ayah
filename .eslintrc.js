// .eslintrc.js
module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "next"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  rules: {
    // matikan semua error @typescript-eslint
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "no-var": "off",
    // kalau masih ada peringatan lain, bisa ditambahkan di sini:
    // "some-rule": "off",
  },
  ignorePatterns: [
    ".next/",
    "node_modules/",
    "public/uploads/",
  ],
}

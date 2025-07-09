// eslint.config.mjs
import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  // inherit aturan Next.js + TS
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // override rules untuk project-mu
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // matikan larangan penggunaan `any` agar build tidak gagal
      "@typescript-eslint/no-explicit-any": "off",
      // ubah unused vars jadi peringatan, bukan error
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
    },
  },
]

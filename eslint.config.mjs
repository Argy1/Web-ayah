import { FlatCompat } from "@eslint/eslintrc"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const compat = new FlatCompat({ baseDirectory: __dirname })

export default [
  // Inherit aturan Next.js + TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Override rules agar build tidak gagal karena any/ununsed vars
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Matikan larangan penggunaan `any`
      "@typescript-eslint/no-explicit-any": "off",
      // Jadikan unused vars hanya warning, bukan error
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

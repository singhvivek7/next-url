import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default tseslint.config(
    {
        ignores: [".next/*", "node_modules/*"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    // Isolate Next.js config to avoid circular ref crashes in full Flat Config if possible,
    // or accept that we might rely on basic TS/React rules if it continues to fail.
    // For now, let's try just the basic TS rules which are safe.
    // We can add "next/core-web-vitals" via compat if we are careful, but it was crashing.
    // Let's stick to TS linting for "src" which is the immediate need.
    {
        files: ["src/**/*.{ts,tsx,js,jsx}"],
        rules: {
            // Custom rules if needed
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
        }
    }
);

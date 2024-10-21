// Importing the eslint-plugin-prettier plugin, which integrates Prettier into ESLint.
import eslintPluginPrettier from "eslint-plugin-prettier";

// Importing the eslint-config-prettier configuration, which turns off all ESLint rules that are unnecessary or might conflict with Prettier.
import eslintConfigPrettier from "eslint-config-prettier";

// Importing the @eslint/js package as a CommonJS module and destructuring the configs property from it.
import pkg from "@eslint/js";
const { configs: eslintRecommended } = pkg;

// Importing the recommended configuration from eslint-plugin-prettier.
import prettierRecommended from "eslint-plugin-prettier/recommended";

// Exporting the ESLint configuration as an array.
export default [
  // Including the recommended ESLint rules from @eslint/js.
  eslintRecommended.recommended,

  // Including the recommended configuration from eslint-plugin-prettier.
  prettierRecommended,

  // Including the eslint-config-prettier configuration to disable conflicting ESLint rules.
  eslintConfigPrettier,

  // Custom configuration object.
  {
    // Specifying the files to which this configuration applies.
    files: ["**/*.js", "**/*.mjs"],

    // Registering the prettier plugin.
    plugins: {
      prettier: eslintPluginPrettier,
    },

    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },

    rules: {
      // Enforcing Prettier formatting as an ESLint error.
      "prettier/prettier": "error",

      // Turn off the rule that disallows console statements
      "no-console": "off",

      // Enforcing the use of === and !== instead of == and !=.
      eqeqeq: "error",

      // Enforcing consistent brace style for all control statements.
      curly: "error",

      // Enforcing consistent use of trailing commas.
      "comma-dangle": ["error", "always-multiline"],

      // Enforcing consistent spacing before and after commas.
      "comma-spacing": ["error", { before: false, after: true }],

      // Enforcing consistent comma style.
      "comma-style": ["error", "last"],

      // Enforcing consistent indentation.
      indent: ["error", 2],

      // Enforcing the use of double quotes for strings.
      quotes: ["error", "double"],

      // Enforcing consistent use of semicolons.
      semi: ["error", "always"],

      // Enforcing consistent spacing inside braces.
      "object-curly-spacing": ["error", "always"],
    },
  },
];

import eslint from '@eslint/js';
import tslint from "typescript-eslint";

export default tslint.config([
	{
		ignores: ["./dist/**/*", "test/*"],
		extends: [
			eslint.configs.recommended,
			...tslint.configs.recommendedTypeChecked,
		],
		files: ["**/*.ts", "*.ts"],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				projectService: true,
				parser: tslint.parser
			},
		},
		rules: {
			semi: "warn",
			"prefer-const": "error",
			"sort-imports": "warn",
			"@typescript-eslint/no-empty-object-type": ["error", { allowInterfaces: 'with-single-extends' }],
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/no-unused-vars": ["error", {
				"args": "all",
				"argsIgnorePattern": "^_",
				"caughtErrors": "all",
				"caughtErrorsIgnorePattern": "^_",
				"destructuredArrayIgnorePattern": "^_",
				"varsIgnorePattern": "^_",
				"ignoreRestSiblings": true
			}]
		}
	},
]);


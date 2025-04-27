/** @type {import('@jest/types').Config.InitialOptions} */

export const extensionsToTreatAsEsm = ['.ts']

export const transform = {
	'^.+\\.tsx?$': [
		'esbuild-jest',
		{
			format: 'esm',
		},
	],
}

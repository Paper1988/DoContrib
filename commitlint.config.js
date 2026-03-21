module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'feat', // New feature
				'fix', // Bug fix
				'docs', // Documentation changes
				'style', // Changes that do not affect the meaning of the code
				'refactor', // Code change that neither fixes a bug nor adds a feature
				'perf', // Code change that improves performance
				'test', // Adding missing tests or correcting existing tests
				'chore', // Changes to the build process or auxiliary tools
				'revert', // Reverts a previous commit
			],
		],
		'subject-full-stop': [0, 'never'],
		'subject-case': [0, 'never'],
	},
}

const { applyTextChanges } = require('./apply-text-changes');
const { getLanguageServiceHost, getVueLanguageServiceHost } = require('./service-host');

/**
 * Organize the given code.
 *
 * @param {string} code
 * @param {import('../index').Options} options
 */
module.exports.organize = (code, { filepath = 'file.ts', parentParser, parser, removeUnusedImports }) => {
	if (parentParser === 'vue') {
		return code; // we do the preprocessing from the `vue` parent parser instead, so we skip the child parsers
	}

	/**
	 * @type {ts.LanguageService}
	 */
	let languageService;

	if (parser === 'vue') {
		languageService = require('@volar/vue-typescript').createLanguageService(getVueLanguageServiceHost(filepath, code));
	} else {
		languageService = require('typescript').createLanguageService(getLanguageServiceHost(filepath, code));
	}

	const fileChanges = languageService.organizeImports(
		{ type: 'file', fileName: filepath, skipDestructiveCodeActions: !removeUnusedImports },
		{},
		{},
	)[0];

	return fileChanges ? applyTextChanges(code, fileChanges.textChanges) : code;
};

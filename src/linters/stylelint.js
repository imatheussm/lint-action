const { exit, run } = require("../utils");

const severityLevels = ["", "warning", "error"];

/**
 * https://stylelint.io
 */
class Stylelint {
	/**
	 * Verifies that all required programs are installed. Exits the GitHub action if one of the
	 * programs is missing
	 */
	static verifySetup() {
		// Verify that NPM is installed (required to execute stylelint)
		try {
			run("command -v npm");
		} catch (err) {
			exit("NPM is not installed");
		}

		// Verify that stylelint is installed
		try {
			run("npx --no-install stylelint -v");
		} catch (err) {
			exit("stylelint is not installed");
		}
	}

	/**
	 * Runs the linting program and returns the command output
	 *
	 * @param {string} dir: Directory to run the linting program in
	 * @param {string[]} extensions: Array of file extensions which should be linted
	 * @returns {string}: Results of the linting process
	 */
	static lint(dir, extensions) {
		const files =
			extensions.length === 1 ? `**/*.${extensions[0]}` : `**/*.{${extensions.join(",")}}`;
		return run(`npx --no-install stylelint --no-color --formatter json '${files}'`, {
			dir,
			ignoreErrors: true,
		}).stdout;
	}

	/**
	 * Parses the results of the linting process and returns it as a processable array
	 *
	 * @param {string} dir: Directory in which the linting program has been run
	 * @param {string} results: Results of the linting process
	 * @returns {object[]}: Parsed results
	 */
	static parseResults(dir, results) {
		const resultsJson = JSON.parse(results);

		// Parsed results: [notices, warnings, failures]
		const resultsParsed = [[], [], []];

		for (const result of resultsJson) {
			const { source, warnings } = result;
			const path = source.substring(dir.length + 1);
			for (const warning of warnings) {
				const { line, severity, text } = warning;
				const severityIdx = severityLevels.indexOf(severity);
				resultsParsed[severityIdx].push({
					path,
					firstLine: line,
					lastLine: line,
					message: text,
				});
			}
		}

		return resultsParsed;
	}
}

module.exports = Stylelint;
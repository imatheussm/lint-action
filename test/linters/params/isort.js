const Isort = require("../../../src/linters/isort");
const { TEST_DATE_ISORT } = require("../../test-utils");

const testName = "isort";
const linter = Isort;
const commandPrefix = "";
const extensions = ["py"];

// Linting without auto-fixing
function getLintParams(dir) {
	const stdoutFile1 = `ERROR: file1.py Imports are incorrectly sorted and/or formatted.\n--- file1.py:before      ${TEST_DATE_ISORT}\n+++ file1.py:after       ${TEST_DATE_ISORT}\n@@ -1 +1,2 @@\n-import sys, os\n+import os\n+import sys`
	const stdoutFile2 = `ERROR: file2.py Imports are incorrectly sorted and/or formatted.\n--- file2.py:before      ${TEST_DATE_ISORT}\n+++ file2.py:after       ${TEST_DATE_ISORT}\n@@ -1,4 +1,3 @@\n+import os\n import pathlib\n-import os\n-\n-import sys+import sys`;
	return {
		// Expected output of the linting function
		cmdOutput: {
			status: 1,
			stdoutParts: [stdoutFile1, stdoutFile2],
			stdout: `${stdoutFile1}\n \n${stdoutFile2}`,
		},
		// Expected output of the parsing function
		lintResult: {
			isSuccess: false,
			warning: [],
			error: [
				{
					path: "file1.py",
					firstLine: 1,
					lastLine: 11,
					message: ` var_1 = "hello"\n var_2 = "world"\n \n \n-def main ():  # Whitespace error\n+def main():  # Whitespace error\n     print("hello " + var_2)\n \n \n def add(num_1, num_2):\n     return num_1 + num_2`,
				},
				{
					path: "file1.py",
					firstLine: 19,
					lastLine: 27,
					message: ` \n \n def divide(num_1, num_2):\n     return num_1 / num_2\n \n+\n # Blank lines error\n \n main()\n `,
				},
				{
					path: "file2.py",
					firstLine: 1,
					lastLine: 3,
					message: ` def add(num_1, num_2):\n-  return num_1 + num_2  # Indentation error\n+    return num_1 + num_2  # Indentation error`,
				},
			],
		},
	};
}

// Linting with auto-fixing
function getFixParams(dir) {
	return {
		// Expected output of the linting function
		cmdOutput: {
			status: 0,
			stdout: "",
		},
		// Expected output of the parsing function
		lintResult: {
			isSuccess: true,
			warning: [],
			error: [],
		},
	};
}

module.exports = [testName, linter, commandPrefix, extensions, getLintParams, getFixParams];

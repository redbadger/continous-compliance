import * as core from '@actions/core';
import * as io from '@actions/io';

import { COMPLIANCE_FOLDER } from '../../shared/constants';

/**
 * @name copyTestFolderIntoCompliance
 * @function
 * @async
 * @returns {void}
 * @description
 * If `tests-folders` input is given it would copy the contents of the folder and paste it into compliance folder
 * @exports copyTestFolderIntoCompliance
 */

const copyTestFolderIntoCompliance = async (): Promise<void> => {
  // Get input 'tests-folder' path from the user
  const testsFolderPath = core.getInput('tests-folder', { required: false });
  // Check if input exists
  const isTestFolderPathSet = Boolean(testsFolderPath);

  if (isTestFolderPathSet) {
    try {
      // Logging into the console
      core.info(
        `Copying test results from ${testsFolderPath} into compliance folder ${COMPLIANCE_FOLDER}`,
      );

      // Copying test-folder into 'compliance-folder'
      const options = { recursive: true, force: false };
      await io.cp(testsFolderPath, COMPLIANCE_FOLDER, options);

      core.info(`Test results are copied into compliance folder 🧪 `);
    } catch (error) {
      throw new Error(
        `Error: failed to copy files from ${testsFolderPath} to ${COMPLIANCE_FOLDER}, ${error.message}`,
      );
    }
  } else {
    core.warning('tests-folder not found');
    return;
  }
};

export default copyTestFolderIntoCompliance;

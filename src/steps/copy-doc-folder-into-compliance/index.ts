import * as core from '@actions/core';
import * as io from '@actions/io';

import { COMPLIANCE_FOLDER } from '../../shared/constants';

/**
 * @name copyDocFolderIntoCompliance
 * @returns {void}
 * @exports copyDocFolderIntoCompliance
 * @function
 * @async
 * @description
 * If `docs-folders` input is given it would copy the contents of the folder and paste it into compliance folder
 * @exports If `docs-folders` input is given it would copy the contents of the folder and paste it into compliance folder
 */
const copyDocFolderIntoCompliance = async (): Promise<void> => {
  // Get input 'docs-folder' path from the user
  const docsFolderPath = core.getInput('docs-folder', { required: false });
  // Check if input exists
  const isDocsFolderPathSet = Boolean(docsFolderPath);

  if (isDocsFolderPathSet) {
    // Logging into the console
    try {
      core.info(
        `Copy documents folder from ${docsFolderPath} into the folder ${COMPLIANCE_FOLDER}`,
      );

      // Copying docs-folder into 'compliance-folder'
      const options = { recursive: true, force: false };
      await io.cp(docsFolderPath, COMPLIANCE_FOLDER, options);
    } catch (error) {
      throw new Error(
        `Error: failed to copy files from ${docsFolderPath} to ${COMPLIANCE_FOLDER}, ${error.message}`,
      );
    }
  } else {
    core.warning(`docs-folder not found`);
    return;
  }
};

export default copyDocFolderIntoCompliance;

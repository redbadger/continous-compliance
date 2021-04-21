import * as io from '@actions/io';
import * as core from '@actions/core';

import { COMPLIANCE_FOLDER } from '../../shared/constants';

/**
 * @name createComplianceFolder
 * @function
 * @async
 * @description
 * Create a a folder called compliance in the root of the project
 * @module createComplianceFolder
 * @returns {void}
 * @description
 * Create a compliance folder on root
 */

const createComplianceFolder = async (): Promise<void> => {
  try {
    // Logging into the console
    core.info(`Creating Compliance folder on ${COMPLIANCE_FOLDER}.`);
    // Create Compliance folder on root
    await io.mkdirP(COMPLIANCE_FOLDER);
    // Logging into the console
    core.info(`Compliance folder created 📂.`);
  } catch (error) {
    throw new Error(
      `Error: failed to create compliance folder ${COMPLIANCE_FOLDER}, ${error.message}.`,
    );
  }
};

export default createComplianceFolder;

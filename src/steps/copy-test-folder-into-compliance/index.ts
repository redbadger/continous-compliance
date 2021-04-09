import * as core from '@actions/core';
import * as io from '@actions/io';

import { COMPLIANCE_FOLDER } from '../../shared/constants';
import logger from '../../shared/logger';

const copyTestFolderIntoCompliance = async (): Promise<void> => {
  const testsFolderPath = core.getInput('tests-folder', { required: false });
  const isTestFolderPathSet = Boolean(testsFolderPath);

  if (isTestFolderPathSet) {
    try {
      logger.info(
        `Copying test results from ${testsFolderPath} into compliance folder ${COMPLIANCE_FOLDER}`,
      );

      const options = { recursive: true, force: false };
      await io.cp(testsFolderPath, COMPLIANCE_FOLDER, options);

      logger.info(`Test results are copied into compliance folder 🧪 `);
    } catch (error) {
      throw new Error(
        `Error: failed to copy files from ${testsFolderPath} to ${COMPLIANCE_FOLDER}, ${error.message}`,
      );
    }
  } else {
    logger.warning('tests-folder not found');
    return;
  }
};

export default copyTestFolderIntoCompliance;

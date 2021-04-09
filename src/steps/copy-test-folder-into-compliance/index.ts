import * as core from '@actions/core';
import * as io from '@actions/io';

import { COMPLIANCE_FOLDER } from '../../shared/constants';

const copyTestFolderIntoCompliance = async (): Promise<void> => {
  const testsFolderPath = core.getInput('tests-folder', { required: false });
  const isTestFolderPathSet = Boolean(testsFolderPath);

  if (isTestFolderPathSet) {
    try {
      const options = { recursive: true, force: false };
      await io.cp(testsFolderPath, COMPLIANCE_FOLDER, options);
    } catch (error) {
      throw new Error(
        `Error: failed to copy files from ${testsFolderPath} to ${COMPLIANCE_FOLDER}, ${error.message}`,
      );
    }
  } else {
    return;
  }
};

export default copyTestFolderIntoCompliance;

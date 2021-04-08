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
      core.setFailed(`Action failed with error ${error.message}`);
    }
  } else {
    return;
  }
};

export default copyTestFolderIntoCompliance;

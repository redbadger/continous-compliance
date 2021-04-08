import * as core from '@actions/core';
import copyTestFolderIntoCompliance from './steps/copy-test-folder-into-compliance';

import createComplianceFolder from './steps/create-compliance-folder';

const start = async (): Promise<void> => {
  try {
    await createComplianceFolder();
    await copyTestFolderIntoCompliance();
  } catch (error) {
    core.setFailed(error.message);
  }
};

start();

import * as core from '@actions/core';

import compressComplianceFolder from './steps/compress-compliance-folder';
import copyTestFolderIntoCompliance from './steps/copy-test-folder-into-compliance';
import createComplianceFolder from './steps/create-compliance-folder';

const start = async (): Promise<void> => {
  try {
    await createComplianceFolder();
    await copyTestFolderIntoCompliance();
    await compressComplianceFolder();
  } catch (error) {
    core.setFailed(error.message);
  }
};

start();

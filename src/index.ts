import * as core from '@actions/core';

import compressComplianceFolder from './steps/compress-compliance-folder';
import copyTestFolderIntoCompliance from './steps/copy-test-folder-into-compliance';
import createComplianceFolder from './steps/create-compliance-folder';
import createDocFolder from './steps/copy-doc-folder-into-compliance';

const start = async (): Promise<void> => {
  try {
    await createComplianceFolder();
    await copyTestFolderIntoCompliance();
    await createDocFolder();
    await compressComplianceFolder();
  } catch (error) {
    core.setFailed(error.message);
  }
};

start();

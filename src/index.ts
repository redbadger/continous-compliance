import * as core from '@actions/core';

import compressComplianceFolder from './steps/compress-compliance-folder';
import copyTestFolderIntoCompliance from './steps/copy-test-folder-into-compliance';
import createComplianceFolder from './steps/create-compliance-folder';
import storeCompressedComplianceFolderInABucket from './steps/store-compressed-compliance-folder-in-a-bucket';

const start = async (): Promise<void> => {
  try {
    await createComplianceFolder();
    await copyTestFolderIntoCompliance();
    const zipFilePath = await compressComplianceFolder();
    await storeCompressedComplianceFolderInABucket(zipFilePath);
  } catch (error) {
    core.setFailed(error.message);
  }
};

start();

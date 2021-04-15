import * as core from '@actions/core';

import compressComplianceFolder from './steps/compress-compliance-folder';
import copyTestFolderIntoCompliance from './steps/copy-test-folder-into-compliance';
import createComplianceFolder from './steps/create-compliance-folder';
import storeCompressedComplianceFolderInABucket from './steps/store-compressed-compliance-folder-in-a-bucket';
import copyDocFolderIntoCompliance from './steps/copy-doc-folder-into-compliance';
import getPrInformationIntoCompliance from './steps/get-pr-information-into-compliance';

const start = async (): Promise<void> => {
  try {
    await createComplianceFolder();
    await copyTestFolderIntoCompliance();
    await copyDocFolderIntoCompliance();
    await getPrInformationIntoCompliance();
    await compressComplianceFolder();
    await storeCompressedComplianceFolderInABucket();
  } catch (error) {
    core.setFailed(error.message);
  }
};

start();

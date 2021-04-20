import * as core from '@actions/core';

import compressComplianceFolder from './steps/compress-compliance-folder';
import copyTestFolderIntoCompliance from './steps/copy-test-folder-into-compliance';
import createComplianceFolder from './steps/create-compliance-folder';
import storeCompressedComplianceFolderInABucket from './steps/store-compressed-compliance-folder-in-a-bucket';
import copyDocFolderIntoCompliance from './steps/copy-doc-folder-into-compliance';
import getGhInformationIntoCompliance from './steps/get-gh-information-into-compliance';
import createTxtFiles from './steps/create-txt-files';

const start = async (): Promise<void> => {
  try {
    await createComplianceFolder();
    await copyTestFolderIntoCompliance();
    await copyDocFolderIntoCompliance();
    await getGhInformationIntoCompliance();
    await createTxtFiles();
    await compressComplianceFolder();
    await storeCompressedComplianceFolderInABucket();
  } catch (error) {
    core.setFailed(error.message);
  }
};

start();

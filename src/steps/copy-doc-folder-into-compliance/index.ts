import * as exec from '@actions/exec';
import * as core from '@actions/core';

import { COMPLIANCE_FOLDER } from '../../shared/constants';

const copyDocFolderIntoCompliance = async (): Promise<void> => {
  try {
    core.info('Test doc-folder');
  } catch (error) {
    throw new Error(`Error: failed something ${error.message}`);
  }
};

export default copyDocFolderIntoCompliance;

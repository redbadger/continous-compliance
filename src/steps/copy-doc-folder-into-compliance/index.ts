import * as exec from '@actions/exec';
import * as core from '@actions/core';
import * as io from '@actions/io';

import { COMPLIANCE_FOLDER } from '../../shared/constants';

const docsFolderPath = core.getInput('doc-folder');
const isDocsFolderPathSet = Boolean(docsFolderPath);

const copyDocFolderIntoCompliance = async (): Promise<void> => {
  if (isDocsFolderPathSet) {
    try {
      core.info(
        `Copy documents folder from ${docsFolderPath} into the compliance folder ${COMPLIANCE_FOLDER}`,
      );

      const options = { required: false, force: false };
      await io.cp(docsFolderPath, COMPLIANCE_FOLDER, options);
    } catch (error) {
      throw new Error(
        `Error: failed to copy ${docsFolderPath} to ${COMPLIANCE_FOLDER}, ${error.message}`,
      );
    }
  } else {
    core.warning(`doc-folder not found`);
    return;
  }
};

export default copyDocFolderIntoCompliance;

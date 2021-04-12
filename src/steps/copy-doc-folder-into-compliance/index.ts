import * as exec from '@actions/exec';
import * as core from '@actions/core';
import * as io from '@actions/io';

import { COMPLIANCE_FOLDER } from '../../shared/constants';

const copyDocFolderIntoCompliance = async (): Promise<void> => {
  const docsFolderPath = core.getInput('docs-folder', { required: false });
  const isDocsFolderPathSet = Boolean(docsFolderPath);

  if (isDocsFolderPathSet) {
    try {
      core.info(
        `Copy documents folder from ${docsFolderPath} into the folder ${COMPLIANCE_FOLDER}`,
      );

      const options = { recursive: true, force: false };
      await io.cp(docsFolderPath, COMPLIANCE_FOLDER, options);
    } catch (error) {
      throw new Error(
        `Error: failed to copy ${docsFolderPath} to ${COMPLIANCE_FOLDER}, ${error.message}`,
      );
    }
  } else {
    core.warning(`docs-folder not found`);
    return;
  }
};

export default copyDocFolderIntoCompliance;

import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';

import { COMPLIANCE_FOLDER } from '../../shared/constants';

const copyTestFolderIntoCompliance = async (): Promise<void> => {
  const testsFolderPath = core.getInput('tests-folder', { required: false });
  try {
    //  eslint-disable-next-line no-console
    console.log({ testsFolderPath });
    const options = { recursive: true, force: false };

    await io.cp(testsFolderPath, COMPLIANCE_FOLDER, options);

    await exec.exec('ls -lah');
    await exec.exec(`ls -lah ./${COMPLIANCE_FOLDER}`);
  } catch (error) {
    core.setFailed(`Action failed with error ${error.message}`);
  }
};

export default copyTestFolderIntoCompliance;

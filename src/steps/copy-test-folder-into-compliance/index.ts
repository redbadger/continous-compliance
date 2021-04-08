import * as core from '@actions/core';
import * as exec from '@actions/exec';

const copyTestFolderIntoCompliance = async (): Promise<void> => {
  const testsFolderPath = core.getInput('tests-folder', { required: false });
  try {
    //  eslint-disable-next-line no-console
    console.log({ testsFolderPath });
    await exec.exec('ls -lah');
  } catch (error) {
    core.setFailed(`Action failed with error ${error}`);
  }
};

export default copyTestFolderIntoCompliance;

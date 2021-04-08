import * as core from '@actions/core';
import copyTestFolderIntoCompliance from './steps/copy-test-folder-into-compliance';

const start = async (): Promise<void> => {
  try {
    await copyTestFolderIntoCompliance();
  } catch (error) {
    core.setFailed(error.message);
  }
};

start();

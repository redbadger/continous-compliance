import * as core from '@actions/core';

const start = async (): Promise<void> => {
  try {
    console.log(`Hello!`);
    core.setOutput(
      'compliance-evidence-url',
      'https://i-am-an-url-to-a-compliance-folder.com',
    );
  } catch (error) {
    core.setFailed(error.message);
  }
};

start();

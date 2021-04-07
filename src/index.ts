import core from '@actions/core';

try {
  console.log(`Hello!`);
  core.setOutput(
    'compliance-evidence-url',
    'https://i-am-an-url-to-a-compliance-folder.com',
  );
} catch (error) {
  core.setFailed(error.message);
}

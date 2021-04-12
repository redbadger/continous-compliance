import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as googleCloudStorage from '@google-cloud/storage';

const { Storage } = googleCloudStorage;

const keyFilename =
  '/home/runner/work/count-dracula/count-draculaservice-account.json';

const storeCompressedComplianceFolderInABucket = async (
  zipFilePath: string,
): Promise<void> => {
  const gcpProjectId = core.getInput('gcp-project-id', { required: true });
  const gcpApplicationCredentials = core.getInput(
    'gcp-application-credentials',
    { required: true },
  );

  try {
    await exec.exec(`touch ${keyFilename}`);

    console.log('echo credentials into file');
    await exec.exec(`echo "${gcpApplicationCredentials}" >> ${keyFilename}`);
    await exec.exec('ls -lah');
    await exec.exec('pwd');
    console.log('cat service-account.json');
    await exec.exec('cat service-account.json');

    const storage = new Storage({
      keyFilename,
    });

    const result = await storage
      .bucket('count-dracula-continous-compliance-prod')
      .upload(zipFilePath, {
        destination: zipFilePath,
      });

    console.log({ result });
  } catch (error) {
    throw new Error(
      `Error: failed to send zip to Google Cloud storage, ${error.message}`,
    );
  }
};

export default storeCompressedComplianceFolderInABucket;

import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as googleCloudStorage from '@google-cloud/storage';

const { Storage } = googleCloudStorage;

const keyFilename = '/tmp/account.json';

const storeCompressedComplianceFolderInABucket = async (
  zipFilePath: string,
): Promise<void> => {
  const gcpProjectId = core.getInput('gcp-project-id', { required: true });
  const gcpApplicationCredentials = core.getInput(
    'gcp-application-credentials',
    { required: true },
  );

  try {
    /*
    TODO:
    Get credentials
    decode base64 credentials and stored
    
    initialize GCP client
    Send ZIP file to bucket
    Set output to be URL of the file
    */

    await exec.exec(
      `echo ${gcpApplicationCredentials} | base64 -d > ${keyFilename}`,
    );

    const storage = new Storage({
      keyFilename,
    });

    await storage
      .bucket('count-dracula-continous-compliance-prod')
      .upload(zipFilePath, {
        destination: zipFilePath,
      });
  } catch (error) {
    throw new Error(
      `Error: failed to send zip to Google Cloud storage, ${error.message}`,
    );
  }
};

export default storeCompressedComplianceFolderInABucket;

// gcp-project-id
// gcp-application-credentials

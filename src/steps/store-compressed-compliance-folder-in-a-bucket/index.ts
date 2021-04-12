import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as googleCloudStorage from '@google-cloud/storage';
import * as fs from 'fs';

const {
  promises: { writeFile, readFile },
} = fs;

const { Storage } = googleCloudStorage;

const keyFilename =
  '/home/runner/work/count-dracula/count-dracula/service-account.json';

const createServiceAccountFile = async (credentials: string) => {
  try {
    const jsonCredentials = Buffer.from(credentials, 'base64').toString(
      'utf-8',
    );
    await writeFile(keyFilename, jsonCredentials);
  } catch (error) {
    throw new Error(error);
  }
};

const storeCompressedComplianceFolderInABucket = async (
  zipFilePath: string,
): Promise<void> => {
  const gcpProjectId = core.getInput('gcp-project-id', { required: true });
  const gcpApplicationCredentials = core.getInput(
    'gcp-application-credentials',
    { required: true },
  );

  try {
    await createServiceAccountFile(gcpApplicationCredentials);
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

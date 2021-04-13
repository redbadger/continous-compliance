import * as core from '@actions/core';
import * as fs from 'fs';
import * as glob from '@actions/glob';
import * as googleCloudStorage from '@google-cloud/storage';

const {
  promises: { writeFile },
} = fs;

const { Storage } = googleCloudStorage;

const keyFilename = './service-account.json';

export const createServiceAccountFile = async (credentials: string) => {
  try {
    const jsonCredentials = Buffer.from(credentials, 'base64').toString(
      'utf-8',
    );
    await writeFile(keyFilename, jsonCredentials);
  } catch (error) {
    throw new Error(error);
  }
};

export const getZipFilePath = async (): Promise<string> => {
  try {
    const patterns = ['*.zip'];
    const globber = await glob.create(patterns.join('\n'));
    const [file] = await globber.glob();
    return file;
  } catch (error) {
    throw new Error('Error: zip file not found');
  }
};

const storeCompressedComplianceFolderInABucket = async (): Promise<void> => {
  const gcpApplicationCredentials = core.getInput(
    'gcp-application-credentials',
    { required: true },
  );

  const gcpBucketName = core.getInput('gcp-bucket-name', { required: true });

  try {
    core.info(`Decoding gcp-application-credentials 👀`);
    await createServiceAccountFile(gcpApplicationCredentials);

    core.info(`Authenticating with Google Cloud storage ✍🏻`);
    const storage = new Storage({
      keyFilename,
    });
    const bucket = await storage.bucket(gcpBucketName);

    const zipFilePath = await getZipFilePath();
    const destination = zipFilePath.split('/').pop() as string;

    core.info(`Uploading zip file to Google Cloud storage 📡`);
    await bucket.upload(zipFilePath, {
      destination,
    });

    const file = await bucket.file(destination);
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    core.info(`Compliance evidence uploaded to ${signedUrl}`);
    core.setOutput('compliance-evidence-url', signedUrl);
  } catch (error) {
    throw new Error(
      `Error: failed to send zip to Google Cloud storage, ${error.message}`,
    );
  }
};

export default storeCompressedComplianceFolderInABucket;

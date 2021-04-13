import * as core from '@actions/core';
import * as googleCloudStorage from '@google-cloud/storage';
import * as fs from 'fs';
import * as glob from '@actions/glob';

const {
  promises: { writeFile },
} = fs;

const { Storage } = googleCloudStorage;

const keyFilename = './service-account.json';

const createServiceAccountFile = async (credentials: string) => {
  try {
    const patterns = ['*.zip'];
    const globber = await glob.create(patterns.join('\n'));
    const files = await globber.glob();

    console.log({
      files,
    });

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
  const gcpApplicationCredentials = core.getInput(
    'gcp-application-credentials',
    { required: true },
  );

  const gcpBuketName = core.getInput('gcp-bucket-name', { required: true });

  try {
    core.info(`Decoding gcp-application-credentials 👀`);

    await createServiceAccountFile(gcpApplicationCredentials);
    const storage = new Storage({
      keyFilename,
    });

    core.info(`Authenticating with Google Cloud storage ✍🏻`);
    const bucket = await storage.bucket(gcpBuketName);

    core.info(`Uploading zip file to Google Cloud storage 📡`);
    await bucket.upload(zipFilePath, {
      destination: zipFilePath,
    });

    const file = await bucket.file(zipFilePath);

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

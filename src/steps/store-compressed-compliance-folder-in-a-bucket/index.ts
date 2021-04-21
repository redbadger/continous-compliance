import * as core from '@actions/core';
import * as fs from 'fs';
import * as glob from '@actions/glob';
import * as googleCloudStorage from '@google-cloud/storage';

const {
  promises: { writeFile },
} = fs;

const { Storage } = googleCloudStorage;

const keyFilename = './service-account.json';

/**
 * @async
 * @description
 * Take a base 64 encoded credentials string, decoded and write the contents into GOOGLE_CREDENTIALS JSON file
 * @exports createServiceAccountFile
 * @function
 * @name createServiceAccountFile
 * @param {string}
 * @returns {void}
 */

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

/**
 * @async
 * @description
 * Using Github actions glob library search for any zip file in the root folder and return the path
 * @exports getZipFilePath
 * @function
 * @name getZipFilePath
 * @returns {string}
 */

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

/**
 * @async
 * @description
 * Using Google Cloud storage node client take a zip file and store it in a
 * bucket and then create signed url and console log it
 * @exports storeCompressedComplianceFolderInABucket
 * @function
 * @name storeCompressedComplianceFolderInABucket
 * @returns {void}
 */

const storeCompressedComplianceFolderInABucket = async (): Promise<void> => {
  const gcpApplicationCredentials = core.getInput(
    'gcp-application-credentials',
    { required: true },
  );

  const gcpBucketName = core.getInput('gcp-bucket-name', { required: true });

  try {
    // Logging into the console
    core.info(`Decoding gcp-application-credentials 👀`);
    // Create GOOGLE_CREDENTIALS JSON file
    await createServiceAccountFile(gcpApplicationCredentials);

    core.info(`Authenticating with Google Cloud storage ✍🏻`);

    // Instantiate Google Cloud storage client
    const storage = new Storage({
      keyFilename,
    });
    const bucket = await storage.bucket(gcpBucketName);

    // Get zip file path
    const zipFilePath = await getZipFilePath();
    const destination = zipFilePath.split('/').pop() as string;

    core.info(`Uploading zip file to Google Cloud storage 📡`);
    // Upload file into a bucket
    await bucket.upload(zipFilePath, {
      destination,
    });
    // Create a signed download URL
    const file = await bucket.file(destination);
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    // Logging into the console signed URL
    core.info(`Compliance evidence uploaded to ${signedUrl}`);
    core.setOutput('compliance-evidence-url', signedUrl);
  } catch (error) {
    throw new Error(
      `Error: failed to send zip to Google Cloud storage, ${error.message}`,
    );
  }
};

export default storeCompressedComplianceFolderInABucket;

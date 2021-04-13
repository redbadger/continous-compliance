import * as storeIntoBucket from './index';

import * as core from '@actions/core';
import * as fs from 'fs';
import * as glob from '@actions/glob';
import * as googleCloudStorage from '@google-cloud/storage';

const { promises } = fs;
const { default: storeCompressedComplianceFolderInABucket } = storeIntoBucket;

jest.mock('@google-cloud/storage', () => ({
  Storage: jest.fn(() => ({
    bucket: jest.fn(() => ({
      file: jest.fn(() => ({
        name: 'some-address.zip',
        getSignedUrl: jest.fn(() => 'https://bucket-url.com/some-address.zip'),
      })),
      upload: jest.fn(),
    })),
  })),
}));

describe('storeCompressedComplianceFolderInABucket', () => {
  beforeEach(() => {
    // Prevent console.logs
    jest.spyOn(core, 'info').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should upload a file', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(jest.fn());
    jest.spyOn(core, 'info').mockImplementation(jest.fn());
    jest.spyOn(core, 'setOutput').mockImplementation(jest.fn());
    jest.spyOn(promises, 'writeFile').mockImplementation(jest.fn());
    jest.spyOn(glob, 'create').mockImplementation(jest.fn());
    jest
      .spyOn(storeIntoBucket, 'createServiceAccountFile')
      .mockImplementation(jest.fn());
    jest
      .spyOn(storeIntoBucket, 'getZipFilePath')
      .mockImplementation(async () => '/home/runner/count-dracula/1234.zip');

    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const infoSpy = core.info as jest.Mock<any, any>;
    const setOutputSpy = core.setOutput as jest.Mock<any, any>;
    const createServiceAccountFileSpy = storeIntoBucket.createServiceAccountFile as jest.Mock<
      any,
      any
    >;
    const getZipFilePathSpy = storeIntoBucket.getZipFilePath as jest.Mock<
      any,
      any
    >;

    const StorageSpy = googleCloudStorage.Storage;

    // Sanity check
    expect.assertions(20);
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(infoSpy).toHaveBeenCalledTimes(0);
    expect(setOutputSpy).toHaveBeenCalledTimes(0);
    expect(createServiceAccountFileSpy).toHaveBeenCalledTimes(0);
    expect(getZipFilePathSpy).toHaveBeenCalledTimes(0);
    expect(StorageSpy).toHaveBeenCalledTimes(0);

    // calling the function to test
    await storeCompressedComplianceFolderInABucket();

    expect(infoSpy).toHaveBeenCalledTimes(4);
    expect(setOutputSpy).toHaveBeenCalledTimes(1);
    expect(getInputSpy).toHaveBeenCalledTimes(2);
    expect(createServiceAccountFileSpy).toHaveBeenCalledTimes(1);
    expect(getZipFilePathSpy).toHaveBeenCalledTimes(1);
    expect(StorageSpy).toHaveBeenCalledTimes(1);

    expect(infoSpy).toHaveBeenNthCalledWith(
      1,
      'Decoding gcp-application-credentials 👀',
    );

    expect(infoSpy).toHaveBeenNthCalledWith(
      2,
      'Authenticating with Google Cloud storage ✍🏻',
    );

    expect(infoSpy).toHaveBeenNthCalledWith(
      3,
      'Uploading zip file to Google Cloud storage 📡',
    );

    expect(infoSpy).toHaveBeenNthCalledWith(
      4,
      'Compliance evidence uploaded to h',
    );

    expect(getInputSpy).toHaveBeenNthCalledWith(
      1,
      'gcp-application-credentials',
      { required: true },
    );

    expect(getInputSpy).toHaveBeenNthCalledWith(2, 'gcp-bucket-name', {
      required: true,
    });
    expect(setOutputSpy).toBeCalledWith('compliance-evidence-url', 'h');
    expect(StorageSpy).toBeCalledWith({
      keyFilename: './service-account.json',
    });
  });

  it('should throw an error when createServiceAccountFile failed', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(jest.fn());
    jest.spyOn(core, 'info').mockImplementation(jest.fn());
    jest.spyOn(core, 'setOutput').mockImplementation(jest.fn());
    jest.spyOn(promises, 'writeFile').mockImplementation(jest.fn());
    jest.spyOn(glob, 'create').mockImplementation(jest.fn());
    jest
      .spyOn(storeIntoBucket, 'createServiceAccountFile')
      .mockImplementation(() => {
        throw new Error('💥');
      });
    jest
      .spyOn(storeIntoBucket, 'getZipFilePath')
      .mockImplementation(async () => '/home/runner/count-dracula/1234.zip');

    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const infoSpy = core.info as jest.Mock<any, any>;
    const setOutputSpy = core.setOutput as jest.Mock<any, any>;
    const createServiceAccountFileSpy = storeIntoBucket.createServiceAccountFile as jest.Mock<
      any,
      any
    >;
    const getZipFilePathSpy = storeIntoBucket.getZipFilePath as jest.Mock<
      any,
      any
    >;

    const StorageSpy = googleCloudStorage.Storage;

    // Sanity check
    expect.assertions(7);
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(infoSpy).toHaveBeenCalledTimes(0);
    expect(setOutputSpy).toHaveBeenCalledTimes(0);
    expect(createServiceAccountFileSpy).toHaveBeenCalledTimes(0);
    expect(getZipFilePathSpy).toHaveBeenCalledTimes(0);
    expect(StorageSpy).toHaveBeenCalledTimes(0);

    try {
      // calling the function to test
      await storeCompressedComplianceFolderInABucket();
      expect(
        async () => await storeCompressedComplianceFolderInABucket(),
      ).toThrow('💥');
    } catch (error) {
      expect(error.message).toBe(
        'Error: failed to send zip to Google Cloud storage, 💥',
      );
    }
  });

  it('should throw an error when getZipFilePath failed', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(jest.fn());
    jest.spyOn(core, 'info').mockImplementation(jest.fn());
    jest.spyOn(core, 'setOutput').mockImplementation(jest.fn());
    jest.spyOn(promises, 'writeFile').mockImplementation(jest.fn());
    jest.spyOn(glob, 'create').mockImplementation(jest.fn());
    jest
      .spyOn(storeIntoBucket, 'createServiceAccountFile')
      .mockImplementation(jest.fn());
    jest.spyOn(storeIntoBucket, 'getZipFilePath').mockImplementation(() => {
      throw Error('💣');
    });

    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const infoSpy = core.info as jest.Mock<any, any>;
    const setOutputSpy = core.setOutput as jest.Mock<any, any>;
    const createServiceAccountFileSpy = storeIntoBucket.createServiceAccountFile as jest.Mock<
      any,
      any
    >;
    const getZipFilePathSpy = storeIntoBucket.getZipFilePath as jest.Mock<
      any,
      any
    >;

    const StorageSpy = googleCloudStorage.Storage;

    // Sanity check
    expect.assertions(7);
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(infoSpy).toHaveBeenCalledTimes(0);
    expect(setOutputSpy).toHaveBeenCalledTimes(0);
    expect(createServiceAccountFileSpy).toHaveBeenCalledTimes(0);
    expect(getZipFilePathSpy).toHaveBeenCalledTimes(0);
    expect(StorageSpy).toHaveBeenCalledTimes(0);

    try {
      // calling the function to test
      await storeCompressedComplianceFolderInABucket();
      expect(
        async () => await storeCompressedComplianceFolderInABucket(),
      ).toThrow('💣');
    } catch (error) {
      expect(error.message).toBe(
        'Error: failed to send zip to Google Cloud storage, 💣',
      );
    }
  });
});

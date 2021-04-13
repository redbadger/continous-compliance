import * as storeIntoBucket from './index';

import * as core from '@actions/core';
import * as fs from 'fs';
import * as glob from '@actions/glob';
import * as googleCloudStorage from '@google-cloud/storage';

const { promises } = fs;
const { default: storeCompressedComplianceFolderInABucket } = storeIntoBucket;

const mockedFile = {
  name: 'dev.txt',
  getSignedUrl: jest.fn(() => 'https://bucket-url.com/some-address.zip'),
};

const mockedBucket = {
  file: jest.fn(() => mockedFile),
  upload: jest.fn(),
};

const mockedStorage = {
  bucket: jest.fn(() => mockedBucket),
};

jest.mock('@google-cloud/storage', () => {
  return {
    Storage: jest.fn(() => mockedStorage),
  };
});

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
      .mockImplementation(async () => '1234.zip');
    // jest
    //   .spyOn(googleCloudStorage, 'Storage')
    //   .mockImplementation(jest.fn(() => mockedBucket));

    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const infoSpy = core.info as jest.Mock<any, any>;
    const setOutputspy = core.setOutput as jest.Mock<any, any>;
    const writeFileSpy = promises.writeFile as jest.Mock<any, any>;
    const createSpy = glob.create as jest.Mock<any, any>;
    const createServiceAccountFileSpy = storeIntoBucket.createServiceAccountFile as jest.Mock<
      any,
      any
    >;
    const getZipFilePathSpy = storeIntoBucket.getZipFilePath as jest.Mock<
      any,
      any
    >;

    const StorageSpy = googleCloudStorage.Storage;

    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(infoSpy).toHaveBeenCalledTimes(0);
    expect(setOutputspy).toHaveBeenCalledTimes(0);
    expect(writeFileSpy).toHaveBeenCalledTimes(0);
    expect(createSpy).toHaveBeenCalledTimes(0);
    expect(createServiceAccountFileSpy).toHaveBeenCalledTimes(0);
    expect(getZipFilePathSpy).toHaveBeenCalledTimes(0);
    expect(StorageSpy).toHaveBeenCalledTimes(0);

    await storeCompressedComplianceFolderInABucket();

    expect(infoSpy).toHaveBeenCalledTimes(4);
    expect(setOutputspy).toHaveBeenCalledTimes(1);
  });
});

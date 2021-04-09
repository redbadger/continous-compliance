import * as core from '@actions/core';
import * as io from '@actions/io';

import { COMPLIANCE_FOLDER } from '../../shared/constants';
import copyTestFolderIntoCompliance from './index';

describe('copyTestFolderIntoCompliance', () => {
  const testFolder = 'web/tests-folders';

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return when tests-folder path is not set', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(jest.fn());
    jest.spyOn(io, 'cp').mockImplementation(jest.fn());

    process.env['tests-folder'] = '';
    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const cpSpy = io.cp as jest.Mock<any, any>;

    // sanity check
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(cpSpy).toHaveBeenCalledTimes(0);

    const result = await copyTestFolderIntoCompliance();

    expect(getInputSpy).toHaveBeenCalledTimes(1);
    expect(getInputSpy).toHaveBeenCalledWith('tests-folder', {
      required: false,
    });
    expect(cpSpy).toHaveBeenCalledTimes(0);
    expect(result).toBeUndefined();
  });

  it('should copy test folder into compliance folder', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(jest.fn(() => testFolder));
    jest.spyOn(io, 'cp').mockImplementation(jest.fn());

    process.env['tests-folder'] = testFolder;
    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const cpSpy = io.cp as jest.Mock<any, any>;

    // sanity check
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(cpSpy).toHaveBeenCalledTimes(0);

    await copyTestFolderIntoCompliance();

    expect(getInputSpy).toHaveBeenCalledTimes(1);
    expect(getInputSpy).toHaveBeenCalledWith('tests-folder', {
      required: false,
    });
    expect(cpSpy).toHaveBeenCalledTimes(1);
    expect(cpSpy).toHaveBeenCalledWith(testFolder, COMPLIANCE_FOLDER, {
      recursive: true,
      force: false,
    });
  });

  it('should log an error copy test folder into compliance folder', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(jest.fn(() => testFolder));
    jest.spyOn(io, 'cp').mockImplementationOnce(() => {
      throw new Error('💥');
    });

    process.env['tests-folder'] = testFolder;
    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const cpSpy = io.cp as jest.Mock<any, any>;

    // sanity check
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(cpSpy).toHaveBeenCalledTimes(0);

    try {
      await copyTestFolderIntoCompliance();
      expect(getInputSpy).toHaveBeenCalledTimes(1);
      expect(getInputSpy).toHaveBeenCalledWith('tests-folder', {
        required: false,
      });
      expect(async () => {
        await copyTestFolderIntoCompliance();
      }).toThrow('💥');
    } catch (error) {
      expect(error.message).toBe(
        `Error: failed to copy files from ${testFolder} to ${COMPLIANCE_FOLDER}, 💥`,
      );
    }
  });
});

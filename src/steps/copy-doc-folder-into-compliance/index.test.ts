import * as core from '@actions/core';
import * as io from '@actions/io';

import { COMPLIANCE_FOLDER } from '../../shared/constants';
import copyDocFolderIntoCompliance from './index';

describe('copyDocFolderIntoCompliance', () => {
  const docFolder = 'web/docs-folders';

  beforeEach(() => {
    // Prevent console.logs
    jest.spyOn(core, 'info').mockImplementation(jest.fn());
    jest.spyOn(core, 'warning').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return when docs-folder path is not set', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(jest.fn());
    jest.spyOn(io, 'cp').mockImplementation(jest.fn());

    process.env['docs-folder'] = '';
    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const cpSpy = io.cp as jest.Mock<any, any>;

    // sanity check
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(cpSpy).toHaveBeenCalledTimes(0);

    const result = await copyDocFolderIntoCompliance();

    expect(getInputSpy).toHaveBeenCalledTimes(1);
    expect(getInputSpy).toHaveBeenCalledWith('docs-folder', {
      required: false,
    });
    expect(cpSpy).toHaveBeenCalledTimes(0);
    expect(result).toBeUndefined();
  });

  it('should copy doc folder into compliance folder', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(jest.fn(() => docFolder));
    jest.spyOn(io, 'cp').mockImplementation(jest.fn());

    process.env['docs-folder'] = docFolder;
    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const cpSpy = io.cp as jest.Mock<any, any>;

    // sanity check
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(cpSpy).toHaveBeenCalledTimes(0);

    await copyDocFolderIntoCompliance();

    expect(getInputSpy).toHaveBeenCalledTimes(1);
    expect(getInputSpy).toHaveBeenCalledWith('docs-folder', {
      required: false,
    });
    expect(cpSpy).toHaveBeenCalledTimes(1);
    expect(cpSpy).toHaveBeenCalledWith(docFolder, COMPLIANCE_FOLDER, {
      recursive: true,
      force: false,
    });
  });

  it('should log an error copy docs folder into compliance folder', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(jest.fn(() => docFolder));
    jest.spyOn(io, 'cp').mockImplementationOnce(() => {
      throw new Error('💥');
    });

    process.env['docs-folder'] = docFolder;
    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const cpSpy = io.cp as jest.Mock<any, any>;

    // sanity check
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(cpSpy).toHaveBeenCalledTimes(0);

    try {
      await copyDocFolderIntoCompliance();
      expect(getInputSpy).toHaveBeenCalledTimes(1);
      expect(getInputSpy).toHaveBeenCalledWith('docs-folder', {
        required: false,
      });
      expect(async () => {
        await copyDocFolderIntoCompliance();
      }).toThrow('💥');
    } catch (error) {
      expect(error.message).toBe(
        `Error: failed to copy files from ${docFolder} to ${COMPLIANCE_FOLDER}, 💥`,
      );
    }
  });
});

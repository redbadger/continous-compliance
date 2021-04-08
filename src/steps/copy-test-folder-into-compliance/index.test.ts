import * as core from '@actions/core';
import * as io from '@actions/io';

import { COMPLIANCE_FOLDER } from '../../shared/constants';
import copyTestFolderIntoCompliance from './index';

describe('copyTestFolderIntoCompliance', () => {
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
});

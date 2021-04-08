import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { clear, advanceTo } from 'jest-date-mock';

import { COMPLIANCE_FOLDER } from '../../shared/constants';
import compressComplianceFolder from './index';

describe('compressComplianceFolder', () => {
  afterEach(() => {
    clear();
    jest.restoreAllMocks();
  });

  it('should compress compliance folder', async () => {
    const unixTime = 1617895058;

    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());
    jest.spyOn(exec, 'exec').mockImplementation(jest.fn());

    const setFailedspy = core.setFailed as jest.Mock<any, any>;
    const execSpy = exec.exec as jest.Mock<any, any>;

    // sanity check
    expect(setFailedspy).toHaveBeenCalledTimes(0);
    expect(execSpy).toHaveBeenCalledTimes(0);

    // Mock time
    advanceTo(unixTime);

    const unixTimeLabel = Number((1617895058 / 1000).toFixed(0));

    await compressComplianceFolder();

    expect(execSpy).toHaveBeenCalledTimes(1);
    expect(execSpy).toHaveBeenCalledWith(
      `zip -r ${unixTimeLabel}.zip ./${COMPLIANCE_FOLDER}`,
    );
  });
});

import * as exec from '@actions/exec';
import * as core from '@actions/core';
import { clear, advanceTo } from 'jest-date-mock';

import { COMPLIANCE_FOLDER } from '../../shared/constants';
import compressComplianceFolder from './index';

describe('compressComplianceFolder', () => {
  beforeEach(() => {
    // Prevent console.logs
    jest.spyOn(core, 'info').mockImplementation(jest.fn());
  });

  afterEach(() => {
    clear();
    jest.restoreAllMocks();
  });

  it('should compress compliance folder', async () => {
    const unixTime = 1617895058;

    jest.spyOn(exec, 'exec').mockImplementation(jest.fn());

    const execSpy = exec.exec as jest.Mock<any, any>;

    // sanity check
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

  it('should throw an error when compress compliance folder fails', async () => {
    const bang = '💥';

    jest.spyOn(exec, 'exec').mockImplementationOnce(() => {
      throw new Error(bang);
    });

    const execSpy = exec.exec as jest.Mock<any, any>;

    // sanity check
    expect(execSpy).toHaveBeenCalledTimes(0);

    try {
      await compressComplianceFolder();

      expect(execSpy).toHaveBeenCalledTimes(1);
      expect(async () => {
        await compressComplianceFolder();
      }).toThrow(bang);
    } catch (error) {
      expect(error.message).toBe(
        `Error: failed to compressed ${COMPLIANCE_FOLDER}, ${bang}.`,
      );
    }
  });
});

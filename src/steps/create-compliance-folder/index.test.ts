import * as io from '@actions/io';
import * as core from '@actions/core';
import createComplianceFolder from './index';
import { COMPLIANCE_FOLDER } from '../../shared/constants';

describe('createComplianceFolder', () => {
  beforeEach(() => {
    // Prevent console.logs
    jest.spyOn(core, 'info').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a compliance folder', async () => {
    jest.spyOn(io, 'mkdirP').mockImplementation(jest.fn());

    const mkdirPSpy = io.mkdirP as jest.Mock<any, any>;
    // sanity check
    expect(mkdirPSpy).toHaveBeenCalledTimes(0);

    await createComplianceFolder();

    expect(mkdirPSpy).toHaveBeenCalledTimes(1);
    expect(mkdirPSpy).toHaveBeenCalledWith(COMPLIANCE_FOLDER);
  });

  it('should log an error when failed to create complaince folder', async () => {
    jest.spyOn(io, 'mkdirP').mockImplementationOnce(() => {
      throw new Error('💥');
    });

    const mkdirPSpy = io.mkdirP as jest.Mock<any, any>;

    // sanity check
    expect(mkdirPSpy).toHaveBeenCalledTimes(0);

    try {
      await createComplianceFolder();
      expect(mkdirPSpy).toHaveBeenCalledTimes(1);
      expect(async () => await createComplianceFolder()).toThrow('💥');
    } catch (error) {
      expect(error.message).toBe(
        `Error: failed to create compliance folder ${COMPLIANCE_FOLDER}, 💥.`,
      );
    }
  });
});

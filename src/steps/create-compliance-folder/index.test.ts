import * as io from '@actions/io';
import * as core from '@actions/core';
import createComplianceFolder from './index';
import { COMPLIANCE_FOLDER } from '../../shared/constants';

describe('createComplianceFolder', () => {
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
    jest.spyOn(io, 'mkdirP').mockRejectedValueOnce('💥');

    const mkdirPSpy = io.mkdirP as jest.Mock<any, any>;
    const errorSpy = core.error as jest.Mock<any, any>;

    // sanity check
    expect(mkdirPSpy).toHaveBeenCalledTimes(0);
    expect(errorSpy).toHaveBeenCalledTimes(0);

    try {
      await createComplianceFolder();
      expect(mkdirPSpy).toHaveBeenCalledTimes(1);
    } catch (error) {
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        `Error: failed to create compliance folder ${COMPLIANCE_FOLDER}, 💥.`,
      );
    }
  });
});

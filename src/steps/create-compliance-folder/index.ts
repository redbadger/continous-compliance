import * as io from '@actions/io';
import * as core from '@actions/core';
import { COMPLIANCE_FOLDER } from '../../shared/constants';

const createComplianceFolder = async (): Promise<void> => {
  try {
    await io.mkdirP(COMPLIANCE_FOLDER);
  } catch (error) {
    core.error(
      `Error: failed to create compliance folder ${COMPLIANCE_FOLDER}, ${error.message}.`,
    );
  }
};

export default createComplianceFolder;

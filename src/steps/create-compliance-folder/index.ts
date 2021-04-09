import * as io from '@actions/io';
import { COMPLIANCE_FOLDER } from '../../shared/constants';

const createComplianceFolder = async (): Promise<void> => {
  try {
    await io.mkdirP(COMPLIANCE_FOLDER);
  } catch (error) {
    throw new Error(
      `Error: failed to create compliance folder ${COMPLIANCE_FOLDER}, ${error.message}.`,
    );
  }
};

export default createComplianceFolder;

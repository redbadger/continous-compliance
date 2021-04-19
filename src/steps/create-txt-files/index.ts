import * as glob from '@actions/glob';
import { COMPLIANCE_FOLDER } from '../../shared/constants';

const patterns = [`${COMPLIANCE_FOLDER}/**/**.json`];

const createTxtFiles = async () => {
  const globber = await glob.create(patterns.join('\n'));
  const files = await globber.glob();
  console.log({ files });
};

export default createTxtFiles;

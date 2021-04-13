import * as github from '@actions/github';
import * as core from '@actions/core';

const getIssuesInformationIntoCompliance = async (): Promise<void> => {
  const ghToken = core.getInput('github-token');

  console.log({ ghToken });
};

export default getIssuesInformationIntoCompliance;

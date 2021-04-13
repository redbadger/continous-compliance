import * as github from '@actions/github';
import * as core from '@actions/core';

const getIssuesInformationIntoCompliance = async (): Promise<void> => {
  const ghToken = core.getInput('github-token');

  const context = github.context;

  const octokit = github.getOctokit(ghToken);

  console.log({ context });
};

export default getIssuesInformationIntoCompliance;
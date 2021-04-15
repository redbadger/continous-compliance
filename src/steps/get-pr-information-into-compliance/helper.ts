import { GitHub } from '@actions/github/lib/utils';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import * as core from '@actions/core';
import * as fs from 'fs';

import { COMPLIANCE_FOLDER } from '../../shared/constants';

type PullRequestListCommitsResponse = RestEndpointMethodTypes['pulls']['listCommits']['response'];
type PullRequestSearchResponse = RestEndpointMethodTypes['search']['issuesAndPullRequests']['response'];
type PullRequestSearchResponseItem = RestEndpointMethodTypes['search']['issuesAndPullRequests']['response']['data']['items'][number];

interface GetPullRequestByCommitSHA {
  octokit: InstanceType<typeof GitHub>;
  sha: string;
}

export const getPullRequestByCommitSHA = async ({
  octokit,
  sha,
}: GetPullRequestByCommitSHA) => {
  try {
    const q = `q=SHA=${sha}`;
    const {
      data: prs,
    }: PullRequestSearchResponse = await octokit.rest.search.issuesAndPullRequests(
      { q },
    );

    if (prs) {
      const {
        items: [pull_request],
      } = prs;
      return pull_request;
    }
  } catch (error) {
    throw error;
  }
};

interface GetCommitsByPr {
  octokit: InstanceType<typeof GitHub>;
  owner: string;
  repo: string;
  pull_number: number;
}

export const getCommitsByPr = async ({
  octokit,
  owner,
  repo,
  pull_number,
}: GetCommitsByPr) => {
  try {
    const {
      data: commits,
    }: PullRequestListCommitsResponse = await octokit.rest.pulls.listCommits({
      owner,
      repo,
      pull_number,
    });
    if (commits) {
      return commits;
    }
  } catch (error) {
    throw error;
  }
};

export interface GitHubEvidence {
  pull_request?: PullRequestSearchResponseItem;
  commits?: PullRequestListCommitsResponse['data'];
}

export const githubFolder = `${COMPLIANCE_FOLDER}/github`;
const githubInfoPath = `${githubFolder}/info.json`;

const {
  promises: { writeFile },
} = fs;

export const writeGhInfoIntoDisk = async (gitEvidence: GitHubEvidence) => {
  try {
    core.info(`Saving GitHub evidence on ${githubInfoPath}`);
    await writeFile(githubInfoPath, JSON.stringify(gitEvidence));
  } catch (error) {
    throw error;
  }
};

import { GitHub } from '@actions/github/lib/utils';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import * as core from '@actions/core';
import * as fs from 'fs';

import { COMPLIANCE_FOLDER } from '../../shared/constants';

type PullRequestListCommitsResponse = RestEndpointMethodTypes['pulls']['listCommits']['response'];
type PullRequestSearchResponse = RestEndpointMethodTypes['search']['issuesAndPullRequests']['response'];
type PullRequestSearchResponseItem = RestEndpointMethodTypes['search']['issuesAndPullRequests']['response']['data']['items'][number];
type Issues = RestEndpointMethodTypes['issues']['get']['response']['data'];

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
    throw new Error(
      `Failed to get a pull request information from commit ${sha}`,
    );
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
    throw new Error(
      `Failed to get commits information from pull request # ${pull_number}`,
    );
  }
};

export interface GitHubEvidence {
  pull_request?: PullRequestSearchResponseItem;
  commits?: PullRequestListCommitsResponse['data'];
  issues?: Issues[];
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
    throw new Error(`Failed to save GitHub evidence on ${githubInfoPath}`);
  }
};

interface GetIssues {
  octokit: InstanceType<typeof GitHub>;
  owner: string;
  repo: string;
  pull_request: PullRequestSearchResponseItem;
}

export const getIssues = async ({
  octokit,
  owner,
  repo,
  pull_request,
}: GetIssues): Promise<Issues[] | undefined> => {
  try {
    const pullRequestHaveBody = Boolean(pull_request.body);

    if (pullRequestHaveBody) {
      const issuesMatcher = /(#\d*)/gim;
      // TS complained that matchAll is not part of ES2019 and it is
      // https://node.green/#ES2019-features-String-prototype-matchAll
      // @ts-ignore
      const matches = [...pull_request.body.matchAll(issuesMatcher)];
      const issuesNumbers = matches.map((match) =>
        Number(match[0].split('#').pop()),
      );

      return await Promise.all(
        issuesNumbers.map(async (issue_number) => {
          const { data } = await octokit.issues.get({
            owner,
            repo,
            issue_number,
          });
          return data;
        }),
      );
    }
  } catch (error) {
    throw new Error(`
      Failed to get issues from pull resquest ${pull_request.number}
    `);
  }
};

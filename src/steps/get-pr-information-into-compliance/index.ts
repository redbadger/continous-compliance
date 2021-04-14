import * as github from '@actions/github';
import * as core from '@actions/core';
import * as io from '@actions/io';
import { GitHub } from '@actions/github/lib/utils';
import { COMPLIANCE_FOLDER } from '../../shared/constants';
import * as fs from 'fs';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type PullRequestSearchResponse = RestEndpointMethodTypes['search']['issuesAndPullRequests']['response'];
type PullRequestListCommitsResponse = RestEndpointMethodTypes['pulls']['listCommits']['response'];
type PullRequestSearchResponseItem = RestEndpointMethodTypes['search']['issuesAndPullRequests']['response']['data']['items'][number];

// TODO:
// Write logs info
// Abstract small functions to another file

interface GitHubEvidence {
  pull_request?: PullRequestSearchResponseItem;
  commits?: PullRequestListCommitsResponse['data'];
}

const githubFolder = `${COMPLIANCE_FOLDER}/github`;
const githubInfoPath = `${githubFolder}/info.json`;

let gitEvidence: GitHubEvidence = {
  pull_request: undefined,
  commits: undefined,
};

interface GetPullRequestByCommitSHA {
  octokit: InstanceType<typeof GitHub>;
  sha: string;
}

const {
  promises: { writeFile },
} = fs;

const getPullRequestByCommitSHA = async ({
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

const getCommitsByPr = async ({
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

const writeGhInfoIntoDisk = async () => {
  try {
    await writeFile(githubInfoPath, JSON.stringify(gitEvidence));
  } catch (error) {
    throw error;
  }
};

const getPrInformationIntoComplianceFolder = async (): Promise<void> => {
  const ghToken = core.getInput('github-token');
  const isGhToken = Boolean(ghToken);

  if (isGhToken) {
    const octokit = github.getOctokit(ghToken);
    const {
      context: {
        repo: { repo, owner },
        sha,
      },
    } = github;

    // Get PR by commit SHA
    const pull_request = await getPullRequestByCommitSHA({ octokit, sha });

    if (pull_request) {
      // Create github folder
      await io.mkdirP(githubFolder);

      gitEvidence = { ...gitEvidence, pull_request };
      const { number: pull_number } = pull_request;

      // Get commits by PR number
      const commits = await getCommitsByPr({
        octokit,
        owner,
        repo,
        pull_number,
      });

      if (commits) {
        gitEvidence = { ...gitEvidence, commits };
        await writeGhInfoIntoDisk();
      } else {
        await writeGhInfoIntoDisk();
        core.warning(`No commits associated with PR #${pull_number}`);
      }
    } else {
      core.warning(`Pull request associated with commit ${sha} not found`);
    }
  } else {
    return;
  }
};

export default getPrInformationIntoComplianceFolder;

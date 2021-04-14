import * as github from '@actions/github';
import * as core from '@actions/core';

import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type PullRequestSearchResponse = RestEndpointMethodTypes['search']['issuesAndPullRequests']['response'];
type PullRequestListCommitsResponse = RestEndpointMethodTypes['pulls']['listCommits']['response'];
type PullRequestSearchResponseItems = RestEndpointMethodTypes['search']['issuesAndPullRequests']['response']['data']['items'];

// components["schemas"]["issue-search-result-item"]

// TODO:
// Type gitEvidence object
// write file into compliance folder
// Abstract into small function

interface GitHubEvidence {
  pull_request: PullRequestSearchResponse['data']['items'];
  commits?: PullRequestListCommitsResponse['data'];
}

const getIssuesInformationIntoCompliance = async (): Promise<void> => {
  let gitEvidence;

  const ghToken = core.getInput('github-token');
  const isGhToken = Boolean(ghToken);

  if (isGhToken) {
    const {
      context: {
        repo: { repo, owner },
        sha,
      },
    } = github;

    const octokit = github.getOctokit(ghToken);

    // Get PR by commit SHA
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

      gitEvidence = {
        pull_request,
      };

      const pull_number = pull_request.number;

      const {
        data: commits,
      }: PullRequestListCommitsResponse = await octokit.rest.pulls.listCommits({
        owner,
        repo,
        pull_number,
      });

      if (commits) {
        gitEvidence = { ...gitEvidence, commits };
      } else {
        return;
      }
    } else {
      return;
    }
  } else {
    return;
  }
};

export default getIssuesInformationIntoCompliance;

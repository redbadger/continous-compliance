import * as core from '@actions/core';
import * as github from '@actions/github';
import * as io from '@actions/io';
import * as fs from 'fs';

import getPrInformationIntoComplianceFolder from './index';

const { promises } = fs;

jest.mock('@actions/github', () => ({
  getOctokit: jest.fn(() => ({
    rest: {
      search: {
        issuesAndPullRequests: jest.fn(() => 'info about PR'),
      },
      pulls: {
        listCommits: jest.fn(() => ['bananas', 'oranges']),
      },
    },
  })),
  context: {
    repo: {
      repo: 'repo',
      owner: 'owner',
    },
    sha: 'iamacommitsha',
  },
}));

describe('getPrInformationIntoComplianceFolder', () => {
  beforeEach(() => {
    // Prevent console.logs
    jest.spyOn(core, 'info').mockImplementation(jest.fn());
    jest.spyOn(core, 'warning').mockImplementation(jest.fn());
    process.env['GITHUB_REPOSITORY'] = 'owner/repo';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should gather information from GH and save it on compliance folder', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(jest.fn(() => 'IamAToken'));
    // jest.spyOn(github, 'getOctokit').mockImplementation(jest.fn());
    jest.spyOn(io, 'mkdirP').mockImplementation(jest.fn());
    jest.spyOn(promises, 'writeFile').mockImplementation(jest.fn());

    const getInputSpy = core.getInput as jest.Mock<any, any>;
    const getOctokitSpy = github.getOctokit as jest.Mock<any, any>;
    const mkdirPSpy = io.mkdirP as jest.Mock<any, any>;
    const writeFile = promises.writeFile as jest.Mock<any, any>;

    // sanity check
    expect(getInputSpy).toHaveBeenCalledTimes(0);
    expect(getOctokitSpy).toHaveBeenCalledTimes(0);
    expect(mkdirPSpy).toHaveBeenCalledTimes(0);
    expect(writeFile).toHaveBeenCalledTimes(0);

    await getPrInformationIntoComplianceFolder();

    expect(getInputSpy).toBeCalledWith('github-token');
  });
});

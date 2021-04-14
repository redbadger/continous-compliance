import * as github from '@actions/github';
import * as core from '@actions/core';

const getIssuesInformationIntoCompliance = async (): Promise<void> => {
  const ghToken = core.getInput('github-token');

  const {
    context: {
      repo: { repo, owner },
      sha,
      eventName,
    },
  } = github;

  // const {} = context;

  const octokit = github.getOctokit(ghToken);
  const q = `q=SHA=${sha}`;

  const { data } = await octokit.rest.search.issuesAndPullRequests({
    q,
  });

  const { items: pullRequests } = data;

  const pullRequestNumbers: number[] = pullRequests.map(
    // @ts-ignore
    (pullRequest) => pullRequest.number,
  );

  Promise.all(
    pullRequestNumbers.map(async (pull_number) => {
      const { data } = await octokit.pulls.get({
        owner,
        repo,
        pull_number,
      });

      console.log('ISSUE ====> ', data._links.issue);
      console.log('ISSUE HREF====> ', data._links.issue.href);

      console.log({ data });
    }),
  );
};

export default getIssuesInformationIntoCompliance;

/*
   context: Context {
    payload: {
      after: '2ddd99468824462e9d7134636890d2dfecfe721b',
      base_ref: null,
      before: 'bb3f0117bb7e082703eaf2465100df2bfbc6179d',
      commits: [Array],
      compare: 'https://github.com/redbadger/count-dracula/compare/bb3f0117bb7e...2ddd99468824',
      created: false,
      deleted: false,
      forced: false,
      head_commit: [Object],
      organization: [Object],
      pusher: [Object],
      ref: 'refs/heads/test-continous-compliance-v07',
      repository: [Object],
      sender: [Object]
    },
    eventName: 'push',
    sha: '2ddd99468824462e9d7134636890d2dfecfe721b',
    ref: 'refs/heads/test-continous-compliance-v07',
    workflow: 'Continous compliance 🔍',
    action: 'redbadgercontinous-compliance',
    actor: 'pataruco',
    job: 'continous-compliance',
    runNumber: 53,
    runId: 745090663
  }
}

*/

/*
Process env {
  ImageOS: 'ubuntu20',
  CI: 'true',
  ACCEPT_EULA: 'Y',
  ANDROID_NDK_HOME: '/usr/local/lib/android/sdk/ndk-bundle',
  PIPX_BIN_DIR: '/opt/pipx_bin',
  ANDROID_HOME: '/usr/local/lib/android/sdk',
  CONDA: '/usr/share/miniconda',
  RUNNER_TOOL_CACHE: '/opt/hostedtoolcache',
  INVOCATION_ID: 'fb0d12ee2cb2495382d8ea56f938185c',
  DEBIAN_FRONTEND: 'noninteractive',
  GRAALVM_11_ROOT: '/usr/local/graalvm/graalvm-ce-java11-21.0.0.2',
  ANDROID_NDK_LATEST_HOME: '/usr/local/lib/android/sdk/ndk/22.1.7171670',
  USER: 'runner',
  CHROME_BIN: '/usr/bin/google-chrome',
  HOME: '/home/runner',
  GITHUB_ACTIONS: 'true',
  GOROOT_1_14_X64: '/opt/hostedtoolcache/go/1.14.15/x64',
  PATH: '/opt/hostedtoolcache/node/14.16.1/x64/bin:/home/linuxbrew/.linuxbrew/bin:/home/linuxbrew/.linuxbrew/sbin:/home/runner/.local/bin:/opt/pipx_bin:/usr/share/rust/.cargo/bin:/home/runner/.config/composer/vendor/bin:/usr/local/.ghcup/bin:/home/runner/.dotnet/tools:/snap/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin',
  GRADLE_HOME: '/usr/share/gradle',
  CHROMEWEBDRIVER: '/usr/local/share/chrome_driver',
  JAVA_HOME_8_X64: '/usr/lib/jvm/adoptopenjdk-8-hotspot-amd64',
  NVM_DIR: '/home/runner/.nvm',
  DEPLOYMENT_BASEPATH: '/opt/runner',
  HOMEBREW_CLEANUP_PERIODIC_FULL_DAYS: '3650',
  RUNNER_TRACKING_ID: 'github_412e99a7-9181-4d59-b949-4c4343ac693d',
  DOTNET_NOLOGO: '1',
  ANDROID_NDK_ROOT: '/usr/local/lib/android/sdk/ndk-bundle',
  JOURNAL_STREAM: '9:21043',
  BOOTSTRAP_HASKELL_NONINTERACTIVE: '1',
  RUNNER_PERFLOG: '/home/runner/perflog',
  PERFLOG_LOCATION_SETTING: 'RUNNER_PERFLOG',
  ANT_HOME: '/usr/share/ant',
  LANG: 'C.UTF-8',
  PIPX_HOME: '/opt/pipx',
  VCPKG_INSTALLATION_ROOT: '/usr/local/share/vcpkg',
  SELENIUM_JAR_PATH: '/usr/share/java/selenium-server-standalone.jar',
  GECKOWEBDRIVER: '/usr/local/share/gecko_driver',
  LEIN_JAR: '/usr/local/lib/lein/self-installs/leiningen-2.9.5-standalone.jar',
  JAVA_HOME: '/usr/lib/jvm/adoptopenjdk-11-hotspot-amd64',
  HOMEBREW_PREFIX: '"/home/linuxbrew/.linuxbrew"',
  AZURE_EXTENSION_DIR: '/opt/az/azcliextensions',
  HOMEBREW_CELLAR: '"/home/linuxbrew/.linuxbrew/Cellar"',
  RUNNER_USER: 'runner',
  AGENT_TOOLSDIRECTORY: '/opt/hostedtoolcache',
  LEIN_HOME: '/usr/local/lib/lein',
  DOTNET_SKIP_FIRST_TIME_EXPERIENCE: '1',
  HOMEBREW_NO_AUTO_UPDATE: '1',
  GOROOT_1_15_X64: '/opt/hostedtoolcache/go/1.15.11/x64',
  ImageVersion: '20210405.1',
  DOTNET_MULTILEVEL_LOOKUP: '0',
  ANDROID_SDK_ROOT: '/usr/local/lib/android/sdk',
  XDG_CONFIG_HOME: '/home/runner/.config',
  SWIFT_PATH: '/usr/share/swift/usr/bin',
  HOMEBREW_REPOSITORY: '"/home/linuxbrew/.linuxbrew/Homebrew"',
  JAVA_HOME_11_X64: '/usr/lib/jvm/adoptopenjdk-11-hotspot-amd64',
  GOROOT_1_16_X64: '/opt/hostedtoolcache/go/1.16.3/x64',
  POWERSHELL_DISTRIBUTION_CHANNEL: 'GitHub-Actions-ubuntu20',
  'INPUT_TESTS-FOLDER': 'web/test-results',
  'INPUT_GCP-BUCKET-NAME': 'count-dracula-continous-compliance-prod',
  'INPUT_GCP-APPLICATION-CREDENTIALS': '***\n',
  'INPUT_DOCS-FOLDER': 'web/docs',
  GITHUB_JOB: 'continous-compliance',
  GITHUB_REF: 'refs/heads/test-continous-compliance-v07',
  GITHUB_SHA: '3fa72a28077c9f7b0b93337beae36d5f909b0958',
  GITHUB_REPOSITORY: 'redbadger/count-dracula',
  GITHUB_REPOSITORY_OWNER: 'redbadger',
  GITHUB_RUN_ID: '745020122',
  GITHUB_RUN_NUMBER: '51',
  GITHUB_RETENTION_DAYS: '90',
  GITHUB_ACTOR: 'pataruco',
  GITHUB_WORKFLOW: 'Continous compliance 🔍',
  GITHUB_HEAD_REF: '',
  GITHUB_BASE_REF: '',
  GITHUB_EVENT_NAME: 'push',
  GITHUB_SERVER_URL: 'https://github.com',
  GITHUB_API_URL: 'https://api.github.com',
  GITHUB_GRAPHQL_URL: 'https://api.github.com/graphql',
  GITHUB_WORKSPACE: '/home/runner/work/count-dracula/count-dracula',
  GITHUB_ACTION: 'redbadgercontinous-compliance',
  GITHUB_EVENT_PATH: '/home/runner/work/_temp/_github_workflow/event.json',
  GITHUB_ACTION_REPOSITORY: 'redbadger/continous-compliance',
  GITHUB_ACTION_REF: 'v0.7',
  GITHUB_PATH: '/home/runner/work/_temp/_runner_file_commands/add_path_ba873751-bd86-4186-b122-57e1a953ffbc',
  GITHUB_ENV: '/home/runner/work/_temp/_runner_file_commands/set_env_ba873751-bd86-4186-b122-57e1a953ffbc',
  RUNNER_OS: 'Linux',
  RUNNER_TEMP: '/home/runner/work/_temp',
  RUNNER_WORKSPACE: '/home/runner/work/count-dracula',
  ACTIONS_RUNTIME_URL: 'https://pipelines.actions.githubusercontent.com/WNL1JHryL2aicM5WkOBFBJnccB8bH1dOgQsr5Tn23lUiyCvXjr/',
  ACTIONS_RUNTIME_TOKEN: '***',
  ACTIONS_CACHE_URL: 'https://artifactcache.actions.githubusercontent.com/WNL1JHryL2aicM5WkOBFBJnccB8bH1dOgQsr5Tn23lUiyCvXjr/'
}
*/

/*

{
  payload: {
    after: '8ab2e6ce5a541f2f06b9ffb77b6a8f3d72eac2a6',
    base_ref: null,
    before: '70343d6e9533a92f22d2a09938556c349240d008',
    commits: [ [Object] ],
    compare: 'https://github.com/redbadger/count-dracula/compare/70343d6e9533...8ab2e6ce5a54',
    created: false,
    deleted: false,
    forced: false,
    head_commit: {
      author: [Object],
      committer: [Object],
      distinct: true,
      id: '8ab2e6ce5a541f2f06b9ffb77b6a8f3d72eac2a6',
      message: 'Trigger continous-compliance CI/CD',
      timestamp: '2021-04-14T09:01:49+01:00',
      tree_id: '6951569f7b2e3affc8af01ea0d85fade10ea4173',
      url: 'https://github.com/redbadger/count-dracula/commit/8ab2e6ce5a541f2f06b9ffb77b6a8f3d72eac2a6'
    },
    organization: {
      avatar_url: 'https://avatars.githubusercontent.com/u/265650?v=4',
      description: null,
      events_url: 'https://api.github.com/orgs/redbadger/events',
      hooks_url: 'https://api.github.com/orgs/redbadger/hooks',
      id: 265650,
      issues_url: 'https://api.github.com/orgs/redbadger/issues',
      login: 'redbadger',
      members_url: 'https://api.github.com/orgs/redbadger/members{/member}',
      node_id: 'MDEyOk9yZ2FuaXphdGlvbjI2NTY1MA==',
      public_members_url: 'https://api.github.com/orgs/redbadger/public_members{/member}',
      repos_url: 'https://api.github.com/orgs/redbadger/repos',
      url: 'https://api.github.com/orgs/redbadger'
    },
    pusher: { email: 'pataruco@users.noreply.github.com', name: 'pataruco' },
    ref: 'refs/heads/test-continous-compliance-v07',
    repository: {
      archive_url: 'https://api.github.com/repos/redbadger/count-dracula/{archive_format}{/ref}',
      archived: false,
      assignees_url: 'https://api.github.com/repos/redbadger/count-dracula/assignees{/user}',
      blobs_url: 'https://api.github.com/repos/redbadger/count-dracula/git/blobs{/sha}',
      branches_url: 'https://api.github.com/repos/redbadger/count-dracula/branches{/branch}',
      clone_url: 'https://github.com/redbadger/count-dracula.git',
      collaborators_url: 'https://api.github.com/repos/redbadger/count-dracula/collaborators{/collaborator}',
      comments_url: 'https://api.github.com/repos/redbadger/count-dracula/comments{/number}',
      commits_url: 'https://api.github.com/repos/redbadger/count-dracula/commits{/sha}',
      compare_url: 'https://api.github.com/repos/redbadger/count-dracula/compare/{base}...{head}',
      contents_url: 'https://api.github.com/repos/redbadger/count-dracula/contents/{+path}',
      contributors_url: 'https://api.github.com/repos/redbadger/count-dracula/contributors',
      created_at: 1617023946,
      default_branch: 'main',
      deployments_url: 'https://api.github.com/repos/redbadger/count-dracula/deployments',
      description: null,
      disabled: false,
      downloads_url: 'https://api.github.com/repos/redbadger/count-dracula/downloads',
      events_url: 'https://api.github.com/repos/redbadger/count-dracula/events',
      fork: false,
      forks: 0,
      forks_count: 0,
      forks_url: 'https://api.github.com/repos/redbadger/count-dracula/forks',
      full_name: 'redbadger/count-dracula',
      git_commits_url: 'https://api.github.com/repos/redbadger/count-dracula/git/commits{/sha}',
      git_refs_url: 'https://api.github.com/repos/redbadger/count-dracula/git/refs{/sha}',
      git_tags_url: 'https://api.github.com/repos/redbadger/count-dracula/git/tags{/sha}',
      git_url: 'git://github.com/redbadger/count-dracula.git',
      has_downloads: true,
      has_issues: true,
      has_pages: false,
      has_projects: true,
      has_wiki: true,
      homepage: null,
      hooks_url: 'https://api.github.com/repos/redbadger/count-dracula/hooks',
      html_url: 'https://github.com/redbadger/count-dracula',
      id: 352650506,
      issue_comment_url: 'https://api.github.com/repos/redbadger/count-dracula/issues/comments{/number}',
      issue_events_url: 'https://api.github.com/repos/redbadger/count-dracula/issues/events{/number}',
      issues_url: 'https://api.github.com/repos/redbadger/count-dracula/issues{/number}',
      keys_url: 'https://api.github.com/repos/redbadger/count-dracula/keys{/key_id}',
      labels_url: 'https://api.github.com/repos/redbadger/count-dracula/labels{/name}',
      language: 'TypeScript',
      languages_url: 'https://api.github.com/repos/redbadger/count-dracula/languages',
      license: [Object],
      master_branch: 'main',
      merges_url: 'https://api.github.com/repos/redbadger/count-dracula/merges',
      milestones_url: 'https://api.github.com/repos/redbadger/count-dracula/milestones{/number}',
      mirror_url: null,
      name: 'count-dracula',
      node_id: 'MDEwOlJlcG9zaXRvcnkzNTI2NTA1MDY=',
      notifications_url: 'https://api.github.com/repos/redbadger/count-dracula/notifications{?since,all,participating}',
      open_issues: 2,
      open_issues_count: 2,
      organization: 'redbadger',
      owner: [Object],
      private: false,
      pulls_url: 'https://api.github.com/repos/redbadger/count-dracula/pulls{/number}',
      pushed_at: 1618387315,
      releases_url: 'https://api.github.com/repos/redbadger/count-dracula/releases{/id}',
      size: 728,
      ssh_url: 'git@github.com:redbadger/count-dracula.git',
      stargazers: 1,
      stargazers_count: 1,
      stargazers_url: 'https://api.github.com/repos/redbadger/count-dracula/stargazers',
      statuses_url: 'https://api.github.com/repos/redbadger/count-dracula/statuses/{sha}',
      subscribers_url: 'https://api.github.com/repos/redbadger/count-dracula/subscribers',
      subscription_url: 'https://api.github.com/repos/redbadger/count-dracula/subscription',
      svn_url: 'https://github.com/redbadger/count-dracula',
      tags_url: 'https://api.github.com/repos/redbadger/count-dracula/tags',
      teams_url: 'https://api.github.com/repos/redbadger/count-dracula/teams',
      trees_url: 'https://api.github.com/repos/redbadger/count-dracula/git/trees{/sha}',
      updated_at: '2021-04-13T13:18:35Z',
      url: 'https://github.com/redbadger/count-dracula',
      watchers: 1,
      watchers_count: 1
    },
    sender: {
      avatar_url: 'https://avatars.githubusercontent.com/u/10330222?v=4',
      events_url: 'https://api.github.com/users/pataruco/events{/privacy}',
      followers_url: 'https://api.github.com/users/pataruco/followers',
      following_url: 'https://api.github.com/users/pataruco/following{/other_user}',
      gists_url: 'https://api.github.com/users/pataruco/gists{/gist_id}',
      gravatar_id: '',
      html_url: 'https://github.com/pataruco',
      id: 10330222,
      login: 'pataruco',
      node_id: 'MDQ6VXNlcjEwMzMwMjIy',
      organizations_url: 'https://api.github.com/users/pataruco/orgs',
      received_events_url: 'https://api.github.com/users/pataruco/received_events',
      repos_url: 'https://api.github.com/users/pataruco/repos',
      site_admin: false,
      starred_url: 'https://api.github.com/users/pataruco/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/pataruco/subscriptions',
      type: 'User',
      url: 'https://api.github.com/users/pataruco'
    }
  },
  eventName: 'push',
  sha: '8ab2e6ce5a541f2f06b9ffb77b6a8f3d72eac2a6',
  ref: 'refs/heads/test-continous-compliance-v07',
  workflow: 'Continous compliance 🔍',
  action: 'redbadgercontinous-compliance',
  actor: 'pataruco',
  job: 'continous-compliance',
  runNumber: 56,
  runId: 747534234
}
{
  github: {
    context: Context {
      payload: [Object],
      eventName: 'push',
      sha: '8ab2e6ce5a541f2f06b9ffb77b6a8f3d72eac2a6',
      ref: 'refs/heads/test-continous-compliance-v07',
      workflow: 'Continous compliance 🔍',
      action: 'redbadgercontinous-compliance',
      actor: 'pataruco',
      job: 'continous-compliance',
      runNumber: 56,
      runId: 747534234
    },
    getOctokit: [Function: getOctokit]
  }
}
repo ==>  { owner: 'redbadger', repo: 'count-dracula' }
issue ==>  { owner: 'redbadger', repo: 'count-dracula', number: undefined }

*/

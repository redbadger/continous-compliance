# Continous Compliance GitHub Action

This GitHub Action will automatically gather compliance information about:

- Documentation
- Test results
- GitHub pull request information, issues and commits associated

And store it in a Google Cloud Storage bucket as evidence for regulators.

> "Compliance broadly boils down to: Have justifiable policies in place, and prove you follow them. [Gary Shutter, Compliance and continuous deployment, 2020](https://gshutler.com/2020/12/compliance-and-continuous-deployment/)"

## Getting started

You can include the action in your workflow to trigger on any event that GitHub actions supports. Your workflow will need to include the actions/checkout step before this workflow runs in order for gather the evidence

You can view an example of this below.

```yml
name: Continous compliance ๐
on:
  push:
    branches:
      - master
jobs:
  continous-compliance:
    runs-on: ubuntu-latest
    name: Continous compliance ๐
    steps:
      - name: Checkout ๐๏ธ
        uses: actions/checkout@v2
        with:
          persist-credentials: false

      - name: Set Node version ๐ฆ
        uses: actions/setup-node@v2
        with:
          node-version: '14'
          check-latest: true

      - name: Install ๐
        run: |
          yarn

      - name: Gather test results ๐ ๐งช
        run: |
          yarn workspace web test:ci-report
          yarn workspace web test:accessibility
          yarn workspace web test:e2e

      - name: Continous compliance
        uses: redbadger/continous-compliance@v0.9
        with:
          tests-folder: web/test-results
          gcp-bucket-name: count-dracula-continous-compliance-prod
          gcp-application-credentials: ${{ secrets.GOOGLE_APPLICATION_CREDENTIALS }}
          docs-folder: web/docs
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Configuration

The `with` portion of the workflow must be configured before the action will work. You can add these in the with section found in the examples above. Any `secrets` must be referenced using the bracket syntax and stored in the GitHub repository's `Settings/Secrets` menu. You can learn more about setting environment variables with GitHub actions [here](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets).

### Required Setup

The following options must be configured in order to save evidence on Google Cloud Storage.

| Key                           | Value Information                                                                                                                                                                                                                                                                                | Type    | Required |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | -------- |
| `gcp-bucket-name`             | Google Cloud storage bucket name where compliance information will be stored                                                                                                                                                                                                                     | `width` | **Yes**  |
| `gcp-application-credentials` | To authorize in GCP you need to have a [service account key](https://console.cloud.google.com/apis/credentials/serviceaccountkey). The recommended way to store the credentials in the secrets it previously encode file with `base64`. To encode a JSON file use: `base64 ~/<account_id>.json`. | `width` | **Yes**  |

### Optional Setup

The following options are optional

| Key            | Value Information                                                                                                             | Type    | Required |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------- | -------- |
| `github-token` | To have the ability to gather evidence from GitHub API, you can enable it setting the GitHub token provided repository scoped | `width` | **No**   |
| `tests-folder` | Folder where test results are stored                                                                                          | `width` | **No**   |
| `docs-folder`  | Folder where documentation is stored                                                                                          | `width` | **No**   |

## What it does

The steps that this action does are described [here](./src/steps/readme.md)

## Development

The functionality is written in TypeScript in the [`src/`](./src) folder. To be able to compile TypeScript into JavaScript run:

```sh
yarn build
```

The compilation target is the [`lib/`](./lib) folder which is ignored in version control.

To be able to run a GitHub Action in a GitHub Workflow, we need to compile all dependencies into one file, to do that run:

```sh
yarn package
```

> Check on [Creating a JavaScript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github) official docs for more info about this

If you want to run previous scripts in one go, run:

```sh
yarn build-package
```

### Release

GitHub actions are available to use in repos via tag release. To create a new release:

```sh
yarn create-tag v0.1
```

To delete a tag release

```sh
yarn delete-tag v0.1
```

### Test

All steps are unit tested and CI/CD runs them in tag release git event, to run it locally

```sh
yarn test
```

### Dev tools

- Linter (ESLint) and code formatter (Prettier) are enforced on pre-commit git events
- Dependencies and Github actions updates are automated via [dependabot](https://github.com/dependabot), it would come as pull request that a developer can review and merge

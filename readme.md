# Continous Compliance

## What is it

GitHub Action that gather compliance evidence and store it in the cloud

## Inputs

- `tests-folder`: path to tests folder

## Outputs

- `compliance-evidence-url`: URL where we store it compliance evidence

## Example usage

```yml
uses: redbadger/continous-compliance@v0.1
width:
  tests-folder: 'path-to-tests-folder'
```

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

# Continous Compliance

## Steps

This GitHub action is following these steps in sequential order:

1. Create a compliance folder `/compliance` on the root of the repo
2. If `tests-folders` input is given it would copy the contents of the folder and paste it into compliance folder
3. If `docs-folders` input is given it would copy the contents of the folder and paste it into compliance folder
4. If `github-token` input is given it would gather information about the current pull request, issues and commits associated with it and paste it into compliance folder
5. Scan compliance folder for any `filename.json` file and create a human readeable version as `filename.txt`
6. It would compress (zip) compliance folder and the zip file with an Unix timestamp, e.g. `1617971697.zip`
7. It would upload the zip file to a Google Cloud storage bucket

# Continous Compliance

## Steps

This GitHub action is following these steps in secuencial order:

1. Create a compliance folder on the root of the repo
2. If `tests-folders` input is given it would copy the contents of the folder and paste it into compliance folder
3. It would compress (zip) compliance folder and the zip file with an Unix timestamp, e.g. `1617971697.zip`
4. It would upload the zip file to a Google Cloud storage bucket

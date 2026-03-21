## Process Overview

This instruction provides a step-by-step guide to deploying the Focus Requirements Model Analyzer (FRMA) in a production environment using GitHub Pages.

The _SOURCE CODE_ is found under the https://github.com/elastic-hub/requirements-model repository.

The build and deployment is happening in https://github.com/FinOps-Open-Cost-and-Usage-Spec/focus_requirements_model_analyzer repository.

The deployment is done using GitHub Actions, and the deployment process is triggered by pushing a new change to ```main``` branch in the [_SOURCE CODE_](https://github.com/elastic-hub/requirements-model) repository or simply by re-running the build process.

## Prerequisites

Before deploying the FRMA, ensure you have the following prerequisites in place:
1. Write access to the repository containing the FRMA code (https://github.com/FinOps-Open-Cost-and-Usage-Spec/focus_requirements_model_analyzer)
2. Fresh unused [GitHub token](https://github.com/settings/tokens/new)

    ## Deployment Steps - CONTENT UPDATE

> _NOTE:_ The content origin(s) can be found at [```content.config.ts```](https://github.com/elastic-hub/requirements-model/blob/main/content.config.ts) file

1. Create a new [GitHub token](https://github.com/settings/tokens/new) (name and expiration are not important, as the token becomes invalid after deployment) with following selected scopes:
    - repo
    - workflow
    - user
        - read:user

2. Insert the new GitHub token as a secret in the repository at the following path: [TOKEN HERE](https://github.com/elastic-hub/requirements-model/settings/secrets/actions/FILIPS_TOKEN)
3. Update secret
4. Re-run the deployment:
    - click [HERE](https://github.com/elastic-hub/requirements-model/deployments)
    - under All deployments click on _last **deployed** x days ago_
    - in top right corner click on **Re-run jobs** and select **Re-run all jobs**
    - click on **Re-run jobs** in popup to confirm
5. The build process will report an error due to token exposure detection. This is expected and must be explicitly approved. Click on the link provided under the _Deploy to Static Repository_ in build process

![Secret Exposure](public/img/tokenexposure.jpg)

6. After that, re-run the deployment as described in step 4 and wait for the process to finish. 

## Deployment Steps - CODE UPDATE

1. Create a new [GitHub token](https://github.com/settings/tokens/new) (name and expiration are not important, as the token becomes invalid after deployment) with following selected scopes:
    - repo
    - workflow
    - user
        - read:user

2. Insert the new GitHub token as a secret in the repository at the following path: [TOKEN](https://github.com/elastic-hub/requirements-model/settings/secrets/actions/FILIPS_TOKEN)
3. Update secret
4. Create a feature branch from the ```main``` branch of [_SOURCE CODE_](https://github.com/elastic-hub/requirements-model) and create a pull request against the ```main``` branch
5. Merge the pull request to the ```main``` branch
6. After the merge, the GitHub Actions workflow will be triggered automatically, and the deployment process will begin
7. Click on deployments and enter the one that is currently being built
8. The build process will report an error due to token exposure detection. This is expected and must be explicitly approved. Click on the link provided under the _Deploy to Static Repository_ in build process

![Secret Exposure](public/img/tokenexposure.jpg)

9. After that, re-run the deployment and wait for the process to finish (same as step 4 under CONTENT UPDATE)

## Notes

The token is intentionally short-lived and becomes unusable after deployment.

The reported build error is part of the expected flow and does not indicate a failure of the deployment process.
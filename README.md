
# `repository_dispatch` creator

Create repository_dispatch event from Slack using AWS Lambda + API Gateway

# Usage

- Create Slack custom integration, `Slash Command`.

- Copy `.env.local.example` into `.env.local` and fill it.

- Install dependencies.
    ```shell
    $ yarn global add aws-cdk
    $ cd deployments
    [deployments] $ yarn install --frozen-lockfile
    $ cd ../lambda/repository-dispatch-creator/
    [lambda/repository-dispatch-creator] $ yarn install --frozen-lockfile
    ```

- Deploy.
    ```shell
    $ cd deployments
    [deployments] $ CDK_DEPLOY_REGION=us-east-1 CDK_DEPLOY_ACCOUNT=123434565678 env $(cat ../.env.local) cdk deploy
    ```

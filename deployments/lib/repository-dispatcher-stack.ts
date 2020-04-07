import * as cdk from '@aws-cdk/core';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway'

interface DispatcherEnv {
  [key: string]: string
}

function assertIsDispatcherEnv(dispatcherEnv: any): asserts dispatcherEnv is DispatcherEnv {
  Object.entries(dispatcherEnv).forEach((key, value) => {
    if (typeof value !== 'string') {
      throw new Error(`key: ${key} is not string`)
    }
  })
}

export class RepositoryDispatcherStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dispatcherEnv = {
      'SLACK_DISPATCHER': process.env['API_GATEWAY_SLACK_TOKEN'],
      'GITHUB_USER': process.env['LAMBDA_GITHUB_USER'],
      'GITHUB_TOKEN': process.env['LAMBDA_GITHUB_TOKEN'],
      'GITHUB_REPOSITORY': process.env['LAMBDA_GITHUB_REPO'],
    }
    assertIsDispatcherEnv(dispatcherEnv)

    const fireRepositoryDispatchFunction = new NodejsFunction(this, 'FireRepositoryDispatch', {

      functionName: 'fire_repository_dispatch',
      entry: '../lambda/fire-repository-dispatch/index.ts',
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      environment: dispatcherEnv,
    })

    const restApi = new RestApi(this, 'RepositoryDispatcherApi', {
      restApiName: 'repository_dispatcher_api',
    })

    const integration = new LambdaIntegration(fireRepositoryDispatchFunction)
    const postResource = restApi.root.addResource('post')
    postResource.addMethod('POST', integration)
  }
}

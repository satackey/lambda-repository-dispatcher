#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { RepositoryDispatcherStack } from '../lib/repository-dispatcher-stack'

const app = new cdk.App()
new RepositoryDispatcherStack(app, 'RepositoryDispatcherStack',{
  env: {
    account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
  }
})

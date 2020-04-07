import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import RepositoryDispatcher = require('../lib/repository-dispatcher-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new RepositoryDispatcher.RepositoryDispatcherStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});

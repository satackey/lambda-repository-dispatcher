import {APIGatewayEventRequestContext, APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import axios from 'axios'

const dispatchRepo = process.env['GITHUB_REPO'] || ''
const githubUser = process.env['GITHUB_USER'] || ''
const githubToken = process.env['GITHUB_TOKEN'] || ''
const slackAuthToken = process.env['SLACK_TOKEN'] || ''

if (dispatchRepo === '' || githubUser === '' || githubToken === '' || slackAuthToken === '') {
  throw new Error('initialization error')
}

const dispatchUrl = `https://api.github.com/repos/${dispatchRepo}/dispatches`
const githubBasicAuth = Buffer.from(`${githubUser}:${githubToken}`).toString('base64')

export const handler = async (
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext,
): Promise<APIGatewayProxyResult> => {
  try {
    return await handlerWithError(event, context)
  } catch(e) {
    console.error(e)
    if (typeof e.message === 'string') {
    }
    const returnErrorMessage = typeof e.message === 'string' && e.message.startsWith('ClientError:') ? e.message : 'InternalServerError'
    return {
      statusCode: returnErrorMessage === 'InternalServerError' ? 500 : 400,
      body: returnErrorMessage,
    }
  }
}

const handlerWithError = async (
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext,
): Promise<APIGatewayProxyResult> => {
  const params = event.queryStringParameters
  if (params == null) {
    throw new Error('paramater cannot be null.')
  }

  if (params.token !== slackAuthToken) {
    throw new Error('ClientError: Cannot authorize you.')
  }

  await axios({
    url: dispatchUrl,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${githubBasicAuth}`,
    },
    data: JSON.stringify({
      'event_type': `Dispatch from Slack user(${params['user_name']})`,
      'client_payload': {
        'base_branch': `${params['text']}`,
      },
    }),
  })

  return {
    statusCode: 200,
    body: ''
  }
}

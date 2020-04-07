import {APIGatewayEventRequestContext, APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import axios from 'axios'

const dispatchUrl = `https://api.github.com/repos/${process.env['LAMBDA_GITHUB_REPO'] || ''}/dispatches`
const githubUser = process.env['LAMBDA_GITHUB_USER'] || ''
const githubToken = process.env['LAMBDA_GITHUB_TOKEN'] || ''
const githubBearer = btoa(`${githubUser}:${githubToken}`)

export const hander = async (
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext,
): Promise<APIGatewayProxyResult> => {
  try {
    return handlerWithError(event, context)
  } catch(e) {
    console.error(e)
    return {
      statusCode: 400,
      body: 'Error!'
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

  axios.post(dispatchUrl, {
    'event_type': `Dispatch from Slack user(${params['user_name']})`,
    'client_payload': {
      'base_branch': `${params['text']}`,
    },
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer: ${githubBearer}`,
    }
  })

  return {
    statusCode: 200,
    body: ''
  }
}

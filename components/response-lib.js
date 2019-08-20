export function success(body) {
  return buildResponse(200, body);
}

export function failure(body) {
  return buildResponse(409, body);
}

export function custom({ statusCode, response }) {
  return buildResponse(statusCode, response);
}

function buildResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
}

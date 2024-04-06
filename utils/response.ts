import { APIGatewayProxyResult } from 'aws-lambda';

const formatBody = (params: Record<string, unknown>): string =>
  JSON.stringify(params);

export const success = (
  params = {},
  statusCode = 200,
): APIGatewayProxyResult => ({
  statusCode,
  body: formatBody(params),
});

export const badRequest = (message = 'Bad request'): APIGatewayProxyResult => ({
  statusCode: 400,
  body: formatBody({ message }),
});

export const unauthorized = (
  message = 'Unauthorized',
): APIGatewayProxyResult => ({
  statusCode: 401,
  body: formatBody({ message }),
});

export const notFound = (message = 'Not found'): APIGatewayProxyResult => ({
  statusCode: 404,
  body: formatBody({ message }),
});

export const error = (error = 'Error'): APIGatewayProxyResult => ({
  statusCode: 500,
  body: formatBody({ error }),
});

export const Response = {
  success,
  badRequest,
  unauthorized,
  notFound,
  error,
};

import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export type APIEvent = APIGatewayEvent;
export type APIResponse = Promise<APIGatewayProxyResult>;
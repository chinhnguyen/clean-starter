import { APIGatewayEvent, Context } from 'aws-lambda';
import * as awsExpress from 'aws-serverless-express';
import { server } from "./lib/infrastructure/webserver/Server";

const expressServer = awsExpress.createServer(server)
// tslint:disable-next-line: export-name
export function handler(event: APIGatewayEvent, context?: Context): void {
  awsExpress.proxy(expressServer, event, context)
}
import * as AWS from 'aws-sdk';
import { config } from '../config';

AWS.config.update({ region: config.region });
export const call = (action, params) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  return dynamoDb[action](params).promise();
};

export const call1 = (action, params) => {
  console.log('AWS', AWS);
  const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: config.region, accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey });
  console.log('dynamoDb', dynamoDb);
  return dynamoDb[action](params).promise();
};

import * as _ from 'lodash';
import * as dynamoDbLib from './dynamodb-lib';
import { config } from './../config';

export const getItemByGSI = (TableName, IndexName, attribute, value, filter, filterValue, lastKey, limit) => {
  let params = {
    TableName: `${TableName}-${config.tableStage}`,
    KeyConditionExpression: '#attrKey = :attrValue',
    ExpressionAttributeValues: { ':attrValue': value },
    ExpressionAttributeNames: { '#attrKey': attribute },
  };
  TableName === 'Transactions' && process.env.STAGE === 'prod' ? params.TableName = TableName : '';
  IndexName ? params.IndexName = IndexName : '';
  lastKey ? params.ExclusiveStartKey = lastKey : '';
  limit ? params.Limit = limit : '';
  filter && filterValue ? (params.FilterExpression = `#${filter} = :${filter}`) &&
    (params.ExpressionAttributeNames[`#${filter}`] = filter) &&
    (params.ExpressionAttributeValues[`:${filter}`] = filterValue) : '';
  console.log('params', params);
  return dynamoDbLib['call']('query', params);
};

export const updateTransaction = async (TableName, Key, updateData) => {
  try {
    const params = {
      TableName: `${TableName}-${config.tableStage}`,
      Key,
      UpdateExpression: 'SET #updated_at = :updated_at',
      ExpressionAttributeValues: {
        ':updated_at': Date.now()
      },
      ExpressionAttributeNames: {
        '#updated_at': 'updated_at'
      },
    };
    _.forEach(updateData, (item, key) => {
      if (!['transaction_id', 'created_at'].includes(key)) {
        params.UpdateExpression += `, #${key} = :${key}`;
        params.ExpressionAttributeValues[`:${key}`] = item;
        params.ExpressionAttributeNames[`#${key}`] = key;
      }
    });
    if (updateData.step === 'complete') {
      params.UpdateExpression += ', #paidAt = :paidAt, #balance = :balance';
      params.ExpressionAttributeNames['#paidAt'] = 'paidAt';
      params.ExpressionAttributeValues[':paidAt'] = Date.now();
    }
    console.log('update params', params);
    return dynamoDbLib.call('update', params);
  } catch (error) {
    console.log('ERROR in updateTransaction', error);
    return error;
  }
};

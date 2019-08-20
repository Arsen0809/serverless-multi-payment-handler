'use strict';
import * as _ from 'lodash';
import * as dynamoDbLib from '../components/dynamodb-lib';

export default class PaymentTransactions {
  constructor(inputData) {
    this.tableName = `NodeTransactions-${process.env.STAGE}`;
    this.tid = inputData.tid || null;
    this.distId = inputData.distId || null;
    this.createdAt = inputData.createdAt || null;
    this.updatedAt = inputData.updatedAt || null;
    this.userId = inputData.userId || null;
    this.type = inputData.type || null;
    this.requestType = inputData.requestType || null;
    this.snsId = inputData.snsId || null;
    this.snsTimestamp = inputData.snsTimestamp || null;
    this.amount = inputData.amount || null;
    this.currency = inputData.currency || null;
    this.status = inputData.status || null;
    this.orderId = inputData.orderId || null;
    this.paymentOrderId = inputData.paymentOrderId || null;
    this.email = inputData.email || null;
    this.transaction_details = inputData.transaction_details || null;
    this.gift_card = inputData.giftcard || null;
    this.step = inputData.step || null;
    this.errorMessage = inputData.errorMessage || null;
    this.paymentTid = inputData.paymentTid || null;
    this.snapDetails = inputData.snapDetails || null;
    this.paidAt = inputData.paidAt || null;
    this.nodeItemCode = inputData.nodeItemCode || null;
    this.totalNodeAmount = inputData.totalNodeAmount || null;
    this.details = inputData.details || null;
  }

  fetchData() {
    const finalObject = {
      tid: this.tid,
      distId: this.distId,
      created_at: this.created_at,
      updatedAt: this.updatedAt,
      type: this.type,
      requestType: this.requestType,
      snsId: this.snsId,
      snsTimestamp: this.snsTimestamp,
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      orderId: this.orderId,
      paymentOrderId: this.paymentOrderId,
      userId: this.userId,
      transaction_details: this.transaction_details,
      email: this.email,
      gift_card: this.giftcard,
      step: this.step,
      errorMessage: this.errorMessage,
      paymentTid: this.paymentTid,
      snapDetails: this.snapDetails,
      paidAt: this.paidAt,
      nodeItemCode: this.nodeItemCode,
      totalNodeAmount: this.totalNodeAmount,
      details: this.details
    };
    return _.omitBy(finalObject, _.isNil);
  }

  create() {
    let submitData = this.fetchData();
    submitData.createdAt = new Date().getTime();
    const params = {
      TableName: this.tableName,
      Item: submitData
    };
    return dynamoDbLib.call('put', params);
  }

  get() {
    let { tid } = this.fetchData();
    let params = {
      TableName: this.tableName,
      Key: { tid }
    };
    return dynamoDbLib.call('get', params);
  }

  update() {
    let modelData = this.fetchData();
    const params = {
      TableName: this.tableName,
      Key: {
        tid: modelData.tid
      },
      UpdateExpression: 'SET #updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':updatedAt': new Date().getTime()
      },
      ExpressionAttributeNames: {
        '#updatedAt': 'updatedAt'
      },
    };
    console.log('update params', params);

    _.forEach(modelData, (item, key) => {
      if (!['tid', 'type'].includes(key)) {
        params.UpdateExpression += `, #${key} = :${key}`;
        params.ExpressionAttributeValues[`:${key}`] = item;
        params.ExpressionAttributeNames[`#${key}`] = key;
      }
    });
    return dynamoDbLib.call('update', params);
  }
}

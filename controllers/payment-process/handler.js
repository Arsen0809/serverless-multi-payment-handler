'use strict';
import * as vandium from 'vandium';
import * as _ from 'lodash';
import uuid from 'uuid/v1';
import { config } from '../../config';
import { publish, createPushMessage } from '../../components/aws/sns';
import { deleteMessageFromQueue, receiveMessage, createMessage } from '../../components/aws/sqs';

export const handler = vandium.sns(async (records) => {
  try {
    console.log('SNS Record', JSON.stringify(records));
    const sqsResponse = await receiveSQS(config.sqs.PaymentsProcess);
    const message = JSON.parse(sqsResponse.Messages[0].Body);
    const { userInfo, paymentInfo, paymentParams, metadata, ipnUrl, order_id } = message;
    await purchasePaymentMethodPush(userInfo, paymentInfo, paymentParams, metadata, ipnUrl, order_id);
    const receiptHandle = sqsResponse.Messages[0].ReceiptHandle;
    await deleteMessageFromQueue(receiptHandle, config.sqs.PaymentsProcess);
  } catch (error) {
    console.log('ERROR in handler', error);
  }
});

const purchasePaymentMethodPush = async (userInfo, paymentInfo, paymentParams, metadata, ipnUrl, order_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const filterAttributes = {
        'payment_method': {
          DataType: 'String',
          StringValue: paymentParams.name
        }
      };
      const message = { userInfo, paymentInfo, paymentParams, metadata, ipnUrl, order_id };
      let QueueUrl = config.sqs[`Payment_${paymentInfo.method === 'creditcard' ? 'psi_gate' : paymentInfo.method}`];
      paymentInfo.method === 'alipay' || paymentInfo.method === 'wechat' ? QueueUrl = config.sqs.Payment_snappay : '';
      const messageId = `Payment_${paymentInfo.method === 'creditcard' ? 'psi_gate' : paymentInfo.method}_${uuid()}`;
      await pushSQSNotification(message, QueueUrl, messageId);
      const pushItem = createPushMessage({}, paymentParams.arn, filterAttributes);
      publish(pushItem);
      resolve({ status: 'done' });
    } catch (error) {
      console.log('ERROR in purchasePaymentMethodPush', error);
      reject(error);
    }
  });
};

const pushSQSNotification = (data, QueueUrl, MessageGroupId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await createMessage({ MessageBody: JSON.stringify(data), QueueUrl, MessageGroupId });
      resolve({ status: 'done' });
    } catch (error) {
      console.log('ERROR in pushSQSNotification', error);
      reject(error);
    }
  });
};

const receiveSQS = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sqsResponse = await receiveMessage(url);
      if (!sqsResponse.Messages) {
        sqsResponse = await receiveSQS(url);
      }
      resolve(sqsResponse);
    } catch (error) {
      console.log('ERROR in receiveSQS', error);
      reject(error);
    }
  });
};

import * as vandium from 'vandium';
import { config } from './../../../config';
import { client } from './../../../components/coinpayments-lib';
import { updateTransaction } from './../../../components/dynamo-requests';
import { receiveMessage, deleteMessageFromQueue } from './../../../components/aws/sqs';

export const handler = vandium.sns(async () => {
  try {
    let sqsResponse = await receiveMessage(config.sqs.Payment_coin_payments);
    let receiptHandle = sqsResponse.Messages[0].ReceiptHandle;
    const message = JSON.parse(sqsResponse.Messages[0].Body);
    console.log('message', message);
    const { userInfo, paymentInfo } = message; // paymentParams
    paymentInfo.email = userInfo.email;
    let coinResponse = await createInCoinPaym(paymentInfo, userInfo.email);
    console.log('coinResponse', coinResponse);
    let Key = {
      transaction_id: paymentInfo.transaction_id,
      created_at: paymentInfo.created_at
    };
    let dataForUpdate = {
      status: 'success',
      step: 'paymentSuccess',
      coinDetails: coinResponse
    };
    console.log('dataForUpdate', Key, dataForUpdate);
    await updateTransaction('UsdWallet', Key, dataForUpdate);
    await deleteMessageFromQueue(receiptHandle, config.sqs.Payment_coin_payments);
    console.log('SUCCESS');
  } catch (error) {
    console.log('ERROR in handler', error);
  }
});

const createInCoinPaym = (dat, email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let options = {
        'cmd': 'create_transaction',
        'currency1': dat.currency,
        'currency2': dat.currency1,
        'amount': dat.amount.price,
        'invoice': dat.transaction_id,
        'buyer_email': email
      };
      client.createTransaction(options, (err, result) => {
        if (err) reject(err);
        console.log('result', result);
        resolve(result);
      });
    } catch (error) {
      console.log('ERROR in createInCoinPaym', error);
      reject(error);
    }
  });
};
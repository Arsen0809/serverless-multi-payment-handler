import _ from 'lodash';
import request from 'request';
import vandium from 'vandium';
import { config } from './../../../config';
import { updateTransaction } from './../../../components/dynamo-requests';
import { deleteMessageFromQueue, receiveMessage } from '../../../components/aws/sqs';
import { XMLtoJSON } from '../../../components/common';

export const handler = vandium.sns(async (records, context, callback) => {
  try {
    console.log('SNS Record', JSON.stringify(records));
    const sqsResponse = await receiveMessage(config.sqs.Payment_psi_gate);
    const message = JSON.parse(sqsResponse.Messages[0].Body);
    const { userInfo, paymentInfo, metadata, ipnUrl, order_id } = message;
    await psiGatePurchase(userInfo, paymentInfo, metadata, ipnUrl, order_id);
    const receiptHandle = sqsResponse.Messages[0].ReceiptHandle;
    await deleteMessageFromQueue(receiptHandle, config.sqs.Payment_psi_gate);
  } catch (error) {
    console.log('ERROR in handler', error);
    callback(null, error);
  }
});


const psiGatePurchase = (userInfo, paymentInfo, metadata, ipnUrl, order_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let paymentRequest = await requestJSONPromise2(await optionsJSON2(userInfo, paymentInfo, paymentInfo.amount));
      let dataForUpdate = {};
      let Key = {
        transaction_id: paymentInfo.transaction_id,
        created_at: paymentInfo.created_at
      };
      if (paymentRequest.body.Approved[0] === 'APPROVED') {
        dataForUpdate = {
          status: 'success',
          step: 'complete',
          paymentTid: paymentRequest.body.OrderID[0]
        };
      } else {
        dataForUpdate = {
          status: 'declined',
          step: 'paymentError',
          errorMessage: paymentRequest.body.ErrMsg[0] && paymentRequest.body.ErrMsg[0] !== '' ? paymentRequest.body.ErrMsg[0].split(':')[1] : paymentRequest.body.ReturnCode[0],
        };
      }
      await updateTransaction('UsdWallet', Key, dataForUpdate);
      resolve('Success');
    } catch (error) {
      console.log('ERROR in psiGatePurchase', error);
      reject(error);
    }
  });
};

function requestJSONPromise2(options) {
  return new Promise((resolve, reject) => {
    request(options, async (error, response, body) => {
      let data = await XMLtoJSON(body);
      if (error) {
        console.log('error in psi ', error);
        reject(error);
      } else {
        resolve({
          'body': data.Result,
          'response': response,
          'header': response.headers
        });
      }
    });
  });
}

async function optionsJSON2(userInfo, paymentInfo, amount) {
  return {
    url: config.stage === 'prod' ? config.PSiGate.prod.url : config.PSiGate.dev.url,
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml'
    },
    body: await generatePSIData(paymentInfo, amount)
  };
}

async function generatePSIData(paymentInfo, amount) {
  const fullAmount = Number(amount.price) + Number(amount.tax);
  let timeData = `<?xml version="1.0" encoding="UTF-8"?>
    <Order>
      <StoreID>${config.stage === 'prod' ? config.PSiGate.prod.StoreID : config.PSiGate.dev.StoreID}</StoreID>
      <Passphrase>${config.stage === 'prod' ? config.PSiGate.prod.Passphrase : config.PSiGate.dev.Passphrase}</Passphrase>
      <PaymentType>CC</PaymentType>
      <CardNumber>${paymentInfo.cardNumber}</CardNumber>
      <CardExpMonth>${paymentInfo.expDate.substring(0, 2)}</CardExpMonth>
      <CardExpYear>${paymentInfo.expDate.substring(3, 5)}</CardExpYear>
      <CardIDNumber>${paymentInfo.cvc}</CardIDNumber>
      <CardAction>1</CardAction>
      <CustomerIP>${paymentInfo.ip}</CustomerIP>
      <Subtotal>${fullAmount}</Subtotal>
      <Bname>${paymentInfo.first_name} ${paymentInfo.last_name}</Bname>
      <Baddress1>${paymentInfo.address}</Baddress1>
      <Baddress2>${paymentInfo.address2 ? paymentInfo.address2 : ''}</Baddress2>
      <Bcity>${paymentInfo.city}</Bcity>
      <Bprovince>${paymentInfo.state ? paymentInfo.state : ''}</Bprovince>
      <Bpostalcode>${paymentInfo.zip}</Bpostalcode>
      <Bcountry>${paymentInfo.country ? paymentInfo.country : ''}</Bcountry>
    </Order>`;
  return timeData;
}

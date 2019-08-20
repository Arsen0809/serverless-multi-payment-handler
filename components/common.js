import * as _ from 'lodash';
import request from 'request';
import { config } from './../config';
import { getItemByGSI } from './dynamo-requests';

let parseString = require('xml2js').parseString;

export function requiredParams(params, req) {
  let response = {
    status: true,
    missing: []
  };
  _.each(params, (key) => {
    if (!req[key]) {
      response.status = false;
      response.missing.push(key);
    }
  });
  return response;
}

export function parseQuery(qstr) {
  let query = {};
  let a = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('&');
  for (let i = 0; i < a.length; i++) {
    let b = a[i].split('=');
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
  }
  return query;
}

export const filterEmailPlusSign = (str) => str.indexOf('+') !== -1 ? str.replace(str.substring(str.indexOf('+'), str.indexOf('@')), '') : str;

export function parseString(qstr) {
  let query = {};
  let a = qstr.split('\n');
  for (let i = 0; i < a.length; i++) {
    let b = a[i].split('=');
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
  }
  return query;
}

export function getPriceByPackage(price) {
  return config.packages[price - 1].price;
}

export function symbolConverter(data) {
  if (data && data.length > 0) {
    data = data.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/%/g, '&#37;');
  }
  return data;
}

export function getSubDomain(referrer) {
  let content = referrer.indexOf('http://') !== -1 ? referrer.replace('http://', '') : referrer.replace('https://', '');
  let splitData = content.split('.');
  console.log(splitData);
  return splitData.length >= 3 ? content : null;
}

export const capitalize = (string) => {
  if (!string) return;
  return string.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

export const printConsole1 = (data) => {
  try {
    let filteredData = _.assign({}, data, {
      cardNumber: '*'.repeat(data.paymentInfo.cardNumber ? data.cardNumber.length : 1),
      cvc: '*'.repeat(data.paymentInfo.cvc ? data.cvc.length : 1),
      expDate: '*'.repeat(data.paymentInfo.expDate ? data.expDate.length : 1)
    });
    return filteredData;
  } catch (err) {
    return err;
  }
};

export function base64MimeType(encoded) {
  let result = null;

  if (typeof encoded !== 'string') {
    return result;
  }
  const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  if (mime && mime.length) {
    result = mime[1];
  }
  return result;
}

export function isBase64(base64String) {
  const regexp = /data:image\/([a-zA-Z]*);base64,([^\']*)/;
  const valid = regexp.test(base64String);
  return valid;
}

export const optionsJSON = (data, method, url, queryStringParameters, apiKey) => {
  let res = {
    url,
    headers: {
      'x-api-key': apiKey || ''
    },
    method,
    queryStringParameters
  };
  method !== 'GET' ? res.body = JSON.stringify(data) : '';
  return res;
};

export const optionsFormData = (data, method, url, queryStringParameters, apiKey) => {
  let res = {
    url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: "POST",
    queryStringParameters,
    form: data
  };
  return res;
};

export const requestJSONPromise = (option) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(option);
      request(option, (error, response, body) => {
        console.log(body);
        error ? reject(error) : resolve({
          'body': body,
          'response': response,
          'header': response.headers
        });
      });
    } catch (error) {
      console.log('error in requestJSONPromise', error);
      reject(error);
    }
  });
};

export function XMLtoJSON(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, function (err, result) {
      if (err) { reject(err); }
      resolve(result);
    });
  });
};

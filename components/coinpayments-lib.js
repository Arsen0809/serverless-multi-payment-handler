import Coinpayments from 'coinpayments';
import { config } from './../config';

let options = {
  key: config.coinpayments.key, // '20f67eec5f7c5d1c7106757c4e7fe3eae20bafce7e01b6d59defe5b260ca764a',
  secret: config.coinpayments.secret // 'a53586c36E4Fd3941b5045Bb8bf70b8EeD5bd4cfdd50f4E95ef82f45918742e9'
};
export const client = new Coinpayments(options);

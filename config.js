export const config = {
  region: process.env.REGION,
  stage: process.env.STAGE,
  IdentityPoolId: process.env.COGNITO_IDENTITY_POOL,
  UserPoolId: process.env.COGNITO_USERPOOL,
  ClientId: process.env.COGNITO_CLIENT,
  AwsAccountNo: process.env.AWS_ACCOUNT_NO,
  tableStage: process.env.STAGE === 'prod' ? 'prod' : 'dev',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  topics: {
    aymentProcess: `arn:aws:sns:${process.env.REGION}:${process.env.AWS_ACCOUNT_NO}:Pay-${process.env.STAGE}`,
    CoinPayment: `arn:aws:sns:${process.env.REGION}:${process.env.AWS_ACCOUNT_NO}:StoreCoinPayment-${process.env.STAGE}`,
    EmailNotifications: `arn:aws:sns:${process.env.REGION}:${process.env.AWS_ACCOUNT_NO}:EmailNotifications-${process.env.STAGE}`,
    Pay: `arn:aws:sns:${process.env.REGION}:${process.env.AWS_ACCOUNT_NO}:Pay-${process.env.STAGE}`,
    PaymentsProcess: `arn:aws:sns:${process.env.REGION}:${process.env.AWS_ACCOUNT_NO}:PaymentProcess-${process.env.STAGE}`,
  },
  sqs: {
    Pay: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_NO}/Pay-${process.env.STAGE}.fifo`,
    EmailNotifications: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_NO}/EmailNotifications-${process.env.STAGE}.fifo`,
    PaymentsProcess: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_NO}/PaymentsProcess-${process.env.STAGE}.fifo`,
    Payment_psi_gate: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_NO}/PaymentPSIGate-${process.env.STAGE}.fifo`,
    Payment_coin_payments: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_NO}/PaymentCoinPayments-${process.env.STAGE}.fifo`,
  },
  coinpayments: {
    key: '',
    secret: '',
    ipnSecret: process.env.IPN_SECRET
  },
  paymentMethods: [
    {
      name: 'coin_payments',
      arn: `arn:aws:sns:${process.env.REGION}:${process.env.AWS_ACCOUNT_NO}:CoinPaymentsPayment-${process.env.STAGE}`,
      action: 2
    },
    {
      name: 'psi_gate',
      arn: `arn:aws:sns:${process.env.REGION}:${process.env.AWS_ACCOUNT_NO}:PsiGatePayment-${process.env.STAGE}`,
      action: 1
    }
  ]
};
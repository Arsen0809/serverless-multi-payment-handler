const AWS = require("aws-sdk");
var ses = new AWS.SES();
import * as _ from 'lodash';

export const crashEmailSender = (error, obj, endPoint) => {
    let subject = "Error Message";
    console.log('******* bookVerificationEmail: mail Data ********')
    let printData = '';
    _.forEach(obj, (item, key) => {
      printData += `<span style="text-transform: capitalize;">${key.replace(/_/g, ' ')}: ${item}</span><br>`;
    });
    return ses.sendEmail({
        Source: `error-message@globetrottr.net`,
        Destination: {
            ToAddresses: ['jason@globetrottr.com', 'larrybekchyan@gmail.com']
        },
        Message: {
            Subject: {
                Data: subject
            },
            Body: {
                Html: {
                    Data: `
                        <html>
                            <head>
                                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                                <title>Error in Endpoint ${endPoint}</title>
                            </head>
                            <body>
                                Status: ${error.status}<br/>,
                                Error: ${error.message}
                                <br><br>
                                User Object:<br>
                                ${printData}
                            </body>
                        </html>
                    `
                }
            }
        }
    }).promise();
  };
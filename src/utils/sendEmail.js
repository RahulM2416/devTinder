const SendEmailCommand = require("@aws-sdk/client-ses");
const { sesClient } = require('../utils/sesClient');

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: "<h1> Hello , you have got a new connection request , go to website and check in the 'connections' to see who have sent you </h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "Message from devTinder Team..!",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "New Connection Request Recieved.",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "eng23cs0153@dsu.edu.in",
    "rahulm6124@gmail.com",
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
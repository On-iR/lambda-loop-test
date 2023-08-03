import * as sqs from "@aws-sdk/client-sqs";

exports.handler = async function () {
  const client = new sqs.SQSClient({});
  const command = new sqs.SendMessageCommand({
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: "this is custom message!",
  });

  await client.send(command);

  console.log("★★★★★★★★★★ hello sqs");
};

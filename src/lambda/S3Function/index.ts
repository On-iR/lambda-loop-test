import * as s3 from "@aws-sdk/client-s3";

exports.handler = async function () {
  const client = new s3.S3Client({});
  const command = new s3.PutObjectCommand({
    Bucket: process.env.BUCKET,
    Key: "test.txt",
    Body: "test",
  });

  await client.send(command);

  console.log("★★★★★★★★★★ hello s3");
};

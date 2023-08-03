import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as s3 from "aws-cdk-lib/aws-s3";
import {
  SqsEventSource,
  S3EventSource,
} from "aws-cdk-lib/aws-lambda-event-sources";

export class LambdaLoopTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sampleSqs = new sqs.Queue(this, "SampleSqs", {});

    const sqsFunction = new lambda.Function(this, "SqsFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("src/lambda/SqsFunction"),
      environment: {
        QUEUE_URL: sampleSqs.queueUrl,
      },
    });

    sampleSqs.grantSendMessages(sqsFunction);
    sqsFunction.addEventSource(new SqsEventSource(sampleSqs));

    const sampleS3 = new s3.Bucket(this, "SampleS3");

    const s3Function = new lambda.Function(this, "S3Function", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("src/lambda/S3Function"),
      environment: {
        BUCKET: sampleS3.bucketName,
      },
    });

    sampleS3.grantPut(s3Function);
    s3Function.addEventSource(
      new S3EventSource(sampleS3, { events: [s3.EventType.OBJECT_CREATED_PUT] })
    );
  }
}

import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as iam from '@aws-cdk/aws-iam';

export class HtmlToPdfPuppeteerLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const htmlToPdfLambda = new lambda.Function(this, 'HtmlToPdfLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('./lambda/dist'),
      layers: [
        // https://github.com/shelfio/chrome-aws-lambda-layer
        lambda.LayerVersion.fromLayerVersionArn(this, 'ChromeLayer', 'arn:aws:lambda:eu-west-1:764866452798:layer:chrome-aws-lambda:19'),
      ],
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(30),
      memorySize: 1600,
    });

    const api = new apigateway.RestApi(this, "HtmlToPdfApi", {
      restApiName: "HtmlToPdfApi",
      description: "HTML to PDF api",
      defaultMethodOptions: {
        authorizationType: apigateway.AuthorizationType.IAM,
      },
      policy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            principals: [new iam.AccountPrincipal(this.account)],
            actions: ["execute-api:Invoke"],
            resources: ["execute-api:/*"],
          }),
        ],
      }),
    });

    const resource = api.root.addResource('html-to-pdf');
    const integration = new apigateway.LambdaIntegration(htmlToPdfLambda);
    resource.addMethod('POST', integration);
  }
}

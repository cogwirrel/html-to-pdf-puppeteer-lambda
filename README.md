# HTML to PDF Lambda using Puppeteer

This is an example of mixing puppeteer, webpack and lambda to convert html to pdfs!

Makes use of:
- https://github.com/shelfio/chrome-aws-lambda-layer/
- https://github.com/alixaxel/chrome-aws-lambda

It's a CDK project, and spins up a minimal api with IAM auth

## Bootstrap

Just like a normal CDK project...

`cdk boostrap`

## Deploy

```
cd lambda
npm ci && npm run build
cd ..
npm ci && npm run build
cdk deploy
```

## Test

Use `awscurl`:
- https://github.com/okigan/awscurl

```
awscurl --service execute-api -X POST https://YOURAPI.execute-api.REGION.amazonaws.com/prod/html-to-pdf -d '<h1>Hello World</h1>'
```

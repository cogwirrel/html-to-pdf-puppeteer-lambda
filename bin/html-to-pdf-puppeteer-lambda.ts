#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HtmlToPdfPuppeteerLambdaStack } from '../lib/html-to-pdf-puppeteer-lambda-stack';

const app = new cdk.App();
new HtmlToPdfPuppeteerLambdaStack(app, 'HtmlToPdfPuppeteerLambdaStack');

# Clean Architect NodeJS/ExpressJS Serverless with AWS Lambda

Starter project for Serverless Restful API application using AWS Lambda, API Gateway with SAM local, applying Clean Architecture for defining dependencies and structuring code. 

Behavior Driven Development is applied as well with ready baked script for common actions: build, test, deploy, undeploy, test with code coverage, end-to-end testing.

## Folder Structure

```bash
.
├── README.MD                   <-- This instructions file
├── app                         <-- Source code for the application
│   └── @types                  <-- TypeScript types definitions
│   │   └── express.d.t         <-- Extension to ExpressJS
│   └── e2e                     <-- End to end API testing features
│   └── features                <-- Application testing features
│   └── lib                     <-- Main application code
│   │   └── application         <-- Application services
│   │   │   └── event           <-- Application wide events
│   │   │   └── repositories    <-- Data access interfaces
│   │   │   └── security        <-- Security interfaces
│   │   │   └── use_cases       <-- Application business use cases
│   │   └── domain              <-- Core business layer
│   │   │   └── container       <-- Dependency Injection Container
│   │   │   └── entities        <-- Domain Entities 
│   │   └── infrastructure      <-- Extension to ExpressJS
│   │   │   └── config          <-- JSON configurations 
│   │   │   └── webserver       <-- Web Server (ExpressJS) interfaces
│   │   │       └── middlewares <-- ExpressJS Middlewares
│   │   │       └── plugins     <-- ExpressJS Plugins
│   │   │       └── routers     <-- ExpressJS Routers
│   │   │       └── Server.ts   <-- ExpressJS Application entry point
│   │   └── interfaces          <-- Extension to ExpressJS
│   │   │   └── config          <-- Configuration implementations
│   │   │   └── container       <-- DI Contaier implementations
│   │   │   └── controllers     <-- Logic routers
│   │   │   └── repositories    <-- Data Access implementations
│   │   │   └── security        <-- Security implementations
│   │   │   └── serializers     <-- Response serializers 
│   └── Lambda.ts               <-- Lambda Handler entry point
│   └── Local.ts                <-- Local development server entry pont
│   └── package.json            <-- Development scripts
│   └── tsconfig.json           <-- Typescript config
│   └── tslint.json             <-- TSLint config
├── package.json                <-- SAM scripts
├── template.yaml               <-- SAM template

```

The ```app/lib``` folder contains all the implementation of the application which follows the Clean Architecture design as below image

![clean architecture layer diagram](http://blog.cleancoder.com/uncle-bob/images/2012-08-13-the-clean-architecture/CleanArchitecture.jpg)

## Requirements

* [SAM installed](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* [NodeJS 8.15+ installed](https://nodejs.org/en/download/) - NodeJS 8.15 is currently the highest supported version by Lambda. If you have to run other version then consider installing [NVM](https://github.com/creationix/nvm) as well.
* [Docker installed](https://www.docker.com/community-edition)

## Description

The AWS API Gateway is a [Proxy Resourse](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html) which will direct every requests to the Lambda handler which in turn pass to [AWS Serverless Express](https://github.com/awslabs/aws-serverless-express) which acts like a bridge to our ExpressJS application.

Thus, the development of the ExpressJS application is totally the same with developing a normal ExpressJS application.

There are two entry points to the ExpressJS application
1. ```Lambda.js``` - This is the entry points which setup the AWS Serverless Express and bridge all request from Lambda to ExpressJS application
1. ```Local.js``` - This is the normal ExpressJS application which can be used for local development or deployed separate if needed

## Development

All development happens inside ```app``` folder.

### Setup

1. ```cd app```
1. Make sure NodeJS 8.15 is the default one (```nvm use 8.15``` if ```nvm``` is being used)
1. ```npm install```

### Build Typescript

Run either ```npm run build``` for single time build or ```npm run build:watch``` for watching changes and build.

### Run local server

```node Local.js```

In case you want to watch for changes without the need of stopping/starting the application manually, then consider using [nodemon](https://github.com/remy/nodemon)

### Run BDD test features

```npm run test```

```bash
> clean-starter@1.0.0 test /Users/ntr9h/Projects/clean-starter/app
> npm run build && cucumber-js -f node_modules/cucumber-pretty --exit features/**/*.feature


> clean-starter@1.0.0 build /Users/ntr9h/Projects/clean-starter/app
> tsc

Feature: Authenticate user using username and password

  Scenario: empty email
    When authenticate with email "" and password "any"
    Then return Bad Request Problem

  Scenario: empty password
    When authenticate with email "any" and password ""
    Then return Bad Request Problem

  Scenario: invalid credential
    Given invalid credential
    When authenticate with email "any" and password "any"
    Then return Unauthorized Problem

  Scenario: user to auth response mapping
    Given User JSON '{"id":"any-id","email":"any@email","name":"Any Name"}'
    When authenticate with email "any" and password "any"
    Then return token having id of "any-id"

Feature: Authenticate user using token

  Scenario: empty token
    When resolve token ""
    Then return Forbidden Problem

  Scenario: invalid token
    When resolve token "anything"
    Then return Forbidden Problem

  Scenario: valid token of not existing user
    Given valid token
    But token could not be resolved to a user
    When resolve token "anything"
    Then return Forbidden Problem

  Scenario: valid token of existing merchant
    Given valid token
    And token resolved to an existing user
    When resolve token "anything"
    Then return the matching user

Feature: Fido2Authenticate user using hardware security key
  This is to support passwordless authentication

  Scenario: register challenge request with empty email
    When requestRegister with email "" 
    Then return Bad Request Problem

  Scenario: register challenge request with any email
    When requestRegister with email "any@email" 
    Then return attestationoption having challenge not null and attestation is direct

 Scenario: register attestation validation request with invalid attestation
    Given WebAuthNUser JSON '{"id":"any-id","email":"any@email","challenge":"a challenge"}'
    When register with attestation '{"rawI": "invalid attestation"}'
    Then return Unauthorized Problem

 Scenario: register attestation validation request with valid attestation
    Given WebAuthNUser JSON '{"id":"any-id","email":"any@email","challenge":"a challenge"}'
    When register with attestation '{"rawId":"L8GNu..NA==","response":{"attestationObject":"o2Nm..gSQ==","getAuthenticatorData":{},"getPublicKey":{},"getPublicKeyAlgorithm":{},"getTransports":{},"clientDataJSON":"eyJ0eXBl..lts":{},"id":"L8GNuxJ...xNA","type":"public-key"}'
    Then return true

Scenario: login request with empty email
    Given WebAuthNUser JSON '{"id":"any-id","email":"any@email","challenge":"a challenge"}'
    When login with email "" 
    Then return Bad Request Problem

Scenario: login request with any user with valid key
   Given WebAuthNUser JSON '{"email":"any@email","challenge":"prior challenge","key":{"fmt":"packed","publicKey":"BKkF...aE=","counter":1,"credID":"Y668...qRXMA=="}}'
   When login with email "any@email" 
   Then return assertionOptions having different challenge than "prior challenge"
 
Scenario: login assertion validation request with invalid attestation
   Given WebAuthNUser JSON '{"email":"any@email","challenge":"prior challenge"}'
   When loginChallenge with assertion '{"rawI": "invalid attestation"}' 
   Then return Unauthorized Problem

Scenario: login assertion validation request with valid attestation
   Given WebAuthNUser JSON '{"id": "anyid", "email":"any@email","challenge":"prior challenge","key":{"fmt":"packed","publicKey":"BKkFhm...aE=","counter":1,"credID":"Y668QqUn...=="}}'
   When loginChallenge with assertion '{"rawId":"Y668...A==","response":{"authenticatorData":"SZYN5Yg...g==","signature":"MEU...h9A=","userHandle":null,"clientDataJSON":"eyJ0eXB...X0="},"getClientExtensionResults":{},"id":"Y668QqUn...MA","type":"public-key"}' 
   Then return valid token


16 scenarios (16 passed)
44 steps (44 passed)
0m00.018s
```

### Run BDD test features with code coverage

```npm run coverage```

```bash
----------------------------|----------|----------|----------|----------|-------------------|
File                        |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------------------------|----------|----------|----------|----------|-------------------|
All files                   |    82.67 |    64.71 |    95.65 |    81.67 |                   |
 application/use_cases/auth |       80 |    81.82 |      100 |    79.45 |                   |
  Authenticate.ts           |    86.67 |      100 |      100 |    85.71 |             50,53 |
  Fido2Authenticate.ts      |    73.08 |    77.78 |      100 |    72.34 |... 21,133,152,168 |
  ResolveToken.ts           |      100 |      100 |      100 |      100 |                   |
 domain/entities            |    85.71 |    56.52 |      100 |    84.85 |                   |
  Problem.ts                |    84.62 |    56.52 |      100 |    83.33 |    27,41,42,46,47 |
  User.ts                   |      100 |      100 |      100 |      100 |                   |
 interfaces/config          |      100 |      100 |      100 |      100 |                   |
  AuthnConfig.ts            |      100 |      100 |      100 |      100 |                   |
 interfaces/security        |       80 |      100 |       75 |       80 |                   |
  JwtProvider.ts            |       80 |      100 |       75 |       80 |             20,23 |
----------------------------|----------|----------|----------|----------|-------------------|
```

### Run BDD End-to-end test features

```npm run e2e```

E2E tests expect the RestAPI to be located at ```http://localhost:8080```, this can be changed inside ```app/e2e/Authenticate.ts```

### AWS Development 

Make sure you are on the project's root and run

```npm run api``` 

this will start the local RestAPI in SAM local development environment.

### AWS Deployment

Make sure you are on the project's root.

#### Build 

Make sure Docker is running then run 

```npm run build```

```bash
> clean-starter-aws@1.0.0 build /Users/xxx/Projects/clean-starter
> npm run compile && sam build --use-container --skip-pull-image


> clean-starter-aws@1.0.0 compile /Users/xxx/Projects/clean-starter
> cd app && npm run build && cd ..


> clean-starter@1.0.0 build /Users/xxx/Projects/clean-starter/app
> tsc

2019-04-02 09:54:13 Starting Build inside a container
2019-04-02 09:54:13 Found credentials in shared credentials file: ~/.aws/credentials
2019-04-02 09:54:14 Building resource 'StarterKitHandler'
2019-04-02 09:54:14 Requested to skip pulling images ...

2019-04-02 09:54:14 Mounting /Users/xxx/Projects/clean-starter/app as /tmp/samcli/source:ro inside runtime container

Build Succeeded

Built Artifacts  : .aws-sam/build
Built Template   : .aws-sam/build/template.yaml

Commands you can use next
=========================
[*] Invoke Function: sam local invoke
[*] Package: sam package --s3-bucket <yourbucket>
    
Running NodejsNpmBuilder:NpmPack
Running NodejsNpmBuilder:CopyNpmrc
Running NodejsNpmBuilder:CopySource
Running NodejsNpmBuilder:NpmInstall
Running NodejsNpmBuilder:CleanUpNpmrc
```

#### Package

Before packaging, and S3 bucket with name ```clean-starter-aws-staging``` must exist. The bucket can be created by running ```npm run create-s3```.

```npm run package```

```bash
> clean-starter-aws@1.0.0 package /Users/xxx/Projects/clean-starter
> sam package --s3-bucket $npm_package_name-staging --output-template-file packaged.yaml

Uploading to fbd4a19af525b693a4f688ad645b0a75  7834591 / 7834591.0  (100.00%)
Successfully packaged artifacts and wrote output template to file packaged.yaml.
Execute the following command to deploy the packaged template
aws cloudformation deploy --template-file /Users/xxx/Projects/clean-starter/packaged.yaml --stack-name <YOUR STACK NAME>
```

#### Deploy

```npm run deploy```

```bash
> clean-starter-aws@1.0.0 deploy /Users/xxx/Projects/clean-starter
> sam deploy --template-file packaged.yaml --stack-name $npm_package_name-staging --capabilities CAPABILITY_IAM --parameter-overrides Stage=staging

Waiting for changeset to be created..
Waiting for stack create/update to complete
Successfully created/updated stack - clean-starter-aws-staging
```

#### Install

Run ```npm run install``` to run all the 3 steps above in 1 single call.

#### Uninstall

Run ```npm run uninstall``` to remove all the related resources from AWS.


## Configuration

### STAGE

```process.env.STAGE``` can be accessed in code to pick the right configuration for different environment. 

For example: 

```typescript
import * as cfg from "../../infrastructure/config/jwt.json";
import IJwtConfig from "../security/IJwtConfig";

export default class JwtConfig implements IJwtConfig {
  public readonly key: string;
  public readonly expiresIn: string

  constructor() {
    Object.assign(this, process.env.STAGE === 'production' ? cfg.production : cfg.staging)
  }
}
```

To deal with production environment append ```:prod``` to your script name, for example - to build for production environment run ```npm run build:prod``` or ```npm run install:prod```.

### Authentication methods
There are three authentication options as follows
1. UPN authentication
1. Multi-factor authentication, in which UPN is the primary authenticator and FIDO2 the second authenticator
1. Passwordless authentication, using FIDO2 protocol

The authentication methods are specified on an application-level configuration file named authnConfig.json. There are 2 settings as follows
```typescript
{
    "enablePasswordless": true,
    "enable2FAWithFido2": true
}
``` 

### AWS Resources Name

Several resources are created during installation with format ```<package_name>-<environment>```
1. S3 buckets ```clean-starter-aws-staging``` and ```clean-starter-aws-production```
1. SAM uses [CloudFormation](https://aws.amazon.com/cloudformation/) to manage resources. Thus to see the created resources, login to your AWS CloudFormation management and open the item with name ```clean-starter-aws-staging```


## TODO
1. Clean Architecture Analysis
1. Sample fetching data with resolve token

## References
1. Clean Architecture - http://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html 
1. AWS Serverless Application Model - https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-template.html 
1. Set up a Proxy Integration with a Proxy Resource - https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html
1. CucumberJS - https://github.com/cucumber/cucumber-js 
1. IstanbulJS - https://istanbul.js.org/
1. AWS Serverless Express - https://github.com/awslabs/aws-serverless-express
1. Introduction to WebAuthn API - https://herrjemand.medium.com/introduction-to-webauthn-api-5fd1fb46c285


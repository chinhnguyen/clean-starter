# Clean Architect NodeJS/ExpressJS Serverless with AWS Lambda

Starter project for Serverless Restful API application using AWS Lambda, API Gateway with SAM local, applying Clean Architecture for defining dependencies and structuring code. 

Behavior Driven Development is applied as well with ready baked script for common actions: build, test, deploy, undeploy, test with code coverage, end-to-end testing.

## Folder Strucsture

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

### Run BDD test features with code coverage

```npm run coverage```

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

### AWS Resources Name

Several resources are created during installation with format ```<package_name>-<environment>```
1. S3 buckets ```clean-starter-aws-staging``` and ```clean-starter-aws-production```
1. SAM uses [CloudFormation](https://aws.amazon.com/cloudformation/) to manage resources. Thus to see the created resources, login to your AWS CloudFormation management and open the item with name ```clean-starter-aws-staging```


## References
1. Clean Architecture - http://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html 
1. AWS Serverless Application Model - https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-template.html 
1. Set up a Proxy Integration with a Proxy Resource - https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html
1. CucumberJS - https://github.com/cucumber/cucumber-js 
1. IstanbulJS - https://istanbul.js.org/
1. AWS Serverless Express - https://github.com/awslabs/aws-serverless-express
import { Construct } from 'constructs';
import { App, S3Backend, TerraformStack } from 'cdktf';
import {
    AwsProvider,
    S3Bucket,
    Route53Zone,
    Route53Record,
    CloudfrontDistribution,
    AcmCertificate,
    AcmCertificateValidation,
    DataAwsIamPolicyDocument,
    CloudfrontOriginAccessIdentity,
    S3BucketPolicy,
} from "./.gen/providers/aws";
import { LambdaAtEdge } from "./.gen/modules/transcend-io/lambda-at-edge/aws";
import { configuration } from "./configuration";
import * as path from "path";
import { convertDomainValidationOptions } from "./utils/CustomAcmCertificateDomainValidationOptions";

class MyStack extends TerraformStack {
    constructor(scope: Construct, name: string) {
        super(scope, name);

        const { backendBucket, backendKey, domainHost, domainName, lambdaS3Key } = configuration;

        new S3Backend(this, {
            bucket: backendBucket,
            key: backendKey,
            region: 'us-east-1',
        })

        const provider = new AwsProvider(this, 'default', {
            region: 'us-east-1',
        });

        const bucket = new S3Bucket(this, 'resource', {
            provider,
            bucket: domainName,
            acl: "private"
        });

        const originAccessIdentity = new CloudfrontOriginAccessIdentity(this, 'origin_access_identity')

        const policyDocument = new DataAwsIamPolicyDocument(this, 'bucket', {
            provider,
            statement: [
                {
                    actions: [`s3:GetObject`],
                    resources: [
                        `${bucket.arn}/*`
                    ],
                    principals: [{
                        type: "AWS",
                        identifiers: [
                            originAccessIdentity.iamArn
                        ]
                    }],
                },
                {
                    actions: [`s3:ListBucket`],
                    resources: [
                        bucket.arn!,
                    ],
                    principals: [{
                        type: "AWS",
                        identifiers: [
                            originAccessIdentity.iamArn
                        ]
                    }],
                }
            ],
        });

        new S3BucketPolicy(this, 'policy', {
            bucket: bucket.id!,
            policy: policyDocument.json
        });

        const acmCertificate = new AcmCertificate(this, 'AcmCertificate', {
            provider,
            domainName: domainHost,
            subjectAlternativeNames: [
                `*.${domainHost}`,
            ],
            validationMethod: 'DNS',
            lifecycle: {
                createBeforeDestroy: true,
            }
        });

        const route53Zone = new Route53Zone(this, 'zone', {
            provider,
            name: domainHost,
        });

        const certificateValidationRecord = new Route53Record(this, 'certificateValidation', {
            zoneId: route53Zone.zoneId,
            name: convertDomainValidationOptions(acmCertificate, '0').resourceRecordName,
            type: convertDomainValidationOptions(acmCertificate, '0').resourceRecordType,
            records: [
                convertDomainValidationOptions(acmCertificate, '0').resourceRecordValue
            ],
            ttl: 60
        });

        new AcmCertificateValidation(this, 'AcmCertificateValidation', {
            provider,
            certificateArn: acmCertificate.arn,
            validationRecordFqdns: [certificateValidationRecord.fqdn]
        });

        const { arnOutput: lambdaAtEdgeArn } = new LambdaAtEdge(this, 'lambdaAtEdge', {
            description: 'Implements SPA hosting',
            lambdaCodeSourceDir: path.resolve(__dirname, "./lambda"),
            name: 'spaRedirectS3Edge',
            s3ArtifactBucket: lambdaS3Key,
            runtime: "nodejs14.x"
        });

        const cloudfrontDistribution = new CloudfrontDistribution(this, 'cloudfront', {
            provider,
            origin: [{
                domainName: bucket.bucketRegionalDomainName,
                originId: domainName,
                s3OriginConfig: [{
                    originAccessIdentity: originAccessIdentity.cloudfrontAccessIdentityPath,
                }]
            }],
            enabled: true,
            defaultRootObject: 'index.html',
            aliases: [
                `*.${domainHost}`,
            ],
            restrictions: [{
                geoRestriction: [{
                    restrictionType: 'none',
                }]
            }],
            defaultCacheBehavior: [
                {
                    viewerProtocolPolicy: "redirect-to-https",
                    compress: true,
                    allowedMethods: ["GET", "HEAD", "OPTIONS"],
                    cachedMethods: ["GET", "HEAD", "OPTIONS"],
                    targetOriginId: domainName,
                    minTtl: 0,
                    defaultTtl: 86400,
                    maxTtl: 31536000,

                    forwardedValues: [{
                        queryString: false,
                        headers: [
                            "Origin",
                            "Host"
                        ],
                        cookies: [{
                            forward: "none"
                        }]
                    }],

                    lambdaFunctionAssociation: [{
                        eventType: "origin-request",
                        includeBody: false,
                        lambdaArn: lambdaAtEdgeArn
                    }]
                }
            ],
            orderedCacheBehavior: [],
            viewerCertificate: [{
                acmCertificateArn: acmCertificate.arn,
                sslSupportMethod: "sni-only",
            }],
        });

        new Route53Record(this, 'domain', {
            provider,
            zoneId: route53Zone.zoneId,
            name: `*.${domainHost}`,
            type: 'A',

            alias: [
                {
                    evaluateTargetHealth: false,
                    name: cloudfrontDistribution.domainName,
                    zoneId: cloudfrontDistribution.hostedZoneId
                }
            ]
        });
    }
}

const app = new App();
new MyStack(app, 'terraform');
app.synth();

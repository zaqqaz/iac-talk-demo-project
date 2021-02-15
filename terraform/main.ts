import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';
import { AwsProvider, S3Bucket, Route53Zone, Route53Record } from "./.gen/providers/aws";

class MyStack extends TerraformStack {
    constructor(scope: Construct, name: string) {
        super(scope, name);

        const domainHost = `ux.by`
        const domainName = `iac-talk-demo-project.${domainHost}`

        const provider = new AwsProvider(this, 'default', {
            region: 'us-east-1',
        });

        const bucket = new S3Bucket(this, 'resource', {
            provider,
            bucket: domainName,
            acl: "public-read",
            website: [
                {
                    indexDocument: 'index.html'
                }
            ],
        });

        const route53Zone = new Route53Zone(this, 'zone', {
            provider,
            name: domainHost,
        });

        new Route53Record(this, 'domain', {
            provider,
            zoneId: route53Zone.zoneId,
            name: domainName,
            type: 'A',

            alias: [
                {
                    evaluateTargetHealth: false,
                    name: bucket.websiteDomain,
                    zoneId: bucket.hostedZoneId
                }
            ]
        });
    }
}

const app = new App();
new MyStack(app, 'terraform');
app.synth();

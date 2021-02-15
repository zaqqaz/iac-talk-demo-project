import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';
import { AwsProvider, S3Bucket } from "./.gen/providers/aws";

class MyStack extends TerraformStack {
    constructor(scope: Construct, name: string) {
        super(scope, name);

        const bucketName = 'iac-talk-demo-project.ux.by'

        const provider = new AwsProvider(this, 'default', {
            region: 'us-east-1',
        });

        new S3Bucket(this, 'resource', {
            bucket: bucketName,
            provider,
            acl: "public-read",
            website: [
                {
                    indexDocument: 'index.html'
                }
            ],
        });
    }
}

const app = new App();
new MyStack(app, 'terraform');
app.synth();

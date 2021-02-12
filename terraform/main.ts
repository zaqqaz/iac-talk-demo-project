import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';

class MyStack extends TerraformStack {
    constructor(scope: Construct, name: string) {
        super(scope, name);

    }
}

const app = new App();
new MyStack(app, 'terraform');
app.synth();

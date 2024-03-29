# Infrastructure As Code for JS applications on AWS with TypeScript

 
### [Talk](https://www.youtube.com/watch?v=sbZn5RCITMo)
<a href="https://www.youtube.com/watch?v=sbZn5RCITMo" target="_blank">
 <img width="450" src="https://user-images.githubusercontent.com/2823336/172821816-87d8931d-6878-4254-9da1-cb9e4c5cd844.png">
</a>

Demo for the conference talk.

<img width="1130" alt="Complete infrastructure" src="https://user-images.githubusercontent.com/2823336/108758439-feea6e80-7542-11eb-995a-70f88bfbacbb.png">

## Pre-requirement

- `yarn install` (note: this project uses [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/))

## Infrastructure managed by Terraform
From the `terraform` directory (`cd terraform`) you can run:

- `yarn get` to fetch TF modules and typings
- `yarn build` to build typescript and fetch TF modules
- `yarn watch` to build typescript in watch mode (note: to fetch modules run `yarn get`)
- `yarn synth` to generate `cdk.tf.json` used by `terraform` cli
 
 From `cdktf.out` directory (`cd cdktf.out`)
 
- `terraform init` to initialize terraform project
- `terraform plan` to create an [execution plan](https://www.terraform.io/docs/cli/commands/plan.html)
- `terraform apply` to [apply the changes](https://www.terraform.io/docs/cli/commands/apply.html) required to reach the desired state of the configuration
- `terraform destroy` to [destroy](https://www.terraform.io/docs/cli/commands/destroy.html) the Terraform-managed infrastructure

## Available Scripts for the client app

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

- `yarn start`
- `yarn test`
- `yarn build`

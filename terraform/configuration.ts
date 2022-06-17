export const configuration = {
    domainHost: process.env.DomainHost ?? 'ux.by',
    domainName: process.env.DomainName ?? 'iac-talk-demo-project.ux.by',
    backendBucket: process.env.BackendBucket ?? 'terraform-backend.ux.by',
    backendKey: process.env.BackendKey ?? 'iac-talk-demo-project',
    lambdaS3Key: process.env.lambdaS3Key ?? 'lambdas-ux-by'
};

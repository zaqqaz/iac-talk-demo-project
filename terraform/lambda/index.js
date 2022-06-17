const path = require('path');

const remove_suffix = ".ux.by";
const origin_hostname = "iac-talk-demo-project.ux.by.s3.amazonaws.com";

module.exports.handler = async (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const host_header = headers.host[0].value;
    if (host_header.endsWith(remove_suffix)) {
        // to support SPA | redirect all(non-file) requests to index.html
        const parsedPath = path.parse(request.uri);
        if (parsedPath.ext === '') {
            request.uri = "/index.html";
        }

        request.uri = "/" + host_header.substring(0, host_header.length - remove_suffix.length) + request.uri;
    }

    headers.host[0].value = origin_hostname;
    return callback(null, request);
};

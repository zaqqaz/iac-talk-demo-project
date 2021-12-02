import { AcmCertificate } from "../.gen/providers/aws/index";
import { ComplexComputedToList } from "./ComplexComputedToList";

class CustomAcmCertificateDomainValidationOptions extends ComplexComputedToList {
    // domain_name - computed: true, optional: false, required: true
    public get domainName() {
        return this.getStringAttribute("domain_name");
    }

    // resource_record_name - computed: true, optional: false, required: true
    public get resourceRecordName() {
        return this.getStringAttribute("resource_record_name");
    }

    // resource_record_type - computed: true, optional: false, required: true
    public get resourceRecordType() {
        return this.getStringAttribute("resource_record_type");
    }

    // resource_record_value - computed: true, optional: false, required: true
    public get resourceRecordValue() {
        return this.getStringAttribute("resource_record_value");
    }
}

export const convertDomainValidationOptions = (cert: AcmCertificate, index: string) =>
    new CustomAcmCertificateDomainValidationOptions(
        cert,
        "domain_validation_options",
        index
    );
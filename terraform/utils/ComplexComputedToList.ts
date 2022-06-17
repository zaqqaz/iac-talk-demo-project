import { ITerraformResource, Token } from "cdktf";

export class ComplexComputedToList {
    terraformResource: ITerraformResource;
    terraformAttribute: string;
    index: string;
    /**
     * @experimental
     */
    constructor(
        terraformResource: ITerraformResource,
        terraformAttribute: string,
        index: string
    ) {
        this.terraformResource = terraformResource;
        this.terraformAttribute = terraformAttribute;
        this.index = index;
    }
    /**
     * @experimental
     */
    getStringAttribute(terraformAttribute: string) {
        return Token.asString(
            this.interpolationForAttribute(terraformAttribute)
        );
    }
    /**
     * @experimental
     */
    getNumberAttribute(terraformAttribute: string) {
        return Token.asNumber(
            this.interpolationForAttribute(terraformAttribute)
        );
    }
    /**
     * @experimental
     */
    getListAttribute(terraformAttribute: string) {
        return Token.asList(this.interpolationForAttribute(terraformAttribute));
    }
    /**
     * @experimental
     */
    getBooleanAttribute(terraformAttribute: string) {
        return Token.asString(
            this.interpolationForAttribute(terraformAttribute)
        );
    }
    /**
     * @experimental
     */
    interpolationForAttribute(property: string) {
        const {
            terraformResourceType,
            friendlyUniqueId,
        } = this.terraformResource;
        return `\${tolist(${terraformResourceType}.${friendlyUniqueId}.${this.terraformAttribute})[${this.index}].${property}}`;
    }
}

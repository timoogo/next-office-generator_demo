export type GenericModel = Record<string, GenericModelProperties>;

export interface GenericEntityFront extends GenericModel {
    [key: string]: any;
}

export type GenericModelPropertiesValue = "string" | "integer" | "number" | "boolean" | "object" | "array" | "null";
type GenericModelProperties = {
    type: GenericModelPropertiesValue | GenericModelPropertiesValue[];
    format?: string;
    enum?: string[];
    // autres propriétés selon vos besoins
};


export type JsonModelData = {
    definitions: {
        [key: string]: {
            type: string;
            properties: Record<string, GenericModelProperties>;
        };
    };
};
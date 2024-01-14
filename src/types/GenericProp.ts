import { GenericEntityFront } from "./GenericModel";

// TODO: Remoe the usage of this type, instead use a specific type for each admin/pages
export interface  GenericPageProps {
    [key: string]: any;
    data: GenericEntityFront[];
    modelProperties: string[];
    entityConfig: {
        entityName: string;
        displayNameProperty: string;
    };
}
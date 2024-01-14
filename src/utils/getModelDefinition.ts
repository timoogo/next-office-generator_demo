import { GenericEntityFront } from "../types/GenericModel";
import { readJsonSchema } from "../utils";

export async function getModelDefinition(fs, modelName: string): Promise<GenericEntityFront> {
    const jsonModelData = await readJsonSchema(fs);

    if (modelName in jsonModelData.definitions) {
        const modelDefinition = jsonModelData.definitions[modelName];

        // Vérification supplémentaire pour s'assurer que modelDefinition est du type attendu
        if (typeof modelDefinition === 'object' && modelDefinition !== null && 'properties' in modelDefinition) {
            const generatedModel: GenericEntityFront = {};

            // Parcours des propriétés et création du modèle
            Object.keys(modelDefinition.properties).forEach(key => {
                const property = modelDefinition.properties[key];
                generatedModel[key] = {
                    type: Array.isArray(property.type) ? property.type : [property.type],
                    // Ajoutez ici d'autres logiques si nécessaire
                };
            });

            return generatedModel;
        }

        throw new Error('Incorrect model name');
    }

    throw new Error('Model not found');
};

export async function getModelProperties(fs, modelName: string): Promise<string[]> {
    const modelDefinition = await getModelDefinition(fs, modelName);

    if (modelDefinition) {
        return Object.keys(modelDefinition);
    }
    
    throw new Error('Model definiton broken');
}

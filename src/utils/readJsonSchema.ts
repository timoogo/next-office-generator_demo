import path from "path";
import { JsonModelData } from "../types/GenericModel";

export async function readJsonSchema(fs) {
    const jsonFilePath = path.join(process.cwd(), 'prisma/generated/json/json-schema.json');
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const jsonModelData: JsonModelData = JSON.parse(jsonData);
    return jsonModelData;
}

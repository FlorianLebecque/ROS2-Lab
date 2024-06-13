export function mapToJsonObject(map: Map<string, any>) {
    const jsonObject: any = {};
    for (const [key, value] of map.entries()) {
        jsonObject[key] = value;
    }
    return jsonObject;
}

export function jsonObjectToMap(jsonObject: any) {
    const map = new Map<string, any>();
    for (const key in jsonObject) {
        map.set(key, jsonObject[key]);
    }
    return map;
}
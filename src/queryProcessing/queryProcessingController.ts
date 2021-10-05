import lodash from "lodash";
import { fetchDataFromUrlUsingAxios } from "../api-auditor/apiAuditorService";
import { ApiResponse, ApiSpecificationEntityContent, EntityData, EntityProperies, EntityPropertyData, EntityResponse, QueryParam } from "../api-auditor/apiSpecificationEntity";
import { BASE_URL } from "../commonConstants";


// use keywords like BASEURL, entity, entityvalue and deferred value
const baseUrl = /BASEURL/gi;
const entity = /ENTITY?/gi; 
export const PROPERTY = /PROPERTY/gi; 
const id = /ID/gi; 
export const NAV_PROPERTY = /NAVIGATION/gi; 

export function getQuery(queryParam: QueryParam): string{

    const newQuery = queryParam.query.replace(baseUrl, BASE_URL)
    .replace(entity, queryParam.entity)
    .replace(PROPERTY, queryParam.value)
    .replace(NAV_PROPERTY, queryParam.navigationProperty);
    return newQuery;

}

export const fetchData = async (url: string): Promise<ApiResponse[]> => {
    try {
        const response = await fetchDataFromUrlUsingAxios(url);
        return extractData(response);
    } catch (error) {
        console.log(`Could not fetch metadata for url: ${url} \n error: ${error}`);
        throw Error(error);
    }

}
export const extractData = (response: string): ApiResponse[] => {

        const entityContent = JSON.parse(JSON.stringify(response)) as ApiSpecificationEntityContent;
        const result = entityContent['d']['results'];
        if(!lodash.isArray(result)){
            const entityResponses: ApiResponse [] = [];
            entityResponses.push(result);
            return entityResponses;
        }
        return result;

}
export const extractProperties = (response: ApiResponse[], entity: string): EntityProperies => {

    const properties: string [] = [];
    const navigationProperties: string [] = [];

    response.map(res => {
        let firstObj = true;
        Object.entries(res).map(async ([key, value]) => {
            if(!firstObj){
                if (lodash.isObject(value) ) {
                    navigationProperties.push(key);
                }else{
                    properties.push(key);
                }
            }
            firstObj = false;
        })
    })

    const entityProperties: EntityProperies = {
        properties: properties,
        navigationProperties: navigationProperties
    }
 
    return entityProperties;
}

export const saveData = (response: ApiResponse[], deferredFlag: boolean) : EntityResponse[] => {

    const entityResponses: EntityResponse[] = [];
    
    response.map(  res => {
        
        const entityValues : EntityPropertyData [] = [];
        const allDeferredEntityData: EntityData[] = [];
        let firstObj = true;
        Object.entries(res).map( ([key, value]) => {
            if(!firstObj){
                if(!deferredFlag && lodash.isObject(value)){
                    const deferredResult = saveDeferredEntityData(key, value);
                    allDeferredEntityData.push(deferredResult);
                }else{
                    const entityValue: EntityPropertyData = {};
                    entityValue[key] = value;
                    entityValues.push(entityValue);
                }
            }
            firstObj = false;
        });
        entityResponses.push({
            entityProperties: entityValues,
            entityNavigationProperties: allDeferredEntityData
        });
    });
    return entityResponses;
}


export const saveDeferredEntityData =  (entityName:string, value: Object) : EntityData => {

    //deferred entities
    const deferredEntityData: EntityData = {};

    if(lodash.isEmpty(value)){
        deferredEntityData[entityName] = [];
        return deferredEntityData;
    }

    const entityResponses: ApiResponse [] = [];
    entityResponses.push(value);
    const result =  saveData(entityResponses, true);
    deferredEntityData[entityName] = result;
       
    return deferredEntityData;             
}
import lodash, { first } from "lodash";
import { DeferredEntities } from "../api-auditor/apiAuditorController";
import { fetchDataFromUrlUsingAxios } from "../api-auditor/apiAuditorService";
import { ApiResponse, ApiSpecificationEntityContent, DeferredEntity, EntityData, EntityResponse, EntityValue, QueryParam } from "../api-auditor/apiSpecificationEntity";
import { BASE_URL } from "../commonConstants";


// use keywords like BASEURL, entity, entityvalue and deferred value
const baseUrl = /BASEURL/gi;
const entity = /ENTITY?/gi; 
const value = /PROPERTY/gi; 
const navigationProperty = /NAVIGATION/gi; 

/* 
const q = BASEURL/entityName/<Entity>
const q = BASEURL/entityName/?$top=5
const q = BASEURL/entityName/?$top=5&$skip=1
const q = BASEURL/entityName('<Id>')
const q = BASEURL/entityName/<Id>
const q = BASEURL/entityName('<Id>')/<property>
const q = BASEURL/entityName('<Id>')/<navigationProperty>
const q = BASEURL/entityName('<Id>')\$expand=<navigationProperty>
const q = BASEURL/entityName('<Id>')\$select=<property>
const q = BASEURL/entityName/\$filter=<numeric-attribute A> eq <known value of A>

*/


export function getQuery(queryParam: QueryParam): string{

    const newQuery = queryParam.query.replace(baseUrl, BASE_URL)
    .replace(entity, queryParam.entity)
    .replace(value, queryParam.value)
    .replace(navigationProperty, queryParam.navigationProperty);
  
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
export const extractDeferredEntityNames = (response: ApiResponse[]): string[] => {

    const deferredEntities: string [] = [];

    response.map(res => {
        let firstObj = true;
        Object.entries(res).map(async ([key, value]) => {
            if(!firstObj){
                if (lodash.isObject(value) ) {
                    deferredEntities.push(key);
                }
            }
            firstObj = false;
        })
    })
 
    return deferredEntities;
}
/* export const saveData = async (response: ApiResponse[], deferredFlag: boolean) : Promise<EntityResponse[]> => {

    const entityResponses: EntityResponse[] = [];
    
    await Promise.all(response.map( async res => {
        
        const entityValues : EntityValue [] = [];
        const deferredEntityNames: string[] = [];
        const allDeferredEntityData: EntityData[] = [];
        let firstObj = true;
        await Promise.all(Object.entries(res).map(async ([key, value]) => {
            if(!firstObj){
                if (!lodash.isObject(value) ) {
                    const entityValue: EntityValue = {};
                    entityValue[key] = value;
                    entityValues.push(entityValue);
                }
            }
            firstObj = false;
        }));
        entityResponses.push({
            entityValues: entityValues,
            deferredEntityNames: deferredEntityNames,
            deferredEntities: allDeferredEntityData
        });
    }));
    return entityResponses;
}
export const fetchDeferredEntityData = async (entityName:string, value: Object) : Promise<EntityData> => {

    //deferred entities
    const deferredEntityContent = JSON.parse(JSON.stringify(value)) as DeferredEntities;
    const url = deferredEntityContent['__deferred']['uri'];
    const deferredEntityData: EntityData = {};
    try {
        
        const response = await fetchData(url);
        const result = await saveData(response, true);
    
        deferredEntityData[entityName] = result;
        
    } catch (error) {
        console.log(error);
    }
                      
    return deferredEntityData;             
}
 */
export const saveData1 = (response: ApiResponse[], deferredFlag: boolean) : EntityResponse[] => {

    const entityResponses: EntityResponse[] = [];
    
    response.map(  res => {
        
        const entityValues : EntityValue [] = [];
        const allDeferredEntityData: EntityData[] = [];
        let firstObj = true;
        Object.entries(res).map( ([key, value]) => {
            if(!firstObj){
                if(!deferredFlag && lodash.isObject(value)){
                    const deferredResult = saveDeferredEntityData(key, value);
                    allDeferredEntityData.push(deferredResult);
                }else{
                    const entityValue: EntityValue = {};
                    entityValue[key] = value;
                    entityValues.push(entityValue);
                }
            }
            firstObj = false;
        });
        entityResponses.push({
            entityValues: entityValues,
            deferredEntities: allDeferredEntityData
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

    // const response = extractData(value.toString());

    const entityResponses: ApiResponse [] = [];
    entityResponses.push(value);
    const result =  saveData1(entityResponses, true);
    deferredEntityData[entityName] = result;
       
    return deferredEntityData;             
}
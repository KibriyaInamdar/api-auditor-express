import lodash from "lodash";
import { DeferredEntities } from "../api-auditor/apiAuditorController";
import { fetchDataFromUrlUsingAxios } from "../api-auditor/apiAuditorService";
import { ApiResponse, ApiSpecificationEntityContent, EntityData, EntityResponse, EntityValue } from "../api-auditor/apiSpecificationEntity";
import { BASE_URL } from "../commonConstants";


// use keywords like BASEURL, entity, entityvalue and deferred value


const baseUrl = /BASEURL/gi;
const entity = /ENTITY?/gi; 
const value = /PROPERTY/gi; 
const NAVIGATION_PROPERTY = /NAVIGATION_PROPERTY/gi; 

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


export const queryProcessingController = (entityName: string, entityValue: string) => {

    // const refinedQuery = getQuery(query, entityName, '00163E038C2E1EE299C1BB0BE93B6F9B');
    const query = "BASEURL/entityName('entityValue')";
    const queryParam: QueryParam = {
        query :  query,
        entity: entityName,
        value: entityValue,
        navigationProperty: ""
    }
    const refinedQuery = getQuery(queryParam);
    console.log(`refinedQuery: ${refinedQuery}`);

}


export function getQuery(queryParam: QueryParam): string{

    const newQuery = queryParam.query.replace(baseUrl, BASE_URL)
    .replace(entity, queryParam.entity)
    .replace(value, queryParam.value)
    .replace(NAVIGATION_PROPERTY, queryParam.navigationProperty);
  
    return newQuery;
}

export type QueryParam = {
    query: string,
    entity: string,
    value: string,
    navigationProperty: string
}

export const fetchData = async (url: string): Promise<ApiResponse[]> => {

    try {
        const response = await fetchDataFromUrlUsingAxios(url);
        const entityContent = JSON.parse(JSON.stringify(response)) as ApiSpecificationEntityContent;
        const result = entityContent['d']['results'];
        if(!lodash.isArray(result)){
            const entityResponses: ApiResponse [] = [];
            entityResponses.push(result);
            return entityResponses;
        }
        return result;
        
    } catch (error) {

        console.log(`Could not fetch metadata for url: ${url} \n error: ${error}`);
        throw Error(error);
    }

}

export const saveData = async (response: ApiResponse[], deferredFlag: boolean) : Promise<EntityResponse[]> => {

    const entityResponses: EntityResponse[] = [];
    
    await Promise.all(response.map( async res => {
        
        const entityValues : EntityValue [] = [];
        const deferredEntityNames: string[] = [];
        const allDeferredEntityData: EntityData[] = [];
        let firstObj = true;
        await Promise.all(Object.entries(res).map(async ([key, value]) => {
            if(!firstObj){
                if (!lodash.isObject(value) ) {
                    entityValues.push({
                        key: value
                    });
                }else{
                    if(!lodash.includes(deferredEntityNames , key)){
                        deferredEntityNames.push(key);
                    }
                    if(!deferredFlag){
                        allDeferredEntityData.push(await fetchDeferredEntityData(key, value));
                    }
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
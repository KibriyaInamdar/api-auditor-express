//1. extract data from api specification document
//2. 

import { EntityNode, fetchDataFromUrlUsingAxios, getEntityNode, getUrl, readFileToCsn, saveEntityNodeToDb, saveEntityValueNodeToDb, saveQueryNodeToDb } from "./apiAuditorService";
import { ApiSpecification, ApiSpecificationEntityContent, EntityContent, EntityResponse,  EntityValue } from "./apiSpecificationEntity";
import lodash from "lodash";

export const apiAuditorController = async (filePath: string) => {

    // step 1: read file to csn 
     const csnFile = readFileToCsn(filePath);

    // step 2: load content
    const apiSpecification = new ApiSpecification(filePath);
    console.log('loading content');
    await apiSpecification.load(await csnFile.then());

    let first = true;

   /*  apiSpecification.namespaces.forEach(async (entry) => {
        try {
        //skip first value as it contains namespace with kind: service and we want to iterate over kind: entity
        if(!first){
            const entity = entry.split('.')[1];
            const url = getUrl('', entity, 'top=2');
            const response = await fetchDataFromUrlUsingAxios(url);
            const entityResponse = extractEntityResponse(response);

            if(entityResponse.length === 0){
                apiSpecification.invalidEntities.push(entity);
            }else{
                apiSpecification.validEntities.push(entity);
                //store query node in a db
                const queryNodeId = await saveQueryNodeToDb(url);
                entityResponse.forEach(async (res) => {
                    //save entity node
                    const entityNodeId = await saveEntityNodeToDb(queryNodeId, entity);
                    lodash.forEach(res, async (value,key) => {
                                
                        //skip if value is an object
                        if (!lodash.isObject(value)) {
                            const paramNodeId = await saveEntityTypeNodeToDb(entityNodeId, key, value);
                        }
                    })

                })
            }                           
        }
        first = false;
        } catch (error) {
        //  console.log('error has occured');
        }
    }); */
    
    const entry = apiSpecification.namespaces[1];
    const entity = entry.split('.')[1];

    const url = getUrl('', entity, '$top=1');
    console.log(url);
    const entityResponse = processEntity(url, entity, false);

    apiSpecification.invalidEntities.concat((await entityResponse.then()).invalidEntities);
    apiSpecification.validEntities.concat((await entityResponse.then()).validEntities);
    apiSpecification.entityContent = (await entityResponse.then()).entityContent;

     
}

export const extractEntityResponse = (responseData: string): EntityResponse[] => {
    const entityContent = JSON.parse(JSON.stringify(responseData)) as ApiSpecificationEntityContent;
    const result = entityContent['d']['results'];

    
    if(!lodash.isArray(result)){
        const entityResponses: EntityResponse [] = [];
        entityResponses.push(result);
        return entityResponses;
    }

    return result;
}

const processEntity = async (
    url: string, 
    entityName: string, 
    deferredFlag? : boolean, 
    parentEntityId? : string 
    ): Promise<EntityResponseObject> => {

    const entityContent: EntityContent = {};
    const validEntities: string[] = [];
    const invalidEntities: string[] = [];
    let entityResponse: EntityResponse[] = [] ;

    try {
        const response = await fetchDataFromUrlUsingAxios(url);
        entityResponse = extractEntityResponse(response);

    } catch (error) {

        // console.log(`Could not fetch metadata for url: ${url} \n error: ${error}`);
    }

    if(entityResponse.length === 0){
        invalidEntities.push(entityName);
         //store query node in a db
         const queryNodeId = await saveQueryNodeToDb(url);

         const entityNode = getEntityNode(queryNodeId, entityName, "", deferredFlag, parentEntityId);
 
         // save entity node
         const  entityNodeId = await saveEntityNodeToDb( entityNode );
    }else{
        validEntities.push(entityName);
        //store query node in a db
        const queryNodeId = await saveQueryNodeToDb(url);
        const entityNode = getEntityNode(queryNodeId, entityName, 'ed',  deferredFlag, parentEntityId);

        if(!lodash.isArray(entityResponse)){
            entityResponse = lodash.toArray(entityResponse);
        }
        await processEntityResponse(entityResponse, entityNode).then((entityValues) => {
            entityContent[entityName] = entityValues;
 
        });
    }   

    const entityResponseObject: EntityResponseObject = {
        entityName: entityName,
        entityContent :  entityContent,
        validEntities: validEntities,
        invalidEntities: invalidEntities
    }

    return entityResponseObject;

}

const processEntityResponse = async (entityResponse: EntityResponse[], entityNode: EntityNode): Promise<Record<string, unknown>[]>=> {
    
    const entityTypes : EntityValue [] = [];
    entityResponse.forEach(async (res) => {
        const entityId = lodash.toString(lodash.values(res)[1]);
  
        entityNode.value = entityId;
        // save entity node
        const  entityNodeId = await saveEntityNodeToDb( entityNode );
        let firstObj = true;

        lodash.forEach(res, async (value,key) => {
            if(!firstObj){
                //process if not an object
                if (!lodash.isObject(value) ) {
                    const entityTypeContent: EntityValue = {};
                    entityTypeContent[key] = value;
                    entityTypes.push(entityTypeContent);
                    await saveEntityValueNodeToDb(entityNodeId, key, value);
                } else {

                    if(!entityNode.deferredFlag){
                        let entityContent: EntityContent = {};
                        //deferred entities
                        const deferredEntityContent = JSON.parse(JSON.stringify(value)) as deferredEntities;
                        const url = deferredEntityContent['__deferred']['uri'];
                          
                        try {
                            const entityResponse = processEntity(url, key, true, entityNodeId);
                            entityContent = (await entityResponse).entityContent;
                        } catch (error) {
    
                            // console.log(`Could not fetch metadata for url: ${url}`);
                        }
                    }
                }
            } 
            firstObj = false;
         
        });

    });

    return entityTypes;
}


type EntityResponseObject = {
    entityName: string;
    entityContent: EntityContent ;
    validEntities: string[];
    invalidEntities: string[];
}

export type deferredEntities = {
    __deferred: {
      uri: string;
    }
  }
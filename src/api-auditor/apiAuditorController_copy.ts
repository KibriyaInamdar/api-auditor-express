import lodash from "lodash";
import { extractEntityResponse } from "./apiAuditorController";
import { EntityNode, fetchDataFromUrlUsingAxios, getEntityNode, getUrl, readFileToCsn, saveEntityNodeToDb, saveEntityValueNodeToDb, saveQueryNodeToDb } from "./apiAuditorService";
import { ApiSpecification, ApiResponse } from "./apiSpecificationEntity";


export const apiAuditorController_copy = async (filePath: string) => {

    // step 1: read file to csn 
    const csnFile = readFileToCsn(filePath);

    // step 2: load content
    const apiSpecification = new ApiSpecification(filePath);
    console.log('loading content');
    await apiSpecification.load(await csnFile.then());

    let first = true;

   /*  console.log(apiSpecification.namespaces.length);
    apiSpecification.namespaces.forEach(async (entry) => {
        try {
        //skip first value as it contains namespace with kind: service and we want to iterate over kind: entity
        if(!first){
            // const entry = apiSpecification.namespaces[1];
            const entityName = entry.split('.')[1];
        
            const url = getUrl('', entityName, '$top=1');
            console.log(url);
            await processEntity(url, entityName);
        }
        first = false;
        } catch (error) {
        //  console.log('error has occured');
        }
    }); */

    const entry = apiSpecification.entities[1];
    const entityName = entry.split('.')[1];

    // const entityName = 'ContactInternationalVersionCollection';
    const url = getUrl('', entityName, '$top=1');
    console.log(url);
    await processEntity(url, entityName);

    
}

const processEntity = async (
    url: string, 
    entityName: string, 
    deferredFlag? : boolean, 
    parentEntityId? : string ) => {

    const validEntities: string[] = [];
    const invalidEntities: string[] = [];
    let entityResponse: ApiResponse[] = [] ;

    try {
        const response = await fetchDataFromUrlUsingAxios(url);
        entityResponse = extractEntityResponse(response);

    } catch (error) {
          // console.log(`Could not fetch metadata for url: ${url}`);
    }
   

    if(entityResponse.length === 0){
        invalidEntities.push(entityName);
        console.log(`invalidEntities: ${entityName}`);

        //store query node in a db
        const queryNodeId = await saveQueryNodeToDb(url);

        const entityNode = getEntityNode(queryNodeId, entityName, "", deferredFlag, parentEntityId);

        // save entity node
        const  entityNodeId = await saveEntityNodeToDb( entityNode );
      
    }else{
        validEntities.push(entityName);
 
        //store query node in a db
        const queryNodeId = await saveQueryNodeToDb(url);
        
        entityResponse.forEach(async (res) => {
            
            const entityId = lodash.toString(lodash.values(res)[1]);
            const entityNode = getEntityNode(queryNodeId, entityName, entityId, deferredFlag, parentEntityId);

            // save entity node
            const  entityNodeId = await saveEntityNodeToDb( entityNode );

            let firstObj = true;
            lodash.forEach(res, async (value,key) => {
                if(!firstObj){
                    //process if not an object
                    if (!lodash.isObject(value) ) {
                            await saveEntityValueNodeToDb(entityNodeId, key, value);
                    } else {
                        //deferred entities
                        const deferredEntityContent = JSON.parse(JSON.stringify(value)) as deferredEntities;
                        const url = deferredEntityContent['__deferred']['uri'];

                        // const entityResponse = processEntity(url, key, true, entityNodeId);
                    }
                } 
                firstObj = false; 
            });
        });     
    }
}

type EntityResponseObject = {
    entityName: string;
    validEntities: string[];
    invalidEntities: string[];
}

export type deferredEntities = {
    __deferred: {
      uri: string;
    }
  }
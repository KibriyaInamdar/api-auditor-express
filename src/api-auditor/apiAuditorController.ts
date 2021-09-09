//1. extract data from api specification document
//2. 

import { fetchDataFromUsingAxios as fetchDataFromUrlUsingAxios, getUrl, readFileToCsn, saveEntityNodeToDb, saveEntityTypeNodeToDb, saveQueryNodeToDb } from "./apiAuditorService";
import { ApiSpecification, ApiSpecificationEntityContent, EntityContent } from "./apiSpecificationEntity";
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
    const url = getUrl('', entity, '$top=2');
    const response = await fetchDataFromUrlUsingAxios(url);
    const entityResponse = extractEntityResponse(response);

    console.log(`entityres count: ${entityResponse.length}`);

    if(entityResponse.length === 0){
        apiSpecification.invalidEntities.push(entity);
    }else{
        apiSpecification.validEntities.push(entity);
        //store query node in a db
        const queryNodeId = await saveQueryNodeToDb(url);

        entityResponse.forEach(async (res) => {

            let count = 0;
            //save entity node
            const entityNodeId = await saveEntityNodeToDb(queryNodeId, entity);

            lodash.forEach(res, async (value,key) => {
                //skip if value is an object
                if (!lodash.isObject(value)) {
                    count++;
                    const paramNodeId = await saveEntityTypeNodeToDb(entityNodeId, key, value);
                }
            })
            console.log(`res count: ${count}`);

        })
    }   

     
}

const extractEntityResponse = (responseData: string): EntityContent[] => {
    const entityContent = JSON.parse(JSON.stringify(responseData)) as ApiSpecificationEntityContent;
    const result = entityContent['d']['results'];

    return result;
  }

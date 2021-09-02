//1. extract data from api specification document
//2. 

import cds from "@sap/cds";
import { addRelationshipBetweenTwoNodes, createNodeInDb, createParameterNodeInDb } from "../db/neo4jService";
import { fetchData, fetchDataFromUsingAxios as fetchDataFromUrlUsingAxios, getUrl, readFile, readFileToCsn, readFileToJson } from "./apiAuditorService";
import { ApiSpecification, ApiSpecificationEntityContent, EntityContent } from "./apiSpecificationEntity";
import fs from "fs";
import { ENTITY_NODE, ENTITY_PARAMETER_RELATIONSHIP, PARAMETER_NODE, QUERY_ENTITY_RELATIONSHIP, QUERY_NODE } from "../commonConstants";
import lodash from "lodash";

export const apiAuditorController = async (filePath: string) => {

    // step 1: read file to csn 
     const csnFile = readFileToCsn(filePath);

    // step 2: load content
    const apiSpecification = new ApiSpecification(filePath);
    console.log('loading content');
    await apiSpecification.load(await csnFile.then());
    

    let first = true;
    apiSpecification.namespaces.forEach(async (entry) => {

     try {
        //skip first value as it contains only namespace as kind: service
        if(!first){
            const entity = entry.split('.')[1];
            // fetch data for given entity and store it in a database
            const url = getUrl('', entity, '$top=2');
            const response = await fetchDataFromUrlUsingAxios(url);

            //store query in a db
            const queryNodeId = await createNodeInDb(QUERY_NODE,  url);

            const entityResponse = extractEntityResponse(response);
            lodash.forEach(entityResponse, async (entry1) => {

            //save entity node
            const entityNodeId = await createNodeInDb(ENTITY_NODE, entity);
    
            await addRelationshipBetweenTwoNodes(QUERY_NODE, queryNodeId, ENTITY_NODE, entityNodeId, QUERY_ENTITY_RELATIONSHIP);
    
            await Promise.all([  lodash.forEach(entry1, async (value, key) => {
    
                //save parameters
                //value should not be empty and discuss if its an object
                if (!lodash.isEmpty(value) && !lodash.isObject(value)) {
                    const paramNodeId = await createParameterNodeInDb(PARAMETER_NODE, key, value);
                    await addRelationshipBetweenTwoNodes(ENTITY_NODE, entityNodeId, PARAMETER_NODE, paramNodeId, ENTITY_PARAMETER_RELATIONSHIP);
                }
            })]);
    
            });
 
        }
        first = false;
     } catch (error) {
        //  console.log('error has occured');
        
     }

    });

    /* //step 3: fetch data
    // console.log(`namespace:  ${apiSpecification.namespaces[0]}`);
    const entity = apiSpecification.namespaces[1].split('.')[1];
    // console.log(`entity: ${entity}`);

    //step 4: save entity to database
    

    // step 5: fetch data for given entity and store it in a database
    const url = getUrl('', entity, '$top=2');
    const response = await fetchDataFromUrlUsingAxios(url);

    //store query in a db
    const queryNodeId = await createNodeInDb(QUERY_NODE,  url);


    const entityResponse = extractEntityResponse(response);

    lodash.forEach(entityResponse, async (entry1) => {

    // })
    
    // entityResponse.forEach(async entry => {
        // Object.entries(entry).forEach(async ([key, value]) => {
        //     if(!first && !lodash.isEmpty(value) && !lodash.isObject(value)){
        //         console.log(key, value);
        //     }
         
        // });

       
        //save entity node
        const entityNodeId = await createNodeInDb(ENTITY_NODE, entity);

        await addRelationshipBetweenTwoNodes(QUERY_NODE, queryNodeId, ENTITY_NODE, entityNodeId, QUERY_ENTITY_RELATIONSHIP);

        await Promise.all([  lodash.forEach(entry1, async (value, key) => {

            //value should not be empty and discuss if its an object
            if (!lodash.isEmpty(value) && !lodash.isObject(value)) {
                const paramNodeId = await createParameterNodeInDb(PARAMETER_NODE, key, value);
                await addRelationshipBetweenTwoNodes(ENTITY_NODE, entityNodeId, PARAMETER_NODE, paramNodeId, ENTITY_PARAMETER_RELATIONSHIP);
            }
        })]);

        });

    // console.log(`responseDta: ${responseData[0]}`); */
}

const extractEntityResponse = (responseData: string): EntityContent[] => {
    const entityContent = JSON.parse(JSON.stringify(responseData)) as ApiSpecificationEntityContent;
    const result = entityContent['d']['results'];

    return result;
  }

type dbNode = {
    label: string,
    name: string,
}
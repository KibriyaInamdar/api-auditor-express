//1. extract data from api specification document
//2. 

import cds from "@sap/cds";
import { fetchData, readFile, readFileToCsn, readFileToJson } from "./apiAuditorService";
import { ApiSpecification } from "./apiSpecificationEntity";


export const apiAuditorController = async (filePath: string) => {

    // step 1: read file to csn 
     const csnFile = readFileToCsn(filePath);

    // step 2: load content
    const apiSpecification = new ApiSpecification(filePath);
    console.log('loading content');
    await apiSpecification.load(await csnFile.then());

  
    //step 3: fetch data
    console.log(apiSpecification.namespaces[1]);
    const entity = apiSpecification.namespaces[1].split('.')[1];
    console.log(`entity: ${entity}`);
    const response = await fetchData('', entity, 'top=1');
    console.log(`response: ${JSON.stringify(response)}`);

    
}
//1. extract data from api specification document
//2. 

import cds from "@sap/cds";
import { readFileToCsn } from "./apiAuditorService";


export const apiAuditorController = (filePath: string) => {

  
    // step 1: read file to csn 
     const csnFile = readFileToCsn(filePath);

    //step 2: compile csnfile and load into json object
    // const jsonObj = cds.compile(csnFile).to.json();
}
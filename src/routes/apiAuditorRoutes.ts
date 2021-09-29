import { readFileToCsn } from "../api-auditor/apiAuditorService";
import { ApiSpecification, EntityData, EntityResponse, QueryParam } from "../api-auditor/apiSpecificationEntity";
import { fetchData, extractDeferredEntityNames, getQuery, saveData1 } from "../queryProcessing/queryProcessingController";
import { BasicQueries, EXPAND_NAVIGATION_QUERY, MinimumConformanceLevels, Minimum_METADATA_QUERY } from "./apiAuditorQueries";


export async function apiAuditor( filePathToModel: string){
    // step 1: read file to csn 
    const csnFile = await readFileToCsn(filePathToModel);
    await Promise.all([csnFile]);

    // step 2: load namespace and entities from csnFile
    const apiSpecification = new ApiSpecification(filePathToModel);
    console.log('loading content');
    await apiSpecification.load(csnFile);

    // step 3: prepareData
    // queryProcessing(apiSpecification);

    const api = queryProcessing(apiSpecification.entities);

    await Promise.all([api]);

    console.log(api);
    apiSpecification.entityData = await api;
    (await api).map(entry => {
        Object.entries(entry).map(([key, value]) => {
            console.log(key);
            const entityName = key;

            value.map(v => {
                // const entityValues = v.entityValues;
                // console.log(entityValues);
                // const deferredEntities = v.deferredEntityNames;
                // console.log(deferredEntities);

                const deferredEntities = v.deferredEntities;
                console.log(deferredEntities);
            });
       
        });
    });   
}


async function queryProcessing(entities: string[]): Promise<EntityData[]>{

    
    let first = true;

    const entityData: EntityData [] = [];

    entities = ['ContactCollection', 'BusinessUserCollection'];
    // entities = ['ContactCollection'];
    await Promise.all(entities.map(async (entity) => {
        // if(!first){

            //step 1: prepare Data
            const data = await prepareMetadata(entity);
            await Promise.all([data]);
            entityData.push(data);

            //step 2: checkMinimumConformanceLevel

            // checkMinimumConformanceLevel(entity);
            //checkIntermediateConformanceLevel();
            //checkAdvancedConformanceLevel();
        // }
        first = false;
    }));
    
    return entityData;
}
async function prepareMetadata(entity: string){

    const deferredEntityNames = await getDeferredEntityNames(entity);

    const queryParam: QueryParam = {
        query :  EXPAND_NAVIGATION_QUERY,
        entity: entity,
        value: "",
        navigationProperty: deferredEntityNames.toString()
    }

    const url = getQuery(queryParam);
    console.log(url);
    const response = await fetchData(url);

    const result = await saveData1(await response, false);
    const entityData: EntityData = {};
    entityData[entity] = result;

    return entityData;
}
async function getDeferredEntityNames(entity: string): Promise<string[]>{

    const query = Minimum_METADATA_QUERY;
    const queryParam: QueryParam = {
        query :  query,
        entity: entity,
        value: "",
        navigationProperty: ""
    }
    const url = getQuery(queryParam);
 
    const response = await fetchData(url);

    await  Promise.all(response);
    const deferredEntityNames = extractDeferredEntityNames(await response);
    return deferredEntityNames;

}
export async function prepareData(entity: string): Promise<EntityData>{
    /** for each entity, execute  http://host/service.svc/Entity?$top=5
            query1: baseurl/EntitySet?$top=5
    */
    
    const entityData: EntityData = {};
    const queries = Object.values(BasicQueries);

    await Promise.all(queries.map( async query => {
        const queryParam: QueryParam = {
            query :  query,
            entity: entity,
            value: "",
            navigationProperty: ""
        }
        const url = getQuery(queryParam);
        const response = await fetchData(url)
        
        // await saveData(response, false)
        // .then(result => {
        //     entityData[entity] = result;
        // });
      
    }));
    return entityData;
}


export async function checkMinimumConformanceLevel(entity:string, entityResponse: EntityResponse[]): Promise<EntityData>{
    /** for each entity, execute  http://host/service.svc/Entity?$top=5
            query1: baseurl/EntitySet?$top=5
    */
    //OData 4.0 Minimal Conformance Level
    /**
         1. check for navigationProperties $expand
         2. $metadata
    */

    console.log('checkMinimumConformanceLevel');
    
    const entityData: EntityData = {};
    const queries = Object.values(MinimumConformanceLevels);

    await Promise.all(queries.map( async query => {
        const queryParam: QueryParam = {
            query :  query,
            entity: entity,
            value: "",
            navigationProperty: ""
        }
        const url = getQuery(queryParam);
        const response = await fetchData(url)
        
        // switch(top, skip, select, value, filter )
     
      
    }));
    return entityData;

}






/**
 * expect 2nd and 3rd instance of previous query
  http://host/service.svc/EntitySet?$top=2&$skip=1
  query2: baseurl/EntitySet?$top=2&$skip=1
 */

/* function checkIntermediateConformanceLevel(){

    1. $select
    2. $top
    3. /$value
    4. $filter
        4.1 eq, ne
        4.2 aliases in $filter expressions 
        4.3 comparison operator, logical op, arithmatic op, grouping op, 501 if not implemented
        4.4 Build-in query functions, 501 if not implemented
        4.5 filter on expanded entities
    5. $search
    6. $skip
    7. $count
    8. lambda operators any and all on navigation- and collection-valued properties 
    9. /$count segment on navigation and collection properties
    10. $orderby asc and desc on individual properties
} */

/*
function checkAdvancedCOnformanceLevel(){

    1. $expand 
        1.1 support returning references for expanded properties
        1.2 $filter on expanded collection-valued properties
        1.3 cast segment in expand with derived types
        1.4 $orderby asc and desc on expanded collection-valued properties
        1.5 $count on expanded collection-valued properties
        1.6 $top and $skip on expanded collection-valued properties
        1.7 $search on expanded collection-valued properties
        1.8 $levels for recursive expand (section 11.2.5.2.1.1)
        1.9 $compute on expanded properties
    2. SHOULD support asynchronous requests
    3. Delta change tracking
    4. cross-join queries defined in [OData‑URL]
    5. $compute system query option 
}
*/
import lodash, { result } from "lodash";
import { readFileToCsn } from "../api-auditor/apiAuditorService";
import { ApiSpecification, EntityData } from "../api-auditor/apiSpecificationEntity";
import { fetchData, getQuery, QueryParam, saveData } from "../queryProcessing/queryProcessingController";
import { BasicQueries } from "./apiAuditorQueries";


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


    // step 3: for each entity, perform query processing
    const api = queryProcessing(apiSpecification.entities);

    await Promise.all([api]);
    
    // console.log(api);
    // lodash.forEach(api, async (value,key) => {
    //     console.log(key);
    //     console.log(value);
    // })

    (await api).map(entry => {
        console.log(entry);
       
    })


   console.log(await api);
}


async function queryProcessing(entities: string[]): Promise<EntityData[]>{

    let first = true;

    const entityData: EntityData [] = [];

    // entities.forEach(async (entity) => {
        const entity = 'ContactCollection';
        // if(!first){

            const data = await prepareData(entity);

            await Promise.all([data]);
            entityData.push(data);
          
            // checkMinimumConformanceLevel(entity);
            //checkIntermediateConformanceLevel();
            //checkAdvancedConformanceLevel();
        // }
    //    first = false;


    // });
    return entityData;
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
        
        await saveData(response, false)
        .then(result => {
            entityData[entity] = result;
        });
      
    }));
    return entityData;
}


export async function checkMinimumConformanceLevel(): Promise<EntityData>{
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
  /*   const entityData: EntityData = {};
    const queries = Object.values(MinimumConformanceLevels);
    const entityContent: EntityContent = {};
    let first = true;

    await Promise.all(queries.map( async query => {
        if(first){
            first = false;
            // const url = getUrl('', entity, '$top=1');
 
            const queryParam: QueryParam = {
                query :  query,
                entity: entity,
                value: "",
                navigationProperty: ""
            }
            const url = getQuery(queryParam);
            const response = await fetchData(url)
           
            const entityResponse = saveData( response);
            entityData[entity] = response;
         

        };
    })); */
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
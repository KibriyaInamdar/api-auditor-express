import { readFileToCsn } from "../api-auditor/apiAuditorService";
import { ApiResponse, ApiSpecification, EntityData, EntityProperies, EntityResponse, QueryParam } from "../api-auditor/apiSpecificationEntity";
import { fetchData, extractProperties, getQuery, saveData, PROPERTY, NAV_PROPERTY } from "../queryProcessing/queryProcessingController";
import { EXPAND_NAVIGATION_QUERY, METADATA_QUERY, SELECT_QUERY } from "./apiAuditorQueries";

let apiSpecification : ApiSpecification ;

export async function apiAuditor( filePathToModel: string){
    // step 1: read file to csn 
    const csnFile = await readFileToCsn(filePathToModel);
    await Promise.all([csnFile]);

    // step 2: load namespace and entities from csnFile
    apiSpecification = new ApiSpecification(filePathToModel);
    console.log('loading content');
    await apiSpecification.load(csnFile);

    // step 3: loadMetadata
    const metadata = await loadMetadata(apiSpecification.entities);
    apiSpecification.setMetadata(metadata);

 

   

    //evaluate $schemaversion : specify the current version of the metadata.
}


async function loadMetadata(entities: string[]): Promise<EntityData[]>{
    
    let first = true;
    const entityData: EntityData []= [];
    entities = ['ContactCollection', 'BusinessUserCollection'];
    // entities = ['ContactCollection'];
    await Promise.all(entities.map(async (entity) => {
        // if(!first){

            //step 1: get Navigation properties
            const entityProperties = await getEntityProperties(entity);
            //step 2: fetch metadata 
            const data = await prepareMetadata(entity, entityProperties.navigationProperties.toString());
            entityData.push(data);
        // }
        first = false;
    }));
    
    return entityData;
}

async function getEntityProperties(entity: string): Promise<EntityProperies>{
    const queryParam: QueryParam = {
        query :  METADATA_QUERY,
        entity: entity,
        value: "",
        navigationProperty: ""
    }
    const response = await fetchData(getQuery(queryParam));

    await  Promise.all(response);
    const entityProperties = extractProperties(await response, entity);
    return entityProperties;

}

async function prepareMetadata(entity: string, navigationProperties: string): Promise<Record<string, EntityResponse[]>>{

    const queryParam: QueryParam = {
        query :  EXPAND_NAVIGATION_QUERY,
        entity: entity,
        value: "",
        navigationProperty: navigationProperties
    }
    const response = await fetchData(getQuery(queryParam));

    const result = await saveData(await response, false);
    const entityData: EntityData = {};
    entityData[entity] = result;

    return entityData;
}

function checkMinimumConformanceLevel(entityResponse: EntityResponse[], entityProperties: EntityProperies){

    console.log('checkMinimumConformanceLevel');
    
    const queryTemplates = getAllQueryTemplates();
    
    queryTemplates.map(  qTemplate => {

         getQueriesFromQueryTemplate(qTemplate, entityProperties);
     
    });
    // return entityData;

}


export async function getQueriesFromQueryTemplate(qTemplate: string, entityProperties: EntityProperies){
    const propertyFlag = PROPERTY.test(qTemplate);
    const NavPropertyFlag = NAV_PROPERTY.test(qTemplate);

    // console.log(` propertyFlag : ${propertyFlag}`);
    // console.log(` NavPropertyFlag : ${NavPropertyFlag}`);


    if(propertyFlag && NavPropertyFlag){
        console.log (`propertyFlag && NavPropertyFlag`);
    }else if(propertyFlag){
        console.log(`propertyFlag`);
        await getQueryFromQueryTemplateForProperty(qTemplate, '', entityProperties.properties);
       
    }else if(NavPropertyFlag){
        console.log(`NavPropertyFlag`);
    }else{
        console.log(`nothing`);
    }


}

async function getQueryFromQueryTemplateForProperty(qTemplate: string, entity: string, listOfProperty: string[]){

    await Promise.all(listOfProperty.map( async p => {
        const queryParam: QueryParam = {
            query :  qTemplate,
            entity: entity,
            value: p,
            navigationProperty: ""
        }
        const query = getQuery(queryParam);
        console.log(query);
   
        // try {
        //     const response = 
        // } catch (error) {
        //     console.log(error);
        // }
        await fetchData(query)
        .then(response => {
            console.log('successful');
        }).catch(error =>{
            console.log(error);
        });
        
    }));
    

}
 async function fetchDataForQuery(query:string): Promise<ApiResponse[]> {
    console.log(query);
    const response = await fetchData(query);

    return response;
 }


export function getAllQueryTemplates():string[]{

    // const queries: string[] = [];

    const queries = Object.values(SELECT_QUERY).filter(value => typeof value === 'string') as string[];

    console.log(queries);
    return queries;
}

       //step 2: checkMinimumConformanceLevel

            // checkMinimumConformanceLevel(entity);
            //checkIntermediateConformanceLevel();
            //checkAdvancedConformanceLevel();



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
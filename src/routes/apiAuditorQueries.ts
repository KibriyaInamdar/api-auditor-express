export const METADATA_QUERY = "BASEURL/ENTITY?$metadata&$top=1";
export const EXPAND_NAVIGATION_QUERY = "BASEURL/ENTITY?&$top=5&$expand=NAVIGATION";

/* query-template : query-head :- query-template-body 

query-template-head : query-template-id(free-variables, answer-matchers, warn-matchers, answer-schema?) // optional schema
answer-schema : object structure or columns (schema) ?
answer-matchers : a composition of conditions (cf. unit test matchers in jest of java hamcrest) ?
warn-matchers : same format as answer-matchers

query-template-body : ${base-url}/${entity} | ? ...

q(entity-name) :- metadata(entity-name, api-name)
  
*/
/**
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
 */
export enum SELECT_QUERY{
    "select_individual_property()" = "BASEURL/ENTITY?$top=5&$select=PROPERTY",
    // "BASEURL/ENTITY/$top=5&$select=*",
    // "BASEURL/ENTITY/$top=5&$select=NAVIGATION&expand=NAVIGATION",
    // "BASEURL/ENTITY/$top=5&$expand=NAVIGATION($select=PROPERTY)",

    // "BASEURL/ENTITY('ID')?&$select=PROPERTY",
    // "BASEURL/ENTITY('ID')&$select=*",
    // "BASEURL/ENTITY('ID')$top=5&$expand=NAVIGATION($select=PROPERTY)",
    // "BASEURL/ENTITY('ID')$top=5&$select=NAVIGATION&expand=NAVIGATION",
}
export enum MinimumConformanceLevels{
    TOP_QUERY = "BASEURL/ENTITY?&$top=5",
    TOP_SKIP_QUERY = "BASEURL/ENTITY?&$top=2&skip=3",
   
    // ENTITY_PROPERTY_VALUE_BY_ID_QUERY = "BASEURL/ENTITY/PROPERTY/$value",
}
export enum IntermediateConformanceLevels{
    ENTITY_BY_ID_QUERY = "BASEURL/ENTITY('ID')",
    ENTITY_PROPERTY_BY_ID_QUERY = "BASEURL/ENTITY('ID')/PROPERTY",
    ENTITY_PROPERTY_VALUE_BY_ID_QUERY = "BASEURL/ENTITY('ID')/PROPERTY/$value",
   

}
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
export enum BasicQueries{
    // BASIC_QUERY = "BASEURL/entity?$top=5",
    METADATA_QUERY = "BASEURL/ENTITY?$metadata&$top=5",
}
export enum MetadataQuery{
    METADATA_QUERY = "BASEURL/ENTITY?$metadata&$top=1",
}
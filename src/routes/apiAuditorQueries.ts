export const Minimum_METADATA_QUERY = "BASEURL/ENTITY?$metadata&$top=1";
export const EXPAND_NAVIGATION_QUERY = "BASEURL/ENTITY?&$top=5&$expand=NAVIGATION";

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

export enum MinimumConformanceLevels{
    TOP_QUERY = "BASEURL/ENTITY?$metadata&$top=5",
    TOP_SKIP_QUERY = "BASEURL/ENTITY?&$top=2&skip=3",
    SELECT_QUERY = "BASEURL/ENTITY/$top=5&$select=PROPERTY",
    SELECT_ALL_QUERY = "BASEURL/ENTITY/$top=5&$select=*",
    SELECT_EXPAND_NAVIGATION_PROPERTY_QUERY = "BASEURL/ENTITY/$top=5&$select=NAVIGATION($select=PROPERTY)",
    SELECT_EXPAND_NAVIGATION_VALUE_QUERY = "BASEURL/ENTITY/$top=5&$select=NAVIGATION&expand=NAVIGATION",
    // ENTITY_PROPERTY_VALUE_BY_ID_QUERY = "BASEURL/ENTITY/PROPERTY/$value",
}
export enum IntermediateConformanceLevels{
    ENTITY_BY_ID_QUERY = "BASEURL/ENTITY('ID')",
    ENTITY_PROPERTY_BY_ID_QUERY = "BASEURL/ENTITY('ID')/PROPERTY",
    ENTITY_PROPERTY_VALUE_BY_ID_QUERY = "BASEURL/ENTITY('ID')/PROPERTY/$value",
    SELECT_QUERY = "BASEURL/ENTITY('ID')?&$select=PROPERTY",
    SELECT_ALL_QUERY = "BASEURL/ENTITY('ID')&$select=*",
    SELECT_EXPAND_NAVIGATION_PROPERTY_QUERY = "BASEURL/ENTITY/$top=5&$select=NAVIGATION($select=PROPERTY)",
    SELECT_EXPAND_NAVIGATION_VALUE_QUERY = "BASEURL/ENTITY/$top=5&$select=NAVIGATION&expand=NAVIGATION",

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
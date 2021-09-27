const BASIC_QUERY = "BASEURL/entity?$top=5";
const Minimum_EXPAND_NAVIGATION_QUERY = "BASEURL/ENTITY?$top=5&$expand=NAVIGATION_PROPERTY";

export const Minimum_METADATA_QUERY = "BASEURL/ENTITY?$metadata&$top=1";
export const EXPAND_NAVIGATION_QUERY = "BASEURL/ENTITY?&$top=5&$expand=NAVIGATION";

export const METADATA = 'metadata';

const NAVIGATION_PROPERTY = "NAVIGATION_PROPERTY";

export enum MinimumConformanceLevels{
    METADATA_QUERY = "BASEURL/ENTITY?$metadata&$top=1",
    EXPAND_NAVIGATION_QUERY = "BASEURL/ENTITY?&$top=5&$expand=NAVIGATION",
}

export enum BasicQueries{
    // BASIC_QUERY = "BASEURL/entity?$top=5",
    METADATA_QUERY = "BASEURL/ENTITY?$metadata&$top=5",
}
export enum MetadataQuery{
    METADATA_QUERY = "BASEURL/ENTITY?$metadata&$top=1",
}

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
export enum IntermediateConformanceLevels{
    SELECT_QUERY = "BASEURL/ENTITY?$top=5&$select=VALUE",
    METADATA_QUERY = "BASEURL/ENTITY?$metadata",
    EXPAND_NAVIGATION_QUERY = "BASEURL/ENTITY?$top=5&$expand=NAVIGATION_PROPERTY",
}
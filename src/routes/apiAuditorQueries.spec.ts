
import { QueryParam } from "../api-auditor/apiSpecificationEntity";
import { fetchData, getQuery, NAV_PROPERTY, PROPERTY } from "../queryProcessing/queryProcessingController";
import { apiAuditor, getQueriesFromQueryTemplate, getAllQueryTemplates } from "./apiAuditorRoutes";
describe('API Auditor Query', () => {

    test("return correct query", async () => {

        const expectedResult = "https://sandbox.api.sap.com/sap/c4c/odata/v1/c4codataapi/ContactCollection?&$top=5&$expand=ContactAttachmentFolder,ContactInternationalVersion,ContactIsContactPersonFor,ContactOwnerEmployeeBasicData,ContactPersonalAddress,ContactTextCollection,CorporateAccount";
        // const nav = "ContactAttachmentFolder";
        const nav = 'ContactAttachmentFolder,ContactInternationalVersion,ContactIsContactPersonFor,ContactOwnerEmployeeBasicData,ContactPersonalAddress,ContactTextCollection,CorporateAccount';
        const queryParam: QueryParam = {
            query :  "BASEURL/ENTITY?&$top=5&$expand=NAVIGATION",
            entity: "ContactCollection",
            value: "",
            navigationProperty: nav
        }
       const queryResult = getQuery(queryParam);
       expect(queryResult).toBe(expectedResult);
    });    

    test("Fetches successfully data from an API", async () => {

        const filepath = "./src/data/customer.edmx" ;
        await apiAuditor(filepath);

        // getAllQueryTemplates();
    
        // await apiAuditor(filepath);
    });       
    
    // test("Fetches successfully data from an API", async () => {

 

    //     const query = 'BASEURL/ENTITY/$top=5&$select=PROPERTY' ;
    //     getQueriesFromQueryTemplate(query);
    //     // const propertyFlag = PROPERTY.test(query);
    //     // const NavPropertyFlag = NAV_PROPERTY.test(query);

    //     // console.log(propertyFlag, NavPropertyFlag);
    //     // getAllQueryTemplates();
    
    //     // await apiAuditor(filepath);
    // });   



    /* test("fetch data from url", async () => {

        // const EXPAND_NAVIGATION_QUERY = "BASEURL/ENTITY?$metadata&$top=5&$expand=NAVIGATION_PROPERTY";
        // const url = "https://sandbox.api.sap.com/sap/c4c/odata/v1/c4codataapi/ContactCollection?$top=5&$select=BusinessAddressCountryCodeText";
        const url = "https://sandbox.api.sap.com/sap/c4c/odata/v1/c4codataapi?$schemaversion";

        try {
            const result = fetchData(url);
 
        await Promise.all([result]);

        (await result).map(entry => {
            Object.entries(entry).map(([key, value]) => {
                console.log(key);
                console.log(value);
        
                // const entityName = key;
    
                // value.map(v => {
                //     const entityValues = v.entityValues;
                //     console.log(entityValues);
                //     const deferredEntities = v.deferredEntityNames;
                //     console.log(deferredEntities);
                // });
           
            });
        });
        } catch (error) {
            console.log(error);
        }
        
    }); */   
    

});
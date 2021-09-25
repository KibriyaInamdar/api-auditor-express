import { values } from "lodash";
import { getQuery, QueryParam } from "../queryProcessing/queryProcessingController";
import { apiAuditor, checkMinimumConformanceLevel, prepareData } from "./apiAuditorRoutes";
describe('API Auditor Query', () => {

    test("Fetches successfully data from an API", async () => {

        const filepath = "./src/data/customer.edmx" ;
        await apiAuditor(filepath);
    
        // await apiAuditor(filepath);
    });   


  

/*       test("Fetches successfully data from an API", async () => {

        const filepath = "./src/data/customer.edmx" ;
        const entityData = prepareData('ContactCollection');
        await Promise.all([entityData]);

        console.log(entityData);
        // await apiAuditor(filepath);
    });  */   
    
    // test("return correct query", async () => {

    //     const expectedResult = "https://sandbox.api.sap.com/sap/c4c/odata/v1/c4codataapi/ContactCollection?$top=5";
    //     const queryParam: QueryParam = {
    //         query :  "BASEURL/ENTITY?$top=5",
    //         entity: "ContactCollection",
    //         value: "",
    //         navigationProperty: ""
    //     }
    //    const queryResult = getQuery(queryParam);

    //    expect(queryResult).toBe(expectedResult);
    // });    
});
import { apiAuditorController } from "./apiAuditorController";

describe('API Auditor Controller', () => {

    test("Fetches successfully data from an API", async () => {

        const filepath = "./src/data/customer.edmx" ;
        await apiAuditorController(filepath);
    });

});
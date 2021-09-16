import { entity } from "@sap/cds";
import  fs  from "fs";
import lodash from "lodash";
import path from "path";
import { extractEntityResponse } from "./apiAuditorController";
import { fetchDataFromUrlUsingAxios } from "./apiAuditorService";


export async function apiAuditortest() {

    const data1 = [
        'id;name;key;value;movie;',
        '2.400000000000000E+009;1.548880785703659E-001;1.067966520786285E-001;1.141964457929134E-003;5.855074618011713E-003;',
        '2.400166666666667E+009;1.546109169721603E-001;1.043454632163048E-001;1.287244027480483E-003;5.807569250464439E-003;',
        '2.400333333333334E+009;1.546102017164230E-001;1.018797382712364E-001;1.497663557529450E-003;5.986513104289770E-003;',
        '2.400500000000000E+009;1.545133888721466E-001;9.928287565708160E-002;1.647840370424092E-003;5.912321619689465E-003;',
        '2.400666666666667E+009;1.544111520051956E-001;9.671460092067719E-002;1.589289400726557E-003;5.917594302445650E-003;'
    ];

    const data = [
        'id;name;key;value;movie;',
        '1kihy;ContactCollection;1.067966520786285E-001;1.141964457929134E-003;5.855074618011713E-003;',
        '2okij;ContactCollection;1.043454632163048E-001;1.287244027480483E-003;5.807569250464439E-003;',
        '3olkj;ContactCollection;1.018797382712364E-001;1.497663557529450E-003;5.986513104289770E-003;',
        '4plmn;ContactCollection;9.928287565708160E-002;1.647840370424092E-003;5.912321619689465E-003;',
        '5uhvb;ContactCollection;9.671460092067719E-002;1.589289400726557E-003;5.917594302445650E-003;'
    ];

    const csv = data.map((e) => {
        return e.replace(/;/g, ",");
    });


    const filepath = path.join(__dirname, 'data.csv');
    await fs.writeFile(filepath, csv.join("\r\n"), (err) => {
        console.log(err || "done");
    });
}


export async function testArray(){
    
    // let entityResponse = JSON.parse(JSON.stringify(rawdata)) as ApiSpecificationEntityContent1;
    // const result = entityResponse["d"];

    // console.log(entityResponse);['results']

    const url = 'https://sandbox.api.sap.com/sap/c4c/odata/v1/c4codataapi/ContactCollection(%2700163E038C2E1EE299C1BB0BE93B6F9B%27)/CorporateAccount';
    // const url = 'https://sandbox.api.sap.com/sap/c4c/odata/v1/c4codataapi/ContactCollection?$top=1';

    const response = await fetchDataFromUrlUsingAxios(url);

    const entityResponse = extractEntityResponse(response);
    // const objectArray = Object.entries(entityResponse);


    // console.log(entityResponse);

    if(lodash.isArray(entityResponse)){
        console.log(' array');

        console.log(entityResponse);
    }else{
        console.log('NOT array');
       
        console.log(entityResponse);
        // Object.keys(entityResponse).map((val) => {
        //     console.log(`key: ${val}, ${entityResponse[val]}`);
        // });
        // objectArray.forEach(([key, value]) => {
        //     console.log(key, value);
        // })
    }
}
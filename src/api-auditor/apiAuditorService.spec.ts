import { fetchDataFromUsingAxios, readFileToCsn } from "./apiAuditorService";
import axios from "axios";
const mockedAxios = axios as jest.Mocked<typeof axios>

jest.mock('axios');

const mockData = `{
    "@odata.context": "$metadata#BusinessPartner",
    "value": [
      {
        "id": "S4~11",
        "displayId": "11",
        "businessPartnerType": "organization",
        "lifecycleStatus": {
          "code": " 1"
        },
        "isBlocked": false,
        "AuthorizationGroup": "",
        "BusinessPartnerUUID": "00163e37-bedf-1ed8-9883-fe15a0b5fc9e",
        "Industry": "",
        "PersonNumber": "",
        "to_Customer": null,
        "to_Supplier": null
      }
    ]
  }`;

  //file extensions: pathUtils.extname(filename)
describe("API Auditor service tests", () => {
    test("Read edmx file to CSN", async () => {
      
        const expectedFile = `{
            definitions: {
              c4codata: { kind: 'service' },
              'c4codata.ContactCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.ContactPersonalAddressCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.ContactAttachmentFolderCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.ContactTextCollectionCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.ContactInternationalVersionCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.ContactIsContactPersonForCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.IndividualCustomerTaxNumberCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.CorporateAccountTaxNumberCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.IndividualCustomerSalesDataCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.CorporateAccountSalesDataCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.CorporateAccountVisitingHoursOperatingPeriodCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.CorporateAccountHasContactPersonCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.IndividualCustomerTeamCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.CorporateAccountAddressCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.CorporateAccountTeamCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.CorporateAccountTextCollectionCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.CorporateAccountAttachmentFolderCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.CorporateAccountCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.IndividualCustomerTextCollectionCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.IndividualCustomerAttachmentFolderCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.IndividualCustomerCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.IndividualCustomerAddressCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.CorporateAccountVisitingHoursCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.CorporateAccountVisitingHoursRecurrenceCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.IndividualCustomerSkillsCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.CorporateAccountSkillsCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.CorporateAccountVisitingInformationDetailsCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.IndividualCustomerVisitingInformationDetailsCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.CorporateAccountInternationalVersionCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.CorporateAccountIdentificationCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.IndividualCustomerIdentificationCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.BusinessUserCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.BusinessUserBusinessRoleAssignmentCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.BusinessUserSubscriptionAssignmentCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.EmployeeBasicDataCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.IndividualCustomerVisitingInformationDetailsVisitTypeCodeCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              },
              'c4codata.IndividualCustomerTaxNumberTaxTypeCodeCollection': {
                kind: 'entity',
                '@cds.persistence.skip': true,
                elements: [Object]
              }
            }
          }`;
        const filepath = "./src/data/customer.edmx" ;
        const file = await readFileToCsn(filepath);
        // console.log(file);
        expect(file).toMatchSnapshot(expectedFile);
    });

  
 
 
});

describe('Fetch data from url: axios', () => {

    test("Fetches successfully data from an API", async () => {

        (axios as any).mockResolvedValue({
            data: mockData,
        });
        mockedAxios.get.mockImplementationOnce(() => Promise.resolve(mockData));
        await expect(fetchDataFromUsingAxios('url')).resolves.toEqual(mockData);
    });

    test("Fetches erroneously data from an API", async () => {
        const errorMessage = `could not fetch metadata for url: url with error: TypeError: Cannot read property 'data' of undefined`;

        mockedAxios.get.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
        await expect(fetchDataFromUsingAxios('url')).rejects.toThrow(errorMessage);
    })
});
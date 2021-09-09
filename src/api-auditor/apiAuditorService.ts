
import { generateCSN } from "@sap/edm-converters/lib/edmToCsn/lib/main";
import axiosRetry from "axios-retry";
import axios from "axios";
import { promises as fsPromise } from "fs";
import { ENTITY_NODE_LABEL, QUERY_NODE_LABEL, QUERY_ENTITY_REF_NODE_LABEL, QUERY_ENTITY_RELATIONSHIP, ENTITYTYPE_NODE_LABEL, ENTITY_ENTITYTYPE_RELATIONSHIP, ENTITY_ENTITYTYPE_REF_NODE_LABEL } from "../commonConstants";
import { executeQuery} from "../db/neo4jService";
import { randomString } from "../db/neo4jUtil";

axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount: number) => {
      return retryCount * 1000;
    },
  });

export const readFileToCsn = async (filePath: string) => {
    const file = await fsPromise.readFile(filePath, 'utf8');
    const csnFile= JSON.parse(await generateCSN(file, false, true));
    return csnFile;
}

export const readFile = async (filePath: string) => {
  const file = await fsPromise.readFile(filePath, 'utf8');
  return file;
}
export const readFileToJson = async (file: string) => {
  const jsonFile= JSON.parse(await generateCSN(file, false, true));
  return jsonFile;
}

export function  getUrl(req: any, entity: string, params: string): string  {
  const url = `https://sandbox.api.sap.com/sap/c4c/odata/v1/c4codataapi/${entity}${
    params ? `?${params}` : ''
  }`;
  return url;
}


export async function fetchDataFromUsingAxios(
    url: string
  ): Promise<string> {

    const headersRequest = {
        'Content-Type': 'application/json',
        apiKey: 'PhsRXkvMOZLhn1kqO2lif8aNhH76jYTd',
      };
    try {
        const response = await axios({
            headers: headersRequest,
            url: url,
          });
      return response.data;
    } catch (err) {
      throw Error(
        `could not fetch metadata for url: ${url} with error: ${err}`
      );
    }
  }


export const saveEntityNodeToDb = async (queryId: string, entityName: string): Promise<string> => {

  const entityId = randomString();
  const query = `CREATE (e:${ENTITY_NODE_LABEL} {eid: '${entityId}', name: '${entityName}'})`;

  await Promise.all([
    await executeQuery(query),
    await addRelationshipBtwEntityAndQuery(queryId, entityId),
  ]);
  return entityId;
}

export const saveEntityTypeNodeToDb = async (entityId: string, key: string, value: string): Promise<string> => {

  const entityTypeId = randomString();
  const query = `MERGE (e:${ENTITYTYPE_NODE_LABEL} {etid: '${entityTypeId}', key: '${key}', value: '${value}'})`;
  
  await Promise.all([
    await executeQuery(query),
    await addRelationshipBtwEntityAndEntityType(entityId, entityTypeId),
  ]);
  
  return entityTypeId;
}

export const saveQueryNodeToDb = async (url: string): Promise<string> => {
  const id = randomString();
  const query = `MERGE (q:${QUERY_NODE_LABEL} {qid: '${id}', name: '${url}'})`;
  await executeQuery(query);
  return id;
}

export async function addRelationshipBtwEntityAndQuery(queryId: string, entityId: string){

  const rid = randomString();
  const query1 = `MATCH 
                (a:${QUERY_NODE_LABEL}), (e:${ENTITY_NODE_LABEL})
                WHERE a.qid = '${queryId}' AND e.eid = '${entityId}'
                MERGE (a)-[:${QUERY_ENTITY_RELATIONSHIP}]->(n:${QUERY_ENTITY_REF_NODE_LABEL})-[:${QUERY_ENTITY_RELATIONSHIP}]->(e)
                SET n.rid = '${rid}', n.qid = '${queryId}', n.eid = '${entityId}'
                RETURN n`;

  await executeQuery(query1);
}

export async function addRelationshipBtwEntityAndEntityType(entityId: string, entityTypeId: string){

  const rid = randomString();
  const query1 = `MATCH 
                (a:${ENTITY_NODE_LABEL}), (e:${ENTITYTYPE_NODE_LABEL})
                WHERE a.eid = '${entityId}' AND e.etid = '${entityTypeId}'
                MERGE (a)-[:${ENTITY_ENTITYTYPE_RELATIONSHIP}]->(n:${ENTITY_ENTITYTYPE_REF_NODE_LABEL})-[:${ENTITY_ENTITYTYPE_RELATIONSHIP}]->(e)
                SET n.rid = '${rid}', n.etid = '${entityTypeId}', n.eid = '${entityId}'
                RETURN n`;

  await executeQuery(query1);
}


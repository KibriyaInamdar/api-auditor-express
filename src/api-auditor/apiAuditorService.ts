
import { generateCSN } from "@sap/edm-converters/lib/edmToCsn/lib/main";
import axiosRetry from "axios-retry";
import axios from "axios";
import { promises as fsPromise } from "fs";
import { ENTITY_NODE_LABEL, QUERY_NODE_LABEL, QUERY_ENTITY_REF_NODE_LABEL, QUERY_ENTITY_RELATIONSHIP, ENTITYVALUE_NODE_LABEL, ENTITY_ENTITYVALUE_RELATIONSHIP, ENTITY_ENTITYVALUE_REF_NODE_LABEL, ENTITY_DEFERRED_ENTITY_REF_NODE_LABEL, ENTITY_DEFERRED_ENTITY_RELATIONSHIP, BASE_URL } from "../commonConstants";
import { executeQuery} from "../db/neo4jService";
import { randomString } from "../db/neo4jUtil";
import { error } from "neo4j-driver";
import  crypto  from "crypto";
import lodash from "lodash";
import path from "path";

axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount: number) => {
      return retryCount * 1000;
    },
  });

export const readFileToCsn = async (filePath: string) => {
    const file = await fsPromise.readFile(filePath, 'utf8');
    console.log(filePath);
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
  const basePath = path.join(BASE_URL, entity);
  const url = `${basePath}${
    params ? `?${params}` : ''
  }`;
  return url;
}

export async function fetchDataFromUrlUsingAxios(
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
          if(response.status === 404) {
            throw error;
          }
      return response.data;
    } catch (err) {
      throw Error(
        `could not fetch metadata for url: ${url} with error: ${err}`
      );
    }
  }


// export const saveEntityNodeToDb = async (queryId: string, entityName: string, objectId: string): Promise<string> => {
export const saveEntityNodeToDb = async (entityNode: EntityNode): Promise<string> => {

  const nodeId = getNodeId(ENTITY_NODE_LABEL, entityNode.key, entityNode.value);
  const query = `CREATE (e:${ENTITY_NODE_LABEL} {nid: '${nodeId}', key: '${entityNode.key}', value: '${entityNode.value}'})`;

  await Promise.all([
    await executeQuery(query),
    await addRelationshipBtwEntityAndQuery(entityNode.refNodeId, nodeId),
    entityNode.deferredFlag ? await addRelationshipBtwEntityAndDeferredEntity(entityNode.parentEntityId, nodeId) : "",
    
  ]);
  return nodeId;
}


export const saveEntityValueNodeToDb = async (entityId: string, key: string, value: string): Promise<string> => {

  const nodeId = getNodeId(ENTITYVALUE_NODE_LABEL, key, value);
  const query = `CREATE (e:${ENTITYVALUE_NODE_LABEL} {nid: '${nodeId}', key: '${key}', value: '${value}', entityId: '${entityId}'})`;
  
  await Promise.all([
    await executeQuery(query),
    await addRelationshipBtwEntityAndEntityValue(entityId, nodeId),
  ]);
  
  return nodeId;
}

export const saveQueryNodeToDb = async (url: string): Promise<string> => {

  const validUrl = validateUrl(url);
  const nodeId = getNodeId(ENTITYVALUE_NODE_LABEL, BASE_URL, url);

  //add baseurl to query
  const query = `CREATE (q:${QUERY_NODE_LABEL} { 
                  nid: '${nodeId}', 
                  query: '${validUrl}'
                })`;

  await executeQuery(query);
  return nodeId;
}

function validateUrl(url:string): string {


  // if(url.includes('\'') || url.includes('(')){
  if(url.includes('\'')){

    // const encodedUrl = url.split('(').join('%28');
    // const encodedUrl1 = encodedUrl.split(')').join('%29');
    const newUrl = url.split('\'').join('%27');
    return newUrl;
  }
  return url;
}

export async function addRelationshipBtwEntityAndQuery(queryId: string, entityId: string){

  const rid = randomString();
  const query1 = `MATCH 
                (a:${QUERY_NODE_LABEL}), (e:${ENTITY_NODE_LABEL})
                WHERE a.nid = '${queryId}' AND e.nid = '${entityId}'
                MERGE (a)-[:${QUERY_ENTITY_RELATIONSHIP}]->(n:${QUERY_ENTITY_REF_NODE_LABEL})-[:${QUERY_ENTITY_RELATIONSHIP}]->(e)
                SET n.nid = '${rid}', n.qid = '${queryId}', n.eid = '${entityId}'
                RETURN n`;

  await executeQuery(query1);
}

export async function addRelationshipBtwEntityAndEntityValue(entityId: string, entityValueId: string){

  const query1 = `MATCH 
                (a:${ENTITY_NODE_LABEL}), (e:${ENTITYVALUE_NODE_LABEL})
                WHERE a.nid = '${entityId}' AND e.nid = '${entityValueId}'
                MERGE (a)-[:${ENTITY_ENTITYVALUE_RELATIONSHIP}]->(e)`;

  await executeQuery(query1);
}

export async function addRelationshipBtwEntityAndDeferredEntity(parentEntityId: string | undefined, deferredEntityId: string){

  const rid = randomString();
  const query1 = `MATCH 
                (p:${ENTITY_NODE_LABEL}), (d:${ENTITY_NODE_LABEL})
                WHERE p.nid = '${parentEntityId}' AND d.nid = '${deferredEntityId}'
                MERGE (p)-[:${ENTITY_DEFERRED_ENTITY_RELATIONSHIP}]->(n:${ENTITY_DEFERRED_ENTITY_REF_NODE_LABEL})-[:${ENTITY_DEFERRED_ENTITY_RELATIONSHIP}]->(d)
                SET n.nid = '${rid}', n.parentEntityId = '${parentEntityId}', n.eid = '${deferredEntityId}'
                RETURN n`;
  await executeQuery(query1);
}

export const getEntityNode = (refNodeId: string, entity: string, entityValue: string, deferredFlag? : boolean, parentEntityId? : string): EntityNode =>{
  const entityNode : EntityNode = {
    refNodeId: refNodeId,
    key: entity,
    value: entityValue,
    deferredFlag: deferredFlag,
    parentEntityId: parentEntityId ? parentEntityId : '',
  
  }
  return entityNode;
}
export type EntityNode = {
  refNodeId: string;
  value: string;
  key: string;
  deferredFlag?: boolean;
  parentEntityId?: string;

}


export const loadCsvFile = async (filepath: string) => {

  
  const query = `LOAD CSV WITH HEADERS FROM "${filepath}" AS csvLine
  CREATE (p:Person {id: csvLine.id, name: csvLine.name, key: csvLine.key, value: csvLine.value, movie: csvLine.movie}) `;

  console.log(query);

  try {
    await Promise.all([
      await executeQuery(query)
    ]);
  } catch (error) {
    console.log(error);
  }


}

function getNodeId(label: string, key: string, value: string): string {
  const md5 = crypto.createHash('md5');

  try{
  const val = lodash.isEmpty(value)? randomString() : value;
  const hash = md5
    .update(label)
    .update(key)
    .update(val)
    .digest('hex');
  return hash;
  } catch (error) {
    console.log(error);
  }
  return '';
}
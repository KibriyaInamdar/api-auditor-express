
import { Integer, QueryResult } from "neo4j-driver";
import { Neo4jEntity } from "./neo4jUtil";


export async function getNodeCountFromDb(database?: string): Promise<Integer> {
  const neo4jUtils = new Neo4jEntity();
    const query = 'MATCH (n) RETURN count(n) AS count';
    const result = await neo4jUtils.read(query, {});
    const count = result.records[0].get('count');
    return count;
  }

export async function executeQuery(query: string){
  const neo4jUtils = new Neo4jEntity();
  const result = await neo4jUtils.write(query, {});

}


export async function readQuery(query: string): Promise<QueryResult>{
  const neo4jUtils = new Neo4jEntity();
  const result = await neo4jUtils.read(query, {});
  return result;

}
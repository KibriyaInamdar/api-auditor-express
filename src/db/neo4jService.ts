
import { Integer } from "neo4j-driver";
import { Neo4jEntity } from "./neo4jUtil";


export async function getNodeCountFromDb(database?: string): Promise<Integer> {

    const neo4jUtils = new Neo4jEntity();
    const query = 'MATCH (n) RETURN count(n) AS count';
    const result = await neo4jUtils.read(query, {});
    const count = result.records[0].get('count');
    return count;
  }

export async function createNodeInDb(label: string, name: string): Promise<string> {

  // console.log(`lable: ${label}, name: ${name}`);
  const neo4jUtils = new Neo4jEntity();
  // const query = 'CREATE (n:Person {name: 'Andy', title: 'Developer'})';

  const id = randomString();
  const query = `CREATE (n:${label} {id: '${id}', name: '${name}'})`;
  await neo4jUtils.write(query, {});
  return id;
}

export async function createParameterNodeInDb(label: string, name: string, value: string): Promise<string>{

  // console.log(`lable: ${label}, name: ${name}`);
  const neo4jUtils = new Neo4jEntity();
  const id = randomString();
  const query = `CREATE (n:${label} {id: '${id}', name: '${name}' , value: '${value}'})`;
  // `MATCH (n: ${relLable} {id: '${relId}'}) CREATE (n) -[r: posted]-> (p: post {pid: "42", title: "Good Night", msg: "Have a nice and peaceful sleep.", author: n.uid});`

  await neo4jUtils.write(query, {});
  return id;
}

export async function addRelationshipBetweenTwoNodes(label1: string, name1: string, label2: string, name2: string, relType: string){
  const neo4jUtils = new Neo4jEntity();
  const query = `MATCH 
                (a:${label1}), (b:${label2})
                WHERE a.id = '${name1}' AND b.id = '${name2}'
                CREATE (a)-[r:${relType}]->(b)
                RETURN type(r)`;
  const result = await neo4jUtils.write(query, {});
}


function randomString(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

  const length = 5;
  var str = '';
  for (var i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}
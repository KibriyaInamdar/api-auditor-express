
import { readQuery } from "../db/neo4jService";

export const getNodeFromDb = async () => {
  
    //add baseurl to query
    const query = `MATCH (n:Entity), (ev:EntityValue)
    WHERE  n.key = 'ContactCollection' AND n.value = '00163E038C2E1EE299C1BB0BE93B6F9B' AND (n)-[:Has]->(ev)
    return ev.key, ev.value`;
  
    const results = await readQuery(query);
  
    results.records.forEach(rec => {

        console.log(rec.length);
        const node = rec.get(1);
        
        // console.log(node);
    })
  }

  /**
   MATCH (q:Query),(n:QueryEntityRef), (e:Entity),  (r:EntityEntitytypeRef), (et:EntityType)
WHERE q.nid='oK24E' AND n.qid='oK24E' AND (q)-[:Generate]->(n)-[:Generate]->(e) AND r.eid='18V9f' AND (e)-[:Has]->(r)-[:Has]->(et)
RETURN q,n, e, r, et


MATCH (e:Entity), (r:EntityEntitytypeRef), (et:EntityType)
WHERE e.eid = 'hp2il' AND r.eid='hp2il'  AND (e)-[:Has]->(r)-[:Has]->(et)
RETURN e, r, et



   */
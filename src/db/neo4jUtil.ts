import { read } from 'fs';
import neo4j, { driver, Driver, Integer, Result } from 'neo4j-driver';
import { Neo4jConfig } from './neo4j-config.interface';
// import { Neo4jConfig } from './neo4j-config.interface';

  export class Neo4jEntity {
      private driver: Driver;
    //   private config: Neo4jConfig;


      constructor(){
        this.driver = createDriver();
      }
      getDriver(): Driver {
        return this.driver;
      }
    
    //   getConfig(): Neo4jConfig {
    //     return this.config;
    //   }
    public getReadSession( database?: string){
        return this.driver.session({
          database: database,
          defaultAccessMode: neo4j.session.READ,
        });
      }
    
    read(cypher: string, params: Record<string, any>, database?: string): Result {
    const session = this.getReadSession(database);
    return session.run(cypher, params);
    }

    getWriteSession(database?: string){
        return this.driver.session({
          database: database,
          defaultAccessMode: neo4j.session.WRITE,
        });
      }
    
    write(cypher: string, params: Record<string, any>, database?: string): Result {
      // console.log(`cypher: ${cypher}`);
        const session = this.getWriteSession(database);
        return session.run(cypher, params);
      }
  }



/* export const createDriver = async (config: Neo4jConfig) => {
   const driver: Driver = neo4j.driver(
    `${config.scheme}://${config.host}:${config.port}`,
    neo4j.auth.basic(config.username, config.password),
  );
    await driver.verifyConnectivity();
    return driver;
}; */

export const createDriver =  () => {
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j','neo'));
    return driver;
};
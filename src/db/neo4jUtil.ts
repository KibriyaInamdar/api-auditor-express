// import neo4j, { Driver, Result } from 'neo4j-driver';
// import { Neo4jConfig } from './neo4j-config.interface';


// export const createDriver = async (config: Neo4jConfig) => {
//    const driver: Driver = neo4j.driver(
//     `${config.scheme}://${config.host}:${config.port}`,
//     neo4j.auth.basic(config.username, config.password),
//   );

//   await driver.verifyConnectivity();

//   return driver;
// };


// export const getDriver =  async (driver: Driver) : Promise<Driver> => {
//     await driver.verifyConnectivity();
//     return driver;
//   };

// export function getReadSession(driver: Driver, database?: string){
//     return driver.session({
//       database: database,
//       defaultAccessMode: neo4j.session.READ,
//     });
//   }

// //  export function read(cypher: string, params: Record<string, any>, database?: string): Result {
// //     const session = getReadSession(database);
// //     return session.run(cypher, params);
// //   }
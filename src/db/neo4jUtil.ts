import { query } from 'express';
import { read } from 'fs';
import { defer } from 'lodash';
import neo4j, { Config, driver, Driver, Integer, Result } from 'neo4j-driver';
import { config } from 'process';
import { Neo4jConfig } from './neo4j-config.interface';
// import { Neo4jConfig } from './neo4j-config.interface';

export class Neo4jEntity {
  private driver: Driver;

  constructor(){
    this.driver = createDriver();
  }

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
  
  async write(cypher: string, params: Record<string, any>, database?: string) {
    await this.driver.verifyConnectivity();
    const session = this.getWriteSession(database);
    const result = session.run(cypher, params);

    result.then(() => {
      session.close();
      return result;
    }).finally(()=>{
      this.driver.close();
    });

  }

  writeT(cypher: string, params: Record<string, any>, database?: string) {
    const session = this.getWriteSession(database);
    var writeTxResultPromise = session.writeTransaction(async txc => {
      const result =  txc.run( cypher);
      return result
    })
    writeTxResultPromise
      .then(() => {
        session.close();
      })
      .catch(error => {
        console.log(error)
      });
  }
}

export const createDriver = () => {

    const config: Config = {
      maxConnectionLifetime: 20 * 60 * 1000,
      connectionTimeout: 1000 * 45,
      connectionAcquisitionTimeout: 60000,
      maxTransactionRetryTime: 10000,
      maxConnectionPoolSize: 400,
      // logging: {
      //   level: 'debug',
      //   logger: (level, message) => console.log('+++' + level + ' ' + message)
      // } 
    }
    const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j','neo'), config);
    return driver;
};


export function randomString(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

  const length = 5;
  var str = '';
  for (var i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}
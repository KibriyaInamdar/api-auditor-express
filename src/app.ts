import express, {Application, Request, Response, NextFunction} from 'express';
import getAllUsers from './routes/getAllUsers';
import neo4j from 'neo4j-driver';
import { fetchData, readFileToCsn } from './api-auditor/apiAuditorService';


const app: express.Application = express();
const port = 5000;

const add = (a:number, b:number): number => a+b;

app.get('/', (req:Request, res:Response, newxt: NextFunction) =>{
    console.log(add(10,5));

    res.send(`Hello `);
});

app.get('/*', async (req, res) => {
    // const response = await getDataFromUrl(req, `${req.url}`, "");

    const filepath = './src/data/customer.edmx' 
    const file = await fetchData(req, req.url, '');
    console.log(`file: ${file}`);

    res.send(`<pre><code>${JSON.stringify(file, null, 2)}</code></pre>`);
});

app.get('/users', getAllUsers);

app.get('/api', async (req, res) => {
    // const response = await getDataFromUrl(req, `${req.url}`, "");

    const filepath = './src/data/customer.edmx' 
    const file = await readFileToCsn(filepath);
    console.log(`file: ${file}`);

    res.send(`<pre><code>${JSON.stringify(file, null, 2)}</code></pre>`);
});



/* const neo4jConfig: Neo4jConfig = {
    scheme: 'bolt',
    host: 'localhost',
    port: 7687,
    username: 'neo4j',
    password: 'neo',
} 
    const driver = createDriver(neo4jConfig);
*/

const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j','neo'));
const session = driver.session({
    defaultAccessMode: neo4j.session.READ,
  });

app.get('/db', async (req:Request, res:Response, newxt: NextFunction) =>{

    //scenario 1: get count
    const query = 'MATCH (n) RETURN count(n) AS count';

    const result = await session.run(query);
    const count = result.records[0].get('count');
    res.send(`Node count : ${count}`);

 /*    //scenario 2: get nodes
    const query = 'MATCH(n:Product) RETURN n LIMIT 25';
    const result = await session.run(query);
    console.log(`Records: ${result.records.length}`);
    result.records[0].forEach((rec) => {
        console.log(rec);
        });
    res.send('Check logs for more details'); */
});


app.listen( port, () => {
    console.log( `Surver is running at http://localhost:${port}` );
} );
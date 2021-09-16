# api-auditor

Utility for assessing API quality

## Scripts


| Command            | Description                                        |
| ------------------ | -------------------------------------------------- |
| `npm start`        | run the application                                |
| `npm test`         | Run tests                                          |

## Neo4j configuration

1. create account on Neo4j browser
2. create a new project called Neo4j
3. set username as `neo4j`
4. set password as `neo`
5. default port os set to `7687`
6. open `neo4j.conf` file and uncomment following lines
    - dbms.connector.bolt.enabled=true
    - dbms.connector.bolt.listen_address=:7687
    - dbms.security.allow_csv_import_from_file_urls=true
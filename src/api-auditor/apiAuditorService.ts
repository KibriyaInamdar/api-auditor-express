
import { generateCSN } from "@sap/edm-converters/lib/edmToCsn/lib/main";
import axiosRetry from "axios-retry";
import axios from "axios";
import { promises as fsPromise } from "fs";

axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount: number) => {
      return retryCount * 1000;
    },
  });

export const readFileToCsn = async (filePath: string) => {
    console.log(`filepath: ${filePath}`);
    const file = await fsPromise.readFile(filePath, 'utf8');
    const csnFile= JSON.parse(await generateCSN(file, false, true));
    // const jsonFile = cds.compile(csnFile).to.json();
    return csnFile;
}

export const readFile = async (filePath: string) => {
  console.log(`filepath: ${filePath}`);
  const file = await fsPromise.readFile(filePath, 'utf8');
  return file;
}
export const readFileToJson = async (file: string) => {
  const jsonFile= JSON.parse(await generateCSN(file, false, true));
  return jsonFile;
}

export async function  fetchData(req: any, entity: string, params: string): Promise<string>  {

    const url = getUrl(req, entity, params);
    const response = await fetchDataFromUsingAxios(url);
    return response;
}

export function  getUrl(req: any, entity: string, params: string): string  {
  // console.log(`req: ${req.url}, entity: ${entity}, params: ${params}`);
  const url = `https://sandbox.api.sap.com/sap/c4c/odata/v1/c4codataapi/${entity}${
    params ? `?${params}` : ''
  }`;
  console.log(url); //for debugging
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
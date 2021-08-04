declare module "@sap/edm-converters/lib/edmToCsn/lib/main" {
    export function generateCSN(
      edmx: any,
      ignorePersistenceSkip: any,
      mockServerUc: any
    ): Promise<any>;
  }
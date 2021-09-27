export class ApiSpecification {
  public filePath: string;
  public content: any;
  public entities: string[] = [];

  public invalidEntities :string[] = [];
  public validEntities :string[] = [];

  public entityData: EntityData[] = [];

  // public entityContent: EntityContent[] = [];

  // public entityType = new Map<string, string>();
  public entityContent: EntityContent | undefined;


  constructor(filePath: string) {
    this.filePath = filePath;
  }
  
  public load = async (file: string): Promise<void> => {
    // console.log(JSON.stringify(file));
    this.content = JSON.parse(JSON.stringify(file)) as ApiSpecificationContent;
    const definitions = this.content['definitions'];
    this.entities = Object.keys(definitions);
  };

}
type ApiSpecificationContent = {
  definitions: {

  };
};

export type ApiSpecificationEntityContent = {
  d: {
    results: ApiResponse[]
  }
}

export type ApiResponse = {
 
}



export type EntityContent = Record<string, EntityValue[]>;

export type EntityData = Record<string, EntityResponse[] >;

export type EntityValue = Record<string, unknown>;

export type DeferredEntity = Record<string, EntityValue[]>

export type EntityResponse = {
  entityValues: EntityValue[],
  deferredEntityNames?: string[],
  deferredEntities: EntityData[]
}

export type QueryParam = {
  query: string,
  entity: string,
  value: string,
  navigationProperty: string
}
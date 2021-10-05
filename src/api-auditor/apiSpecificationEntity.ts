import lodash from "lodash";

export class ApiSpecification {
  public filePath: string;
  public content: any;
  public entities: string[] = [];

  public invalidEntities :string[] = [];
  public validEntities :string[] = [];

  public entityData: EntityData[] = [];

  constructor(filePath: string) {
    this.filePath = filePath;
  }
  
  public load = async (file: string): Promise<void> => {
    // console.log(JSON.stringify(file));
    this.content = JSON.parse(JSON.stringify(file)) as ApiSpecificationContent;
    const definitions = this.content['definitions'];
    this.entities = Object.keys(definitions);
  };

  public setMetadata = (entityData: EntityData[]) => {
    this.entityData = entityData;
  };

  public getMeatadata = (entity: string) : EntityResponse[] => {

    let entityResponse: EntityResponse [] = [];
    (this.entityData).map(entry => {
      Object.entries(entry).map(([key, value]) => {
        if(key === entity)
          entityResponse = value;
      })
    });
    return entityResponse;
  }

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

// export type EntityData = Record<string, EntityResponse[] >;

export type EntityData = {
  [key:string]: EntityResponse[];
}

export type EntityPropertyData = {
  [key:string]: unknown;
}

export type QueryParam = {
  query: string,
  entity: string,
  value: string,
  navigationProperty: string
}

export type EntityProperies = {
  properties: string[],
  navigationProperties: string[]
}

export type EntityResponse = {
  entityProperties: EntityPropertyData[],
  entityNavigationProperties: EntityData[]
}

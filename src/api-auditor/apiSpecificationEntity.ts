export class ApiSpecification {
  public filePath: string;
  public content: any;
  public namespaces: string[] = [];

  public invalidEntities :string[] = [];
  public validEntities :string[] = [];

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
    this.namespaces = Object.keys(definitions);
  };

}
type ApiSpecificationContent = {
  definitions: {

  };
};

export type ApiSpecificationEntityContent = {
  d: {
    results: EntityResponse[]
  }
}

export type EntityResponse = {
  result: {
  }
}

export type EntityValue = Record<string, unknown>;

export type EntityContent = Record<string, EntityValue[]>;
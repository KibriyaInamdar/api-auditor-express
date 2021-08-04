/* import { Logger } from '@nestjs/common';

export class ApiSpecification {
  public filePath: string;
  public content: ApiSpecificationContent | undefined;
  public namespace: string;
  public entityTypes: EntityType[];
  public association: ApiAssociation[];
  public entityContainer: EntityContainer[];

  private readonly logger = new Logger(ApiSpecification.name);

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  public load = async (file: string): Promise<void> => {
    console.log(JSON.stringify(file));
    this.content = JSON.parse(JSON.stringify(file)) as ApiSpecificationContent;

    this.namespace =
      this.content['edmx:Edmx']['edmx:DataServices'][0].Schema[0].$.Namespace;

    console.log(`namespace: ${this.namespace}`);
    this.entityTypes = setEntityTypes(
      this.content['edmx:Edmx']['edmx:DataServices'][0].Schema[0].EntityType,
    );

    console.log(`entityTypes: ${this.entityTypes}`);
    this.association =
      this.content['edmx:Edmx']['edmx:DataServices'][0].Schema[0].Association;

    this.entityContainer = setEntityContainers(
      this.content['edmx:Edmx']['edmx:DataServices'][0].Schema[0]
        .EntityContainer,
    );

    console.log(`this.entityTypes`);
    console.log(this.entityTypes);

    // const prop = 'edmx:Edmx.edmx:DataServices';
    // const obj = findProp(this.content, prop, null);
    // const dataServiceSchema = obj[0]['Schema'][0];

    // this.namespace = dataServiceSchema['$'].Namespace;
    // this.entityType = dataServiceSchema.EntityType;
    // this.association = dataServiceSchema.Association;
    // this.entityContainer = dataServiceSchema.EntityContainer;

    // // console.log(this.entityContainer);
    // console.log(this.entityContainer[0].$.Name);
    // console.log(this.entityContainer[0].EntitySet[0].$.EntityType);
    // console.log(this.entityContainer[0].AssociationSet[0].$.Association);
    // console.log(this.entityContainer[0].FunctionImport[0].$['m:HttpMethod']);
  };
}

// function findProp(obj, prop, defval) {
//   if (typeof defval === 'undefined') defval = null;
//   prop = prop.split('.');
//   for (let i = 0; i < prop.length; i++) {
//     if (typeof obj[prop[i]] === 'undefined') return defval;
//     obj = obj[prop[i]];
//   }
//   return obj;
// }

type ApiSpecificationContent = {
  'edmx:Edmx': {
    $: {
      Version: string;
    };
    'edmx:DataServices': [
      {
        $: {
          'm:DataServiceVersion': string;
        };
        Schema: [
          {
            $: {
              Namespace: string;
            };
            EntityType: ApiEntityType[];
            Association: ApiAssociation[];
            EntityContainer: ApiEntityContainer[];
          },
        ];
      },
    ];
  };
};

type ApiEntityType = {
  $: {
    Name: string;
  };
  Key: [
    {
      PropertyRef: [
        {
          $: {
            Name: string;
          };
        },
      ];
    },
  ];
  Property: ApiEntityTypeProperty[];
  NavigationProperty: ApiEntityTypeNavigationProperty[];
};

type ApiEntityTypeProperty = {
  $: {
    Name: string;
    Type: string;
    'sap:label': string;
  };
};
type ApiEntityTypeNavigationProperty = {
  $: {
    Name: string;
    Relationship: string;
    FromRole: string;
    ToRole: string;
  };
};

type ApiAssociation = {
  $: {
    Name: string;
  };
  End: [
    {
      $: {
        Name: string;
        Multiplicity: string;
        Role: string;
      };
    },
  ];
};
// export type AssociationEndObject = {
//   type: string;
//   multiplicity: string;
//   role: string;
// };
type ApiEntityContainer = {
  $: {
    Name: string;
  };
  EntitySet: ApiEntitySet[];
  AssociationSet: ApiAssociationSet[];
  FunctionImport: ApiFunctionImport[];
};
type ApiEntitySet = {
  $: {
    Name: string;
    EntityType: string;
    'sap:creatable': boolean;
  };
};
type ApiAssociationSet = {
  $: {
    Name: string;
    Association: string;
    'sap:creatable': boolean;
  };
  End: AssociationSetEndObject[];
};

type AssociationSetEndObject = {
  $: {
    entitySet: string;
    role: string;
  };
};
type ApiFunctionImport = {
  $: {
    Name: string;
    ReturnType: string;
    EntitySet: string;
    'm:HttpMethod': string;
  };

  Parameter: FunctionImportParameter[];
};
type FunctionImportParameter = {
  $: {
    Name: string;
    Type: string;
    Mode: string;
  };
};

export type EntityType = {
  entityName: string;
  entityKey?: string;
  properties?: EntityProperty[];
  navigationProperties?: EntityNavigationProperty[];
};

export type EntityProperty = {
  name: string;
  type: string;
  label: string;
};

export type EntityNavigationProperty = {
  name: string;
  relationship: string;
  fromRole: string;
  toRole: string;
};

function setEntityTypes(apiEntityType: ApiEntityType[]): EntityType[] {
  const entityTypes: EntityType[] = [];

  apiEntityType.forEach((entity) => {
    // console.log('entity');
    // console.log(entity);
    entityTypes.push({
      entityName: entity.$.Name,
      entityKey: entity.Key[0].PropertyRef[0].$.Name,
      properties: setEntityProperties(entity.Property),
      navigationProperties: setNavigationProperties(entity.NavigationProperty),
    });
  });

  return entityTypes;
}
function getEntityType(apiEntityTypeName: string): EntityType {
  const entityType: EntityType = {
    entityName: apiEntityTypeName,
  };
  return entityType;
}

function setEntityProperties(
  apiProperties: ApiEntityTypeProperty[],
): EntityProperty[] {
  const entityProperties: EntityProperty[] = [];
  apiProperties.forEach((property) => {
    entityProperties.push({
      name: property.$.Name,
      type: property.$.Type,
      label: property.$['sap:label'],
    });
  });
  return entityProperties;
}
function setNavigationProperties(
  apiNavProperties: ApiEntityTypeNavigationProperty[],
): EntityNavigationProperty[] {
  const navProperties: EntityNavigationProperty[] = [];
  apiNavProperties.forEach((property) => {
    navProperties.push({
      name: property.$.Name,
      relationship: property.$.Relationship,
      fromRole: property.$.FromRole,
      toRole: property.$.ToRole,
    });
  });
  return navProperties;
}

export type EntityContainer = {
  name: string;
  entitySets: EntitySet[];
};
export type EntitySet = {
  name: string;
  entityType: EntityType;
};

function setEntityContainers(
  apiEntityContainer: ApiEntityContainer[],
): EntityContainer[] {
  const entityContainers: EntityContainer[] = [];
  apiEntityContainer.forEach((ele) => {
    entityContainers.push({
      name: ele.$.Name,
      entitySets: setEntitySets(ele.EntitySet),
    });
  });
  return entityContainers;
}

function setEntitySets(apiEntitySet: ApiEntitySet[]): EntitySet[] {
  const entitySets: EntitySet[] = [];
  apiEntitySet.forEach((ele) => {
    entitySets.push({
      name: ele.$.Name,
      entityType: getEntityType(ele.$.EntityType),
    });
  });
  return entitySets;
}
 */
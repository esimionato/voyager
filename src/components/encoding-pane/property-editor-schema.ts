import * as vlSchema from 'vega-lite/build/vega-lite-schema.json';

export interface PropertyEditorFormatSchema {
  type: string;
  title?: string;
  properties: any;
}

export interface PropertyEditorSchema {
  uiSchema: any;
  schema: PropertyEditorFormatSchema;
}

export function getPropertyEditorSchema(prop: string, nestedProp: string, propTab: string): PropertyEditorSchema {
  if (prop === 'scale') {
    if (nestedProp === 'type') {
      return generateSchema(prop, nestedProp, SCALE_TYPE_UISCHEMA, propTab,
        (vlSchema as any).definitions.ScaleType.enum);
    }
  } else if (prop === 'axis') {
    if (nestedProp === 'orient') {
      return generateSchema(prop, nestedProp, AXIS_ORIENT_UISCHEMA, propTab,
        (vlSchema as any).definitions.AxisOrient.enum);
    } else if (nestedProp === 'title') {
      return generateSchema(prop, nestedProp, AXIS_TITLE_UISCHEMA, propTab);
    }
  } else if (prop === 'stack') {
    return generateSchema(prop, nestedProp, STACK_UISCHEMA, propTab, (vlSchema as any).definitions.StackOffset.enum);
  } else {
    return {
      schema: undefined,
      uiSchema: {}
    };
  }
}

// Capitalize first letter for aesthetic purposes in form
function capitalizeFirstLetter(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/*
*  NOTE: factory method where propertyKey follows naming convention: Capitalized Prop + Capitalized NestedProp
*  Example: {prop: axis, nestedProp: orient} translates to "AxisOrient"
*/
function generateSchema(prop: string, nestedProp: string, uiSchema: any, propTab: string,
                        schemaEnum?: any): PropertyEditorSchema {
  prop = capitalizeFirstLetter(prop);
  console.log("PROPTAB", propTab);
  nestedProp = nestedProp ? capitalizeFirstLetter(nestedProp) : nestedProp;
  const propertyKey = nestedProp ? prop + nestedProp : prop;
  const schema: PropertyEditorFormatSchema = {
    type: "object",
    properties: {}
  };
  const title = nestedProp ? nestedProp : prop;
  schema.properties[propertyKey] = {
    "type": "string",
    "title": propTab !== 'Common' ? nestedProp ? nestedProp : prop : nestedProp ? prop + ' ' + nestedProp : prop
  };
  if (schemaEnum) {
    schema.properties[propertyKey]["enum"] = schemaEnum;
  }
  console.log(schema);
  console.log(uiSchema);
  return {
    schema: schema,
    uiSchema: uiSchema
  };
}

// NOTE: Each Nested Property requires its own UISCHEMA object

// Reuse for any UISCHEMA with Select element
const SELECT_UISCHEMA = {
  "ui:widget": "select",
  "ui:placeholder": "auto",
  "ui:emptyValue": "auto"
};

// Reuse for any element with Input Text element
const TEXT_UISCHEMA = {
  "ui:autofocus": true,
  "ui:emptyValue": ""
};

const AXIS_TITLE_UISCHEMA = {
  "AxisTitle": TEXT_UISCHEMA
};

const AXIS_ORIENT_UISCHEMA = {
  "AxisOrient": SELECT_UISCHEMA
};

const SCALE_TYPE_UISCHEMA = {
  "ScaleType": SELECT_UISCHEMA
};

const STACK_UISCHEMA = {
  "Stack": SELECT_UISCHEMA
};

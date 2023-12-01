import { PropertyValue } from './types/CssDeclarations';

// A CSS value that can be used both as a property value, or an argument to a function
export abstract class Expression implements PropertyValue {
  constructor(readonly css: string) {}

  get important(): PropertyValue {
    return { css: this.css + '!important' };
  }
}

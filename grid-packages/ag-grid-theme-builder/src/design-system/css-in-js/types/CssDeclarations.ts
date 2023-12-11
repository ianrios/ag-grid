import * as css from 'csstype';

declare const propertyValueBrand: unique symbol;

export type PropertyValue = {
  readonly css: string;
};

// Built-in, non RTL-aware CSS directional properties
type NativeDirectionalProperty =
  | 'right'
  | 'bottom'
  // extract keys of StandardProperties that contain directional substrings
  | {
      [K in keyof css.StandardProperties]-?: K extends `${infer _prefix}${
        | 'Left'
        | 'Right'}${infer _suffix}`
        ? K
        : never;
    }[keyof css.StandardProperties];

type RTLAwareSide = 'AlwaysLeft' | 'AlwaysRight' | 'Leading' | 'Trailing';

// Our own RTL-aware versions of the directional properties
type RTLAwareDeclarations = Partial<
  Record<'alwaysLeft', css.Property.Left> &
    Record<'alwaysRight', css.Property.Right> &
    Record<'leading', css.Property.Left> &
    Record<'trailing', css.Property.Right> &
    Record<`border${RTLAwareSide}`, css.Property.BorderLeft> &
    Record<`border${RTLAwareSide}Style`, css.Property.BorderLeftStyle> &
    Record<`border${RTLAwareSide}Width`, css.Property.BorderLeftWidth> &
    Record<`border${RTLAwareSide}Color`, css.Property.BorderLeftColor> &
    Record<`margin${RTLAwareSide}`, css.Property.MarginLeft> &
    Record<`padding${RTLAwareSide}`, css.Property.PaddingLeft> &
    Record<`scrollMargin${RTLAwareSide}`, css.Property.ScrollMarginLeft> &
    Record<`scrollSnapMargin${RTLAwareSide}`, css.Property.ScrollMarginLeft> &
    Record<`scrollPadding${RTLAwareSide}`, css.Property.ScrollPaddingLeft>
>;

type AllowObjectPropertyValues<T> = { [K in keyof T]: T[K] | PropertyValue };

export type CssDeclarations = AllowObjectPropertyValues<
  Omit<css.StandardProperties, NativeDirectionalProperty>
> &
  AllowObjectPropertyValues<RTLAwareDeclarations> & {
    /**
     * @deprecated 'left' is not supported, use 'leading' to flip the side in right-to-left mode (this is normally correct) or 'alwaysLeft' in the rare cases were you always want the same side
     */
    left?: never;
    /**
     * @deprecated 'right' is not supported, use 'trailing' to flip the side in right-to-left mode (this is normally correct) or 'alwaysRight' in the rare cases were you always want the same side
     */
    right?: never;
    /**
     * @deprecated 'paddingLeft' is not supported, use 'paddingTrailing' to flip the side in right-to-left mode (this is normally correct) or 'paddingAlwaysLeft' in the rare cases were you always want the same side
     */
    paddingLeft?: never;
    /**
     * @deprecated 'paddingRight' is not supported, use 'paddingLeading' to flip the side in right-to-left mode (this is normally correct) or 'paddingAlwaysRight' in the rare cases were you always want the same side
     */
    paddingRight?: never;
    /**
     * @deprecated 'marginLeft' is not supported, use 'marginTrailing' to flip the side in right-to-left mode (this is normally correct) or 'marginAlwaysLeft' in the rare cases were you always want the same side
     */
    marginLeft?: never;
    /**
     * @deprecated 'marginRight' is not supported, use 'marginLeading' to flip the side in right-to-left mode (this is normally correct) or 'marginAlwaysRight' in the rare cases were you always want the same side
     */
    marginRight?: never;
    /**
     * @deprecated 'borderLeft' is not supported, use 'borderTrailing' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysLeft' in the rare cases were you always want the same side
     */
    borderLeft?: never;
    /**
     * @deprecated 'borderLeftStyle' is not supported, use 'borderLeadingStyle' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysLeftStyle' in the rare cases were you always want the same side
     */
    borderLeftStyle?: never;
    /**
     * @deprecated 'borderLeftWidth' is not supported, use 'borderLeadingWidth' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysLeftWidth' in the rare cases were you always want the same side
     */
    borderLeftWidth?: never;
    /**
     * @deprecated 'borderLeftColor' is not supported, use 'borderLeadingColor' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysLeftColor' in the rare cases were you always want the same side
     */
    borderLeftColor?: never;
    /**
     * @deprecated 'borderRight' is not supported, use 'borderLeading' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysRight' in the rare cases were you always want the same side
     */
    borderRight?: never;
    /**
     * @deprecated 'borderRightStyle' is not supported, use 'borderTrailingStyle' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysRightStyle' in the rare cases were you always want the same side
     */
    borderRightStyle?: never;
    /**
     * @deprecated 'borderRightWidth' is not supported, use 'borderTrailingWidth' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysRightWidth' in the rare cases were you always want the same side
     */
    borderRightWidth?: never;
    /**
     * @deprecated 'borderRightColor' is not supported, use 'borderTrailingColor' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysRightColor' in the rare cases were you always want the same side
     */
    borderRightColor?: never;
  };

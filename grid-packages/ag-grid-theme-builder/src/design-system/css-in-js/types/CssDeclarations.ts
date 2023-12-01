type Sides = 'Top' | 'Bottom' | 'AlwaysLeft' | 'AlwaysRight' | 'Leading' | 'Trailing';

type Property =
  | 'alignItems'
  | 'alignSelf'
  | 'alwaysLeft'
  | 'alwaysRight'
  | 'animationDirection'
  | 'animationDuration'
  | 'animationIterationCount'
  | 'animationName'
  | 'animationTimingFunction'
  | 'appearance'
  | 'backgroundColor'
  | 'backgroundImage'
  | 'backgroundPositionX'
  | 'backgroundPositionY'
  | 'backgroundRepeat'
  | `border${Sides}`
  | `border${Sides}Style`
  | `border${Sides}Width`
  | `border${Sides}Color`
  | 'bottom'
  | 'boxShadow'
  | 'boxSizing'
  | 'breakInside'
  | 'color'
  | 'colorScheme'
  | 'content'
  | 'cursor'
  | 'direction'
  | 'display'
  | 'flexBasis'
  | 'flexDirection'
  | 'flexGrow'
  | 'flexWrap'
  | 'fontFamily'
  | 'fontSize'
  | 'fontStyle'
  | 'fontVariant'
  | 'fontWeight'
  | 'gap'
  | 'height'
  | 'justifyContent'
  | 'lineHeight'
  | 'leading'
  | `margin${Sides}`
  | 'maxHeight'
  | 'maxWidth'
  | 'minHeight'
  | 'minWidth'
  | 'opacity'
  | 'order'
  | 'outline'
  | 'overflowX'
  | 'overflowY'
  | `padding${Sides}`
  | 'pointerEvents'
  | 'position'
  | 'resize'
  | 'scrollbarWidth'
  | 'speak'
  | 'src'
  | 'textAlign'
  | 'textOverflow'
  | 'textTransform'
  | 'top'
  | 'trailing'
  | 'transform'
  | 'transitionTimingFunction'
  | 'userSelect'
  | 'verticalAlign'
  | 'visibility'
  | 'whiteSpace'
  | 'WebkitOverflowScrolling'
  | 'MsOverflowStyle'
  | 'MozAppearance'
  | 'width'
  | 'wordBreak'
  | 'writingMode'
  | 'zIndex';

type ShorthandProperty = 'background' | 'flex' | 'overflow' | 'transition' | 'backgroundSize';

type RtlSensitiveProperty =
  | 'border'
  | `borderStyle`
  | 'borderWidth'
  | 'borderColor'
  | 'margin'
  | 'padding';

declare const propertyValueBrand: unique symbol;

export type PropertyValue = {
  readonly css: string;
  // this prevents PropertyValue from being assigned to a SelectorValue e.g. {rootWrapper: rgb()}
  readonly [propertyValueBrand]?: true;
};

export type CssPropertiesValue = PropertyValue | readonly PropertyValue[] | null | undefined;
export type CssPropertiesRecord = Record<string, CssPropertiesValue>;

export type CssDeclarations = Partial<
  {
    readonly [K in Property]: PropertyValue | null | undefined;
  } & {
    readonly [K in ShorthandProperty]:
      | PropertyValue
      // array with at least one element
      | [PropertyValue, ...PropertyValue[]]
      | null
      | undefined;
  } & {
    readonly [K in RtlSensitiveProperty]:
      | PropertyValue
      | readonly [PropertyValue, PropertyValue]
      | readonly [PropertyValue, PropertyValue, PropertyValue]
      // we ban the 4-element e.g. for 'padding: 10px 20px 30px 40px' because
      // it applies different left and right padding without being ltr
      // sensitive. Instead it is required to use the rtl sensitive versions
      // e.g. paddingLeading and paddingTrailing api
      | null
      | undefined;
  } & {
    /**
     * @deprecated Left and right properties are not supported, use e.g. paddingLeading and paddingTrailing if you need to reverse the size in right-to-left mode (you normally do), and paddingAlwaysLeft / paddingAlwaysRight
     */
    /**
     * @deprecated 'left' is not supported, use 'leading' to flip the side in right-to-left mode (this is normally correct) or 'alwaysLeft' in the rare cases were you always want the same side
     */
    left: never;
    /**
     * @deprecated 'right' is not supported, use 'trailing' to flip the side in right-to-left mode (this is normally correct) or 'alwaysRight' in the rare cases were you always want the same side
     */
    right: never;
    /**
     * @deprecated 'paddingLeft' is not supported, use 'paddingTrailing' to flip the side in right-to-left mode (this is normally correct) or 'paddingAlwaysLeft' in the rare cases were you always want the same side
     */
    paddingLeft: never;
    /**
     * @deprecated 'paddingRight' is not supported, use 'paddingLeading' to flip the side in right-to-left mode (this is normally correct) or 'paddingAlwaysRight' in the rare cases were you always want the same side
     */
    paddingRight: never;
    /**
     * @deprecated 'marginLeft' is not supported, use 'marginTrailing' to flip the side in right-to-left mode (this is normally correct) or 'marginAlwaysLeft' in the rare cases were you always want the same side
     */
    marginLeft: never;
    /**
     * @deprecated 'marginRight' is not supported, use 'marginLeading' to flip the side in right-to-left mode (this is normally correct) or 'marginAlwaysRight' in the rare cases were you always want the same side
     */
    marginRight: never;
    /**
     * @deprecated 'borderLeft' is not supported, use 'borderTrailing' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysLeft' in the rare cases were you always want the same side
     */
    borderLeft: never;
    /**
     * @deprecated 'borderLeftStyle' is not supported, use 'borderLeadingStyle' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysLeftStyle' in the rare cases were you always want the same side
     */
    borderLeftStyle: never;
    /**
     * @deprecated 'borderLeftWidth' is not supported, use 'borderLeadingWidth' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysLeftWidth' in the rare cases were you always want the same side
     */
    borderLeftWidth: never;
    /**
     * @deprecated 'borderLeftColor' is not supported, use 'borderLeadingColor' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysLeftColor' in the rare cases were you always want the same side
     */
    borderLeftColor: never;
    /**
     * @deprecated 'borderRight' is not supported, use 'borderLeading' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysRight' in the rare cases were you always want the same side
     */
    borderRight: never;
    /**
     * @deprecated 'borderRightStyle' is not supported, use 'borderTrailingStyle' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysRightStyle' in the rare cases were you always want the same side
     */
    borderRightStyle: never;
    /**
     * @deprecated 'borderRightWidth' is not supported, use 'borderTrailingWidth' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysRightWidth' in the rare cases were you always want the same side
     */
    borderRightWidth: never;
    /**
     * @deprecated 'borderRightColor' is not supported, use 'borderTrailingColor' to flip the side in right-to-left mode (this is normally correct) or 'borderAlwaysRightColor' in the rare cases were you always want the same side
     */
    borderRightColor: never;
  }
>;

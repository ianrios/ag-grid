import { styled } from '@mui/system';
import { UIDropdownButton } from 'components/UIDropdownButton';
import { ColorSwatch } from './ColorSwatch';
import { TabbedColorEditor } from './TabbedColorEditor';
import {
  colorValueToCssExpression,
  reinterpretCssColorExpression,
  rgbaToHex,
} from './color-editor-utils';

export type ColorEditorProps = {
  value: string | number;
  onChange: (value: string) => void;
};

export const ColorEditor = ({ value, onChange }: ColorEditorProps) => {
  const cssValue = colorValueToCssExpression(value);
  const rgba = reinterpretCssColorExpression(cssValue);

  let label: string;
  if (rgba == null) {
    label = 'none';
  } else if (rgba.a === 0) {
    label = 'transparent';
  } else if (typeof value === 'number') {
    label = Math.round(value * 100) + '% foreground';
  } else if (rgba.a < 1) {
    label = rgbaToHex({ ...rgba, a: 1 }) + ` / ${Math.round(rgba.a * 100)}%`;
  } else {
    label = rgbaToHex(rgba);
  }

  return (
    <UIDropdownButton
      dropdownContent={<TabbedColorEditor initialValue={value} onChange={onChange} />}
    >
      <SmallColorSwatch color={cssValue} />
      {label}
    </UIDropdownButton>
  );
};

const SmallColorSwatch = styled(ColorSwatch)`
  width: 20px;
  height: 20px;
`;

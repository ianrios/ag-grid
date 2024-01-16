import { styled } from '@mui/system';
import { UIDropdownButton } from 'components/UIDropdownButton';
import { ColorSwatch } from './ColorSwatch';
import { RGBAColor } from './RGBAColor';
import { TabbedColorEditor } from './TabbedColorEditor';
import { colorValueToCssExpression } from './color-editor-utils';

export type ColorEditorProps = {
  value: string | number;
  onChange: (value: string | number) => void;
  preventTransparency?: boolean;
};

export const ColorEditor = ({ value, onChange, preventTransparency }: ColorEditorProps) => {
  const cssValue = colorValueToCssExpression(value);
  const rgba = RGBAColor.reinterpretCss(cssValue);

  let label: string;
  if (rgba == null) {
    label = 'none';
  } else if (rgba.a === 0) {
    label = 'transparent';
  } else if (typeof value === 'number') {
    label = Math.round(value * 100) + '% foreground';
  } else if (rgba.a < 1) {
    label = rgba.withAlpha(1).toCSSHex() + ` / ${Math.round(rgba.a * 100)}%`;
  } else {
    label = rgba.toCSSHex();
  }

  return (
    <UIDropdownButton
      dropdownContent={
        <TabbedColorEditor
          initialValue={value}
          onChange={onChange}
          preventTransparency={preventTransparency}
        />
      }
    >
      <SmallColorSwatch color={cssValue} />
      {label}
    </UIDropdownButton>
  );
};

const SmallColorSwatch = styled(ColorSwatch)`
  width: 20px;
  height: 20px;
  border-radius: 4px;
`;

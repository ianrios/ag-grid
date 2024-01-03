import { HexAlphaColorPicker } from 'react-colorful';

export type ColorEditorProps = {
  value: string | number;
  onChange: (value: string) => void;
};

export const ColorEditor = ({ value, onChange }: ColorEditorProps) => {
  if (typeof value === 'number') {
    value = '#000000' + value.toString(16).padStart(2, '0');
  }
  if (value.length === 7) {
    value += 'ff';
  }
  return <HexAlphaColorPicker color={value} onChange={onChange} />;
};

// background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>')

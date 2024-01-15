import { Eyedropper } from '@carbon/icons-react';
import { Button, Stack, Typography } from '@mui/joy';
import { useChangeHandler } from 'components/component-utils';
import { useState } from 'react';
import { ColorSwatch } from './ColorSwatch';
import { UncontrolledColorEditorProps, colorValueToCssExpression } from './color-editor-utils';

export const EyedropperColorEditor = ({ initialValue, onChange }: UncontrolledColorEditorProps) => {
  const [value, setValue] = useState(() => colorValueToCssExpression(initialValue));
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  useChangeHandler(value, onChange);

  const EyeDropper = window.EyeDropper;

  if (!EyeDropper) {
    return (
      <Stack>
        <Typography level="body-sm">
          Your browser does not support the EyeDropper API. In{' '}
          <a href="https://caniuse.com/?search=eyedropper" rel="noreferrer" target="_blank">
            supported browsers
          </a>{' '}
          this allows you to pick colours from your website or design.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack>
      <ColorSwatch color={colorValueToCssExpression(value)} height={60} />
      <Button
        variant="soft"
        startDecorator={<Eyedropper />}
        onClick={() => {
          setError(false);
          setOpen(true);
          new EyeDropper()
            .open()
            .then(({ sRGBHex }) => setValue(sRGBHex))
            .catch(() => setError(true));
        }}
      >
        pick color
      </Button>

      <Typography level="body-sm">
        {open
          ? 'Click anywhere on your screen to select that colour, or hit ESC to cancel'
          : 'Use this tool to pick colours from your website or design.'}
      </Typography>
    </Stack>
  );
};

import { Eyedropper, Percentage, SettingsAdjust } from '@carbon/icons-react';
import { Tab, TabList, TabPanel, Tabs } from '@mui/joy';
import { useState } from 'react';
import { EyedropperColorEditor } from './EyedropperColorEditor';
import { InputColorEditor } from './InputColorEditor';
import { VarColor } from './VarColor';
import { VarColorEditor } from './VarColorEditor';
import { UncontrolledColorEditorProps } from './color-editor-utils';

type TabbedColorEditorProps = UncontrolledColorEditorProps & { preventTransparency?: boolean };

export const TabbedColorEditor = (props: TabbedColorEditorProps) => {
  const [tab, setTab] = useState<string | number | null>(() =>
    VarColor.parseCss(props.initialValue) ? 'var' : 'input',
  );

  return (
    <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
      <TabList>
        <Tab value="input">
          <SettingsAdjust />
        </Tab>
        <Tab value="var">
          <Percentage />
        </Tab>
        <Tab value="eyedropper">
          <Eyedropper />
        </Tab>
      </TabList>
      <TabPanel value="input">
        <InputColorEditor {...props} />
      </TabPanel>
      <TabPanel value="var">
        <VarColorEditor {...props} />
      </TabPanel>
      <TabPanel value="eyedropper">
        <EyedropperColorEditor {...props} />
      </TabPanel>
    </Tabs>
  );
};

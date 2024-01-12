import { Eyedropper, Percentage, SettingsAdjust, Sigma } from '@carbon/icons-react';
import { Tab, TabList, TabPanel, Tabs } from '@mui/joy';
import { InputColorEditor } from './InputColorEditor';
import { UncontrolledColorEditorProps } from './color-editor-utils';

export const TabbedColorEditor = (props: UncontrolledColorEditorProps) => (
  <Tabs defaultValue="input">
    <TabList>
      <Tab value="input">
        <SettingsAdjust />
      </Tab>
      <Tab value="percent-foreground">
        <Percentage />
      </Tab>
      <Tab value="mix">
        <Sigma />
      </Tab>
      <Tab value="eyedropper">
        <Eyedropper />
      </Tab>
    </TabList>
    <TabPanel value="input">
      <InputColorEditor {...props} />
    </TabPanel>
    <TabPanel value="percent-foreground">RGB panel</TabPanel>
    <TabPanel value="mix">HSL panel</TabPanel>
    <TabPanel value="eyedropper">Eyedropper</TabPanel>
  </Tabs>
);

import { Eyedropper, Percentage, SettingsAdjust, Sigma } from '@carbon/icons-react';
import { Tab, TabList, TabPanel, Tabs } from '@mui/joy';
import { useState } from 'react';
import { InputColorEditor } from './InputColorEditor';
import { PercentColorEditor } from './PercentColorEditor';
import { UncontrolledColorEditorProps } from './color-editor-utils';

export const TabbedColorEditor = (props: UncontrolledColorEditorProps) => {
  const [tab, setTab] = useState<string | number | null>(() => getDefaultTab(props.initialValue));
  return (
    <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)}>
      <TabList>
        <Tab value="input">
          <SettingsAdjust />
        </Tab>
        <Tab value="percent">
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
      <TabPanel value="percent">
        <PercentColorEditor {...props} />
      </TabPanel>
      <TabPanel value="mix">Mix panel</TabPanel>
      <TabPanel value="eyedropper">Eyedropper</TabPanel>
    </Tabs>
  );
};

const getDefaultTab = (value: string | number): string => {
  if (typeof value === 'number') {
    return 'percent';
  }
  // TODO detect mix formula and show mix tab
  return 'input';
};

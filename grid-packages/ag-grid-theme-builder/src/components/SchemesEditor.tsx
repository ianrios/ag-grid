import { Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy';

export const SchemesEditor = () => {
  /*
  TODO:
    - Render the current selected item in the menu button
    - Add a dropdown caret from carbon icons
   */
  // tmop hard coded props
  return (
    <Dropdown>
      <MenuButton>Format</MenuButton>
      <Menu>
        <MenuItem>…</MenuItem>…
      </Menu>
    </Dropdown>
  );
};

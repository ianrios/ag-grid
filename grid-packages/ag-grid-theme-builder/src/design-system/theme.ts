import { ThemePart } from './design-system-types';
import { combineThemeParts } from './design-system-utils';
import { commonStructural, reset } from './parts';

export type Theme = {
  name: string;
};

export const installTheme = (theme: Theme, parts: ThemePart[]) => {
  addOrUpdateStyle('common', commonStructural());

  const themeName = theme.name;
  if (/^(\.|ag-)/.test(themeName) || !/^\w+(-\w+)*$/.test(themeName)) {
    throw new Error('Invalid theme name, use kebab-case and do not include the `ag-theme` prefix');
  }

  let { css, variables } = combineThemeParts([reset(), ...parts]);

  css +=
    '\n:ag-current-theme {\n' +
    Object.entries(variables)
      .map(([name, value]) => `\t${name}: ${value};`)
      .join('\n') +
    '\n}';

  css = css.replaceAll(':ag-current-theme', `.ag-theme-${themeName}`);

  addOrUpdateStyle(`theme-${themeName}`, css);
};

const addOrUpdateStyle = (id: string, css: string) => {
  id = `ag-injected-style-${id}`;
  const head = document.querySelector('head');
  if (!head) throw new Error("Can't inject theme before document head is created");
  let style = head.querySelector(`#${id}`) as HTMLStyleElement;
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('id', id);
    style.setAttribute('data-ag-injected-style', '');
    const others = document.querySelectorAll('head [data-ag-injected-style]');
    if (others.length > 0) {
      const lastOther = others[others.length - 1];
      if (lastOther.nextSibling) {
        head.insertBefore(style, lastOther.nextSibling);
      } else {
        head.appendChild(style);
      }
    } else {
      head.insertBefore(style, head.firstChild);
    }
  }
  style.textContent = css;
};

import { borders, colorScheme, commonStructural, quartzIcons, reset } from './styles';

export type Theme = {
  name: string;
};

export const installTheme = (theme: Theme) => {
  inject('common', commonStructural);

  const themeName = theme.name;
  if (/^(\.|ag-)/.test(themeName) || !/^\w+(-\w+)*$/.test(themeName)) {
    throw new Error('Invalid theme name, use kebab-case and do not include the `ag-theme` prefix');
  }

  const themeCss = [
    reset(),
    colorScheme(),
    quartzIcons({ color: '#000', iconSize: 16, strokeWidth: 1.5 }),
    borders({
      belowHeaders: false,
    }),
  ]
    .join('\n\n')
    .replaceAll(':ag-current-theme', `.ag-theme-${themeName}`);

  inject(`theme-${themeName}`, () => themeCss);
};

const inject = (id: string, generate: () => string) => {
  id = `ag-injected-style-${id}`;
  const head = document.querySelector('head');
  if (!head) throw new Error("Can't inject theme before document head is created");
  let style = head.querySelector(`#${id}`) as HTMLStyleElement;
  const existing = !!style;
  if (!existing) {
    style = document.createElement('style');
    style.setAttribute('id', id);
    style.dataset.agInjectedStyle = '';
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
  style.textContent = generate();
};

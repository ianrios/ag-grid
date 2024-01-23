const agNameToLucideName = {
  aggregation: 'sigma',
  arrows: 'move',
  asc: 'arrow-up',
  cancel: 'x-circle',
  chart: 'bar-chart-2',
  'color-picker': 'paint-bucket',
  columns: 'table-2',
  contracted: 'chevron-right',
  copy: 'copy',
  cross: 'x',
  csv: 'file-spreadsheet',
  cut: 'scissors',
  desc: 'arrow-down',
  down: 'arrow-down',
  excel: 'file-spreadsheet',
  expanded: 'chevron-left',
  'eye-slash': 'eye-off',
  eye: 'eye',
  filter: 'list-filter',
  first: 'chevron-first',
  group: 'list-start',
  last: 'chevron-last',
  left: 'arrow-left',
  linked: 'link-2',
  loading: 'loader',
  maximize: 'maximize-2',
  menu: 'menu',
  minimize: 'minimize-2',
  minus: 'minus-circle',
  next: 'chevron-right',
  none: 'chevrons-up-down',
  'not-allowed': 'ban',
  paste: 'clipboard-paste',
  pin: 'pin',
  pivot: 'table-properties',
  plus: 'plus-circle',
  previous: 'chevron-left',
  right: 'arrow-right',
  save: 'arrow-down-to-line',
  'small-down': 'chevron-down',
  'small-left': 'chevron-left',
  'small-right': 'chevron-right',
  'small-up': 'chevron-up',
  tick: 'check',
  'tree-closed': 'chevron-down',
  'tree-indeterminate': 'minus',
  'tree-open': 'chevron-down',
  unlinked: 'link-2-off',
  up: 'arrow-up',
};

const agNameToSvgContent = {
  grip: '<circle cx="5" cy="8" r="0.5"/><circle cx="12" cy="8" r="0.5"/><circle cx="19" cy="8" r="0.5"/><circle cx="5" cy="16" r="0.5"/><circle cx="12" cy="16" r="0.5"/><circle cx="19" cy="16" r="0.5"/>',
};

const lucide = require('lucide');

let result = 'export const agIconNameToSvgFragment: Record<string, string | undefined> = {\n';
for (const [agName, lucideName] of Object.entries(agNameToLucideName)) {
  const lucideNameTitleCase = lucideName.replaceAll(/(^\w|-\w)/g, (s) =>
    s.replace('-', '').toUpperCase(),
  );
  const icon = lucide[lucideNameTitleCase];
  if (!icon) {
    throw new Error(`Can't find lucide icon ${lucideNameTitleCase} for ag icon ${agName}`);
  }
  /*
  Example icon content
  [
    "svg", // always svg
    defaultAttributes, // always the same attributes
    [
      // svg elements, [nodeName, attributes]
      ["path", { d: "M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" }],
      ["polygon", { points: "12 15 17 21 7 21 12 15" }]
    ]
  ]
   */
  let svg = '';
  for (const [elementName, attributes] of icon[2]) {
    svg += `<${elementName}`;
    for (const [attrName, attrValue] of Object.entries(attributes)) {
      svg += ` ${attrName}="${escapeXml(attrValue)}"`;
    }
    svg += `/>`;
  }
  result += `  "${agName}": ${JSON.stringify(svg)},\n`;
}
for (const [agName, svgContent] of Object.entries(agNameToSvgContent)) {
  result += `  "${agName}": ${JSON.stringify(svgContent)},\n`;
}
result += '}\n';

const fs = require('fs');
const path = require('path');
fs.writeFileSync(path.join(__dirname, 'lucide-fragments.ts'), result);

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
    }
  });
}

import { QuartzIconsParams } from 'design-system/parts';
import { titleCase } from 'model/utils';
import { SchemePreset } from '../schemes-types';

export const QuartzIconsPresetPreview = (props: SchemePreset<QuartzIconsParams>) => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={(props.params.strokeWidth * 24) / 16}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={(props.params.strokeWidth * 24) / 16}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 12H3" />
      <path d="M16 18H3" />
      <path d="M10 6H3" />
      <path d="M21 18V8a2 2 0 0 0-2-2h-5" />
      <path d="m16 8-2-2 2-2" />
    </svg>
    {titleCase(props.id)}
  </>
);

import { CellCtrl } from 'ag-grid-community';
import { Setter } from 'solid-js';
import { RenderDetails } from './common';
declare const ShowRenderDetails: (props: {
    showDetails: RenderDetails;
    ref: any;
    showCellWrapper: boolean;
    showTools: boolean;
    includeDndSource: boolean;
    includeRowDrag: boolean;
    includeSelection: boolean;
    setSelectionCheckboxId: Setter<string | undefined>;
    cellCtrl: CellCtrl;
    cellInstanceId: string;
    setECellValue: (eCellValue: HTMLElement) => void;
}) => import("solid-js").JSX.Element;
export default ShowRenderDetails;

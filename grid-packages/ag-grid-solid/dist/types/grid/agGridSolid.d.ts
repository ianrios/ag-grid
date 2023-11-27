import { ColumnApi, GridApi, GridOptions, Module } from 'ag-grid-community';
export interface AgGridSolidRef {
    api: GridApi;
    /** @deprecated v31 - The `columnApi` has been deprecated and all the methods are now present of the `api`. */
    columnApi: ColumnApi;
}
export interface AgGridSolidProps extends GridOptions {
    gridOptions?: GridOptions;
    ref?: AgGridSolidRef | ((ref: AgGridSolidRef) => void);
    modules?: Module[];
    class?: string;
}
export interface PortalInfo {
    mount: HTMLElement;
    SolidClass: any;
    props: any;
    ref: (instance: any) => void;
}
export interface PortalManager {
    addPortal(info: PortalInfo): void;
    removePortal(info: PortalInfo): void;
}
declare const AgGridSolid: (props: AgGridSolidProps) => import("solid-js").JSX.Element;
export default AgGridSolid;

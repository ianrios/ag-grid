---
title: "React Best Practices"
frameworks: ["react"]
---

This page explains best practices for using React Hooks with AG Grid.

## Row Data

When setting Row Data, we recommend using `useState` to maintain a consistent array reference across renders. 

```jsx
const App = () => {
    const [rowData, setRowData] = useState([
        {make: "Toyota", model: "Celica", price: 35000},
        {make: "Ford", model: "Mondeo", price: 32000},
        {make: "Porsche", model: "Boxster", price: 72000}
    ]);

    return <AgGridReact rowData={rowData} />;
};
```

If you do NOT use `useState` and define the row data array within your component, then the grid will be provided with a new array each time
the component is rendered. This will result in additional grid renders and may result in unexpected behaviour in the grid, such as row selection resetting.

For applications that do not update rowData then `useMemo` is a valid alternative to `useState`.

### Immutable Data

If your application updates row data then it is strongly recommended to implement the `getRowId` callback. The `getRowId` callback returns a unique id for each row enabling the grid to maintain row state between updates. For example, if rows are selected and then the row data is updated, the grid is able to use the unique ids provided to maintain the current selection.

See [Updating Row Data](/data-update-row-data/) for more information and other benefits of providing the `getRowId` callback.

## Column Definitions

When setting Column Definitions, we recommend using `useState` or `useMemo`.

```jsx
const App = () => {
    const [columnDefs, setColumnDefs] = useState([
        {field: 'make'},
        {field: 'model'},
    ]);

    return <AgGridReact columnDefs={columnDefs} />;
};
```

If you do NOT use `useState` or `useMemo`, then the grid will be provided with a new set of Column Definitions **every time**
the component is rendered. This may result in unexpected behaviour in the grid, such as the column state 
(column order, width etc...) getting reset to match the column definitions provided.

<note>
If your application changes Column Definitions use `useState`, otherwise use `useMemo`.
</note>

## Object Properties

For all properties that are Objects, e.g. `defaultColDef`, `sideBar` and `statusBar`, we recommend `useState` or `useMemo`. If
you do not use these hooks, then you risk resetting the grid's state each time a render occurs. 

For example, when providing a `defaultColDef` property do not define this inline or as a simple object on the component as this will result in a new instance on every render.

```jsx
const App = () => {
    // BAD - new instance on every render
    const defaultColDef = { filter: true };

    // BAD - new instance on every render
    return <AgGridReact defaultColDef={{filter: true}} />;
};
```

Instead use `useMemo` or `useState` to ensure a consistent reference is maintained across renders.

```jsx
const App = () => {
    // GOOD - only one instance created
    const defaultColDef = useMemo( ()=> { filter: true }, []);

    return <AgGridReact defaultColDef={defaultColDef} />;
};
```
## Simple Properties

Properties of simple types (string, boolean and number) do not need to use hooks as they are compared by value across renders. 

```jsx
const App = () => {

    const rowBuffer = 0;
    const rowSelection = 'multiple';

    return (
        <AgGridReact 
            // GOOD
            rowBuffer={rowBuffer} 
            rowSelection={rowSelection} 

            // GOOD
            rowModelType='clientSide'
            rowHeight={50}
            />
    );
};
```

## Callbacks 

For [Grid Options](/grid-options/) that accept functions, i.e `isRowSelectable` we strongly recommend you use `useCallback` to avoid resetting grid state on every render. For example, if you do not use a callback for `isRowSelectable` then on every render the grid will receive a new function and have to re-run selection logic.

When using `useCallback()`, make sure you set correct dependencies in order to avoid stale closures.

```jsx
const App = () => {
    const [count, setCount] = useState(0);

    // BAD will re-run selection logic on every render
    const isRowSelectable = (node) => node.data.value > count;

    // GOOD will only re-run selection logic when count changes
    const isRowSelectable = useCallback((node) => node.data.value > count, [count]);

    return <AgGridReact isRowSelectable={isRowSelectable} />;
};
```

## Event Listeners

For [Event Listeners](/grid-events/) there is no requirement to use `useCallback` as event handlers do not trigger updates within the grid. However, you may find it easier to be consistent with Callbacks and just always use `useCallback`.

If you do use `useCallback()`, make sure you set correct dependencies in order to avoid stale closures.

```jsx
const App = () => {
    const [clickedCount, setClickedCount] = useState(0);

    // GOOD callback, no hook, no stale data
    const onCellClicked = () => setClickedRow(clickedCount++);

    // BAD callback - stale data, dependency missing, will ALWAYS print 0
    const onCellValueChanged = useCallback( ()=> {
        console.log(`number of clicks is ${clickedCount}`);
    }, []);

    // GOOD callback, no stale data
    const onFilterOpened = useCallback( ()=> {
        console.log(`number of clicks is ${clickedCount}`);
    }, [clickedCount]);

    return <AgGridReact 
                onCellClicked={onCellClicked} 
                onCellValueChanged={onCellValueChanged}
                onFilterOpened={onFilterOpened}
            />;
};
```

## Components

Custom Components can be referenced by Name or Direct Reference, see [Registering Components](/components/). When providing a Direct Reference to the component AG Grid will avoid most unnecessary renders. However, if your component is rendered more than you expect, it may help to wrap it with `memo`.

```jsx
const MyCellRenderer = p => <span>{p.value}</span>;

const App = () => {
    const [columnDefs] = useState([

        // reference the Cell Renderer above
        { field: 'make', cellRenderer: MyCellRenderer },
        
        // or put inline
        { field: 'model', cellRenderer: p => <span>{p.value}</span> },

        // optionally for best performance, memo() the renderer,
        { field: 'price', cellRenderer: memo(MyCellRenderer) }
    ]);

    return <AgGridReact columnDefs={columnDefs} />;
};
```

## Debug Mode

A good way to diagnose if you are causing the grid to update on each render is to enable the `debug` flag. In debug mode the grid will log extra details to the console including when a property has changed.

```jsx
const App = () => {
    return <AgGridReact debug />;
};
```

For example if you have defined `defaultColDef` inline on your component then on every render you will see the following in the console with `debug` enabled.

```jsx
const App = () => {
    return <AgGridReact defaultColDef={{ filter: true}} debug />;
};
```

```bash
AG Grid: Updated property defaultColDef from  {filter: true}  to   {filter: true}
```

If there is no real difference between the old and new value then you should consider using `useState`, `useMemo` or `useCallback` as detailed above.
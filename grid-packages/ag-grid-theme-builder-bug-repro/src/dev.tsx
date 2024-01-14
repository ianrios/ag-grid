import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './main.scss';

const root = ReactDOM.createRoot(document.getElementById('theme-builder-root') as HTMLElement);
root.render(
    <React.StrictMode>
        <RootContainer />
    </React.StrictMode>
);

let instanceIdCounter = 0;

function RootContainer() {
    const [state] = useState(() => ({ callCount: 0, instanceId: ++instanceIdCounter }));

    useEffect(() => {
        state.callCount++;
        console.log(`instance ${state.instanceId} useEffect called ${state.callCount} times`, state);
        return () => console.log(`instance ${state.instanceId} cleanup`);
    }, []);

    return <div />;
}

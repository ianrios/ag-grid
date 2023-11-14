import classnames from 'classnames';
import React from 'react';
import { Icon } from '../components/Icon';
import { trackDemoToolbar, trackOnceDemoToolbar } from '../utils/analytics';
import styles from './Toolbar.module.scss';
import { createDataSizeValue } from './utils';

const IS_SSR = typeof window === 'undefined';

export const Toolbar = ({ gridRef, dataSize, setDataSize, rowCols, gridTheme, setGridTheme, setCountryColumnPopupEditor }) => {
    function onDataSizeChanged(event) {
        const value = event.target.value;
        setDataSize(value);
        trackDemoToolbar({
            type: 'dataSize',
            value
        });
    }

    function onThemeChanged(event) {
        const newTheme = event.target.value || 'ag-theme-none';
        setCountryColumnPopupEditor(newTheme, gridRef.current.api);
        setGridTheme(newTheme);
        trackDemoToolbar({
            type: 'theme',
            value: newTheme
        });

        if (!IS_SSR) {
            let url = window.location.href;
            if (url.indexOf('?theme=') !== -1) {
                url = url.replace(/\?theme=[\w:-]+/, `?theme=${newTheme}`);
            } else {
                const sep = url.indexOf('?') === -1 ? '?' : '&';
                url += `${sep}theme=${newTheme}`;
            }
            history.replaceState({}, '', url);
        }
    }

    function onFilterChanged(event) {
        gridRef.current.api.setQuickFilter(event.target.value);
        trackOnceDemoToolbar({
            type: 'filterChange',
        })
    }

    return (
        <div className={styles.toolbar}>
            <div className={styles.controlsContainer}>
                <div className={styles.controls}>
                    <label htmlFor="data-size">Data Size:</label>
                    <select id="data-size" onChange={onDataSizeChanged} value={dataSize}>
                        {rowCols.map((rowCol) => {
                            const rows = rowCol[0];
                            const cols = rowCol[1];

                            const value = createDataSizeValue(rows, cols);
                            const text = `${rows} Rows, ${cols} Cols`;
                            return (
                                <option key={value} value={value}>
                                    {text}
                                </option>
                            );
                        })}
                    </select>

                    <label htmlFor="grid-theme">Theme:</label>
                    <select id="grid-theme" onChange={onThemeChanged} value={gridTheme || ''}>
                        <option value="ag-theme-quartz">Quartz (light)</option>
                        <option value="ag-theme-quartz-dark">Quartz (dark)</option>
                        <option value="ag-theme-quartz-dark-blue">Quartz (dark blue)</option>
                        <option value="ag-theme-alpine">Alpine (light)</option>
                        <option value="ag-theme-alpine-dark">Alpine (dark)</option>
                        <option value="ag-theme-balham">Balham (light)</option>
                        <option value="ag-theme-balham-dark">Balham (dark)</option>
                        <option value="ag-theme-material">Material</option>
                    </select>

                    <label htmlFor="global-filter">Filter:</label>
                    <input
                        placeholder="Filter any column..."
                        type="text"
                        onInput={onFilterChanged}
                        id="global-filter"
                        style={{ flex: 1 }}
                    />

                    <a
                        className={styles.videoTour}
                        href="https://youtu.be/bcMvTUVbMvI"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Icon name="youtube" />
                        Take a video tour
                    </a>
                </div>
            </div>
            <div className={styles.scrollIndicator}></div>
        </div>
    );
};

import { ColDef, Grid, GridApi, GridOptions } from '@ag-grid-community/core';
import styled from '@emotion/styled';
import { useCurrentFeature } from 'atoms/currentFeature';
import { useEnabledFeatures } from 'atoms/enabledFeatures';
import { useThemeClass } from 'atoms/theme';
import { useVariableValues } from 'atoms/values';
import { withErrorBoundary } from 'components/ErrorBoundary';
import { installTheme } from 'design-system';
import { getColumnDefs, getGroupColumnDefs, getRowData } from 'model/exampleData';
import { Feature } from 'model/features';
import { isNotNull } from 'model/utils';
import { memo, useEffect, useRef, useState } from 'react';

const variablesRequiringRebuild = [
  '--ag-grid-size',
  '--ag-row-height',
  '--ag-header-height',
  '--ag-list-item-height',
];

const GridPreview = () => {
  const features = useEnabledFeatures();
  const currentFeature = useCurrentFeature();
  const themeClass = useThemeClass();
  const values = useVariableValues();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [api, setApi] = useState<GridApi | null>(null);
  const apiRef = useRef<GridApi | null>(null);

  const featureStateRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    installTheme({ className: 'ag-theme-custom' });
  }, []);

  const rebuildKey = variablesRequiringRebuild
    .map((variableName) => values[variableName])
    .filter(isNotNull)
    .map((value) => value.css)
    .concat(features.map((f) => f.name))
    .join(';');

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const featureState = featureStateRef.current;

    // use the rebuild key to prevent lint errors - actually its job is just to
    // be in the dependencies array and cause the grid to be reinitialized when
    // it changes
    void rebuildKey;

    const options: GridOptions = {
      ...buildGridOptions(features),
      onGridReady: ({ api }) => {
        for (const feature of features) {
          const state = featureState[feature.name];
          if (state != null) {
            feature.restoreState?.(api, state);
          }
        }
        setApi(api);
      },
    };

    // TODO use createGrid after merging spike branch
    const grid = new Grid(wrapperRef.current, options);
    apiRef.current = null;
    setApi(null);

    return () => {
      if (apiRef.current) {
        for (const feature of features) {
          featureState[feature.name] = feature.getState?.(apiRef.current);
        }
      }
      grid.destroy();
    };
  }, [features, rebuildKey]);

  const previousFeatureRef = useRef<Feature | null>(null);
  useEffect(() => {
    if (api && api === apiRef.current) {
      previousFeatureRef.current?.hide?.(api);
      currentFeature?.show?.(api);
      previousFeatureRef.current = currentFeature;
    }
  }, [currentFeature, api]);

  const PreviewComponent = currentFeature?.previewComponent;

  return (
    <>
      <Wrapper
        className={`${themeClass}`}
        ref={wrapperRef}
        style={{ display: PreviewComponent ? 'none' : 'block' }}
      ></Wrapper>
      {PreviewComponent && (
        <Wrapper className={themeClass}>
          <PreviewComponent />
        </Wrapper>
      )}
    </>
  );
};

const GridPreviewWrapped = memo(withErrorBoundary(GridPreview));

export { GridPreviewWrapped as GridPreview };

const Wrapper = styled('div')`
  width: 100%;
  height: 100%;
`;

const buildGridOptions = (features: readonly Feature[]): GridOptions => {
  const defaultColDef: ColDef = {
    sortable: true,
  };
  const columnDefs = getColumnDefs();
  const options: GridOptions = { defaultColDef, columnDefs };
  for (const feature of features) {
    assignOptions(defaultColDef, feature.defaultColDef);
    feature.columnDefs?.forEach((def, i) => assignOptions(columnDefs[i], def));
    assignOptions(options, feature.gridOptions);
  }

  if (features.find((f) => f.addColumnGroups)) {
    options.columnDefs = getGroupColumnDefs(columnDefs);
  }

  return { ...options, rowData: getRowData() };
};

const assignOptions = <T extends object>(a: T, b: T | null | undefined): void => {
  if (!b) return;
  const aRecord = a as Record<string, unknown>;
  const bRecord = b as Record<string, unknown>;
  for (const key of Object.keys(bRecord)) {
    if (Array.isArray(aRecord[key]) && Array.isArray(bRecord[key])) {
      aRecord[key] = [...(aRecord[key] as unknown[]), ...(bRecord[key] as unknown[])];
    } else {
      aRecord[key] = bRecord[key];
    }
  }
};

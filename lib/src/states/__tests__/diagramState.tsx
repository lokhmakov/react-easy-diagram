import { DiagramSettings, IDiagramSettings } from 'states/diagramSettings';
import { UserInteractionSettings } from 'states/userInteractionSettings';
import React from 'react';
import { DiagramState, IDiagramState } from 'states/diagramState';
import { RootStore } from 'states/rootStore';
import { Point } from 'utils/point';
import { BoundingBox } from 'utils/common';

describe('Diagram state', () => {
  let rootStore: RootStore;
  let diagramState: DiagramState;

  beforeEach(() => {
    rootStore = new RootStore();
    diagramState = rootStore.diagramState;
  });

  test('Import/export', () => {
    const state: IDiagramState = {
      offset: [13, 13],
      zoom: 2.5,
    };

    diagramState.import(state);
    const exported = diagramState.export();

    expect(diagramState.offset).toEqual(state.offset);
    expect(exported.offset).toEqual(state.offset);
    expect(diagramState.zoom).toEqual(state.zoom);
    expect(exported.zoom).toEqual(state.zoom);
  });

  test('Zoom value larger than max allowed should be clamped', () => {
    diagramState.setZoom(rootStore.diagramSettings.zoomInterval[1] + 10);
    expect(diagramState.zoom).toEqual(
      rootStore.diagramSettings.zoomInterval[1]
    );
  });

  test('Zoom value smaller than min allowed should be clamped', () => {
    diagramState.setZoom(rootStore.diagramSettings.zoomInterval[0] - 0.5);
    expect(diagramState.zoom).toEqual(
      rootStore.diagramSettings.zoomInterval[0]
    );
  });

  test('Zoom into center', () => {
    diagramState.diagramInnerRef.current = {
      clientWidth: 200,
      clientHeight: 200,
    } as HTMLDivElement;
    const zoomMultiplicator = 2;
    diagramState.zoomIntoCenter(zoomMultiplicator);

    expect(diagramState.zoom).toEqual(zoomMultiplicator);
    expect(diagramState.offset).toEqual([-100, -100]);
  });

  test('Zoom out of center', () => {
    diagramState.diagramInnerRef.current = {
      clientWidth: 200,
      clientHeight: 200,
    } as HTMLDivElement;
    const zoomMultiplicator = 0.5;
    diagramState.zoomIntoCenter(zoomMultiplicator);

    expect(diagramState.zoom).toEqual(zoomMultiplicator);
    expect(diagramState.offset).toEqual([50, 50]);
  });

  test('Zoom into point', () => {
    diagramState.diagramInnerRef.current = {
      clientWidth: 200,
      clientHeight: 200,
    } as HTMLDivElement;
    const zoomMultiplicator = 2;
    const pointToZoomInto: Point = [50, 50];
    diagramState.zoomInto(pointToZoomInto, zoomMultiplicator);

    expect(diagramState.zoom).toEqual(zoomMultiplicator);
    expect(diagramState.offset).toEqual([-50, -50]);
  });

  test('Zoom to fit nodes', () => {
    rootStore.diagramSettings.zoomToFitSettings.padding = [5,5]
    const boundingBox: BoundingBox = {
      topLeftCorner: [100, 100],
      bottomRightCorner: [190, 190],
      size: [90, 90],
    };
    rootStore.nodesStore.getNodesBoundingBox = () => boundingBox;
    diagramState.diagramInnerRef.current = {
      clientWidth: 200,
      clientHeight: 200,
    } as HTMLDivElement;

    diagramState.zoomToFit();

    expect(diagramState.zoom).toEqual(2);
    expect(diagramState.offset).toEqual([-190, -190]);
  });
});

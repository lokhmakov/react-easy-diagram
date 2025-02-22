import {
  canDragGestureBeTapInstead,
  eventPathContainsClass,
  GestureHandlers,
} from 'hooks/userInteractions/common';
import { useCursor, useDiagramCursor } from 'hooks/userInteractions/useCursor';
import { useUserAbilityToSelectSwitcher } from 'hooks/userInteractions/useUserAbilityToSelectSwitcher';
import { useRootStore } from 'hooks/useRootStore';
import React, { useCallback, useMemo, useRef } from 'react';
import { useGesture } from 'react-use-gesture';
import { NodeState } from 'states/nodeState';
import { multiplyPoint } from 'utils/point';

export const useNodeUserInteraction = (
  nodeState: NodeState
): React.RefObject<HTMLElement> => {
  const rootStore = useRootStore();

  const interactionActiveRef = useRef<boolean>(false);
  const selectOnLongTapRef = useRef<NodeJS.Timeout | null>(null);
  const cancelSelectOnLongTap = useCallback(() => {
    if (selectOnLongTapRef.current) {
      clearTimeout(selectOnLongTapRef.current);
      selectOnLongTapRef.current = null;
      return true;
    }
    return false;
  }, [selectOnLongTapRef]);
  const userInteractionElemRef = useRef<HTMLElement>(null);

  const handlers = useMemo<GestureHandlers>(
    () => ({
      onDrag: ({ pinching, delta, movement }) => {
        if (
          !interactionActiveRef.current ||
          pinching ||
          canDragGestureBeTapInstead(movement)
        ) {
          return;
        }
        cancelSelectOnLongTap();

        if (rootStore.dragState.isActive && !nodeState.isDragActive) return;
        if (!nodeState.isDragEnabled) return;

        if (!nodeState.isDragActive) {
          rootStore.dragState.startDragging(nodeState);
        }

        rootStore.dragState.dragBy(
          multiplyPoint(delta, 1 / rootStore.diagramState.zoom)
        );
      },
      onDragStart: ({ event }) => {
        interactionActiveRef.current =
          allowNodeInteraction(event) && !rootStore.dragState.isActive;

        if (interactionActiveRef.current) {
          cancelSelectOnLongTap();
          if (nodeState.isSelectionEnabled) {
            selectOnLongTapRef.current = global.setTimeout(() => {
              if (selectOnLongTapRef.current) {
                selectOnLongTapRef.current = null;
                rootStore.selectionState.switch(nodeState);
              }
            }, selectDelay);
          }
        }
      },
      onDragEnd: ({ tap, ctrlKey }) => {
        if (interactionActiveRef.current) {
          interactionActiveRef.current = false;
          const selectLongOnTapCancelled = cancelSelectOnLongTap();

          if (nodeState.isDragActive) {
            rootStore.dragState.stopDragging();
          }

          // selectLongOnTapCancelled means that callback in timer wasn't executed yet
          if (nodeState.isSelectionEnabled && tap && selectLongOnTapCancelled) {
            rootStore.selectionState.select(nodeState, !ctrlKey);
          }
        }
      },
    }),
    [nodeState, rootStore]
  );

  useGesture(handlers, {
    domTarget: userInteractionElemRef,
    eventOptions: { passive: false },
  });

  useUserAbilityToSelectSwitcher(
    interactionActiveRef.current,
    userInteractionElemRef.current?.ownerDocument?.body
  );

  useDiagramCursor(nodeState.isDragActive, 'move');
  useCursor(nodeState.isDragActive, 'move', nodeState.ref.current);

  return userInteractionElemRef;
};

const selectDelay: number = 500;

function allowNodeInteraction(
  event: React.PointerEvent<Element> | PointerEvent
) {
  return eventPathContainsClass(
    event,
    enableNodeUserInteractionClassName,
    disableNodeUserInteractionClassName
  );
}

export const enableNodeUserInteractionClassName =
  'react_easy_diagram_enable_node_user_interaction';
export const disableNodeUserInteractionClassName =
  'react_easy_diagram_disable_node_user_interaction';

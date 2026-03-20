"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import {
    ProductionState,
    ProductionAction,
    CanvasAsset,
    TableAsset,
    Asset,
    LayerAction,
    RotationDirection
} from '../types';

const initialState: ProductionState = {
    canvasAssets: [],
    tableAssets: [],
    selectedAssetIds: [],
    leftSidebarOpen: false,
    rightSidebarOpen: false,
    selectedBallroomImage: null,
    selectedBallroomId: null,
    infoModalOpen: false,
    summaryOpen: false,
    mounted: false,
};

function productionReducer(state: ProductionState, action: ProductionAction): ProductionState {
    switch (action.type) {
        case 'SET_MOUNTED':
            return { ...state, mounted: action.mounted };
        case 'TOGGLE_LEFT_SIDEBAR':
            return { ...state, leftSidebarOpen: action.open ?? !state.leftSidebarOpen };
        case 'TOGGLE_RIGHT_SIDEBAR':
            return { ...state, rightSidebarOpen: action.open ?? !state.rightSidebarOpen };
        case 'SET_BALLROOM':
            return { ...state, selectedBallroomImage: action.image, selectedBallroomId: action.id };
        case 'ADD_CANVAS_ASSET':
            return { ...state, canvasAssets: [...state.canvasAssets, action.asset] };
        case 'REMOVE_CANVAS_ASSET':
            return {
                ...state,
                canvasAssets: state.canvasAssets.filter(a => !action.ids.includes(a.id)),
                selectedAssetIds: state.selectedAssetIds.filter(id => !action.ids.includes(id)),
            };
        case 'UPDATE_CANVAS_ASSET_POS':
            return {
                ...state,
                canvasAssets: state.canvasAssets.map(a => {
                    const update = action.updates.find(u => u.id === a.id);
                    return update ? { ...a, x: update.x, y: update.y } : a;
                }),
            };
        case 'UPDATE_CANVAS_ASSET_PROPS':
            return {
                ...state,
                canvasAssets: state.canvasAssets.map(a => {
                    const update = action.updates.find(u => u.id === a.id);
                    return update ? { ...a, ...update.properties } : a;
                }),
            };
        case 'SET_SELECTED_ASSETS':
            return { ...state, selectedAssetIds: action.ids };
        case 'SET_MODAL_OPEN':
            if (action.modal === 'info') return { ...state, infoModalOpen: action.open };
            if (action.modal === 'summary') return { ...state, summaryOpen: action.open };
            return state;
        case 'DUPLICATE_ASSETS': {
            return {
                ...state,
                canvasAssets: [...state.canvasAssets, ...action.assets],
                selectedAssetIds: action.assets.map(a => a.id)
            };
        }
        case 'RESET_ASSETS':
            return {
                ...state,
                canvasAssets: state.canvasAssets.map(a => action.ids.includes(a.id) ? {
                    ...a,
                    scale: 0.8,
                    rotation: 0,
                    flipX: false,
                    flipY: false,
                    isLocked: false,
                } : a)
            };
        case 'UPDATE_LAYERING': {
            const { ids, action: layerAction } = action;
            const result = [...state.canvasAssets];
            const movingAssets = result.filter(a => ids.includes(a.id));
            const remaining = result.filter(a => !ids.includes(a.id));

            switch (layerAction) {
                case 'front': return { ...state, canvasAssets: [...remaining, ...movingAssets] };
                case 'back': return { ...state, canvasAssets: [...movingAssets, ...remaining] };
                case 'forward': {
                    const maxIdx = Math.max(...ids.map(id => state.canvasAssets.findIndex(a => a.id === id)));
                    const insertionPoint = Math.min(maxIdx + 1, state.canvasAssets.length);
                    const newCanvas = [...remaining];
                    newCanvas.splice(insertionPoint - movingAssets.length + 1, 0, ...movingAssets);
                    return { ...state, canvasAssets: newCanvas };
                }
                case 'backward': {
                    const minIdx = Math.min(...ids.map(id => state.canvasAssets.findIndex(a => a.id === id)));
                    const insertionPoint = Math.max(minIdx - 1, 0);
                    const newCanvas = [...remaining];
                    newCanvas.splice(insertionPoint, 0, ...movingAssets);
                    return { ...state, canvasAssets: newCanvas };
                }
                default: return state;
            }
        }
        case 'ROTATE_ASSETS': {
            const step = action.direction === 'cw' ? 15 : -15;
            return {
                ...state,
                canvasAssets: state.canvasAssets.map(a =>
                    action.ids.includes(a.id) && a.rotationAllowed !== false
                        ? { ...a, rotation: (a.rotation || 0) + step }
                        : a
                )
            };
        }
        case 'ADD_TABLE_ASSET':
            if (state.tableAssets.length >= 8) return state;
            return {
                ...state,
                tableAssets: [...state.tableAssets, { id: crypto.randomUUID(), item: action.asset }]
            };
        case 'REMOVE_TABLE_ASSET':
            return {
                ...state,
                tableAssets: state.tableAssets.filter(a => a.id !== action.id)
            };
        default:
            return state;
    }
}

interface ProductionContextType extends ProductionState {
    dispatch: React.Dispatch<ProductionAction>;
}

const ProductionContext = createContext<ProductionContextType | undefined>(undefined);

export function ProductionProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(productionReducer, initialState);

    useEffect(() => {
        dispatch({ type: 'SET_MOUNTED', mounted: true });
        if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            dispatch({ type: 'TOGGLE_LEFT_SIDEBAR', open: true });
            dispatch({ type: 'TOGGLE_RIGHT_SIDEBAR', open: true });
        }
    }, []);

    return (
        <ProductionContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ProductionContext.Provider>
    );
}

export function useProduction() {
    const context = useContext(ProductionContext);
    if (context === undefined) {
        throw new Error('useProduction must be used within a ProductionProvider');
    }
    return context;
}

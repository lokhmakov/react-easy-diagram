import { makeAutoObservable, makeObservable, observable, computed, action, reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useMemo, useState, useEffect, useRef, useCallback, useLayoutEffect, useContext } from 'react';
import { useGesture } from 'react-use-gesture';

function isPoint(value) {
    return (Array.isArray(value) &&
        value.length === 2 &&
        value.every(function (v) { return Number.isFinite(v); }));
}
var distanceBetweenPoints = function (a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};
var roundPoint = function (point) {
    return [Math.round(point[0]), Math.round(point[1])];
};
var addPoints = function () {
    var _a;
    var points = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        points[_i] = arguments[_i];
    }
    return (_a = points.reduce(function (prev, curr) {
        if (curr) {
            return [
                (prev ? prev[0] : 0) + curr[0],
                (prev ? prev[1] : 0) + curr[1]
            ];
        }
        else {
            return prev;
        }
    })) !== null && _a !== void 0 ? _a : [0, 0];
};
var subtractPoints = function () {
    var points = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        points[_i] = arguments[_i];
    }
    return points.reduce(function (prev, curr) {
        return curr ? [prev[0] - curr[0], prev[1] - curr[1]] : prev;
    });
};
var multiplyPoint = function (a, m) { return [
    a[0] * m,
    a[1] * m,
]; };
var arePointsEqual = function (a, b) {
    return a === b || (isPoint(a) && isPoint(b) && a[0] === b[0] && a[1] === b[1]);
};

var cloneSelectedNodesCommand = {
    execute: function (rootStore) {
        rootStore.selectionState.selectedNodes.forEach(function (node) {
            var nodeObj = node.export();
            nodeObj.id = undefined;
            nodeObj.label = nodeObj.label;
            nodeObj.position = addPoints(nodeObj.position, [50, 50]);
            rootStore.nodesStore.addNode(nodeObj, false);
        });
    },
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function clampValue(value, interval) {
    return Math.min(Math.max(value, interval[0]), interval[1]);
}
function deepCopy(value) {
    return JSON.parse(JSON.stringify(value));
}

var LinkPointEndpointState = /** @class */ (function () {
    function LinkPointEndpointState(pos) {
        var _this = this;
        this.translateBy = function (pointToTranslateBy) {
            _this._point = addPoints(_this._point, pointToTranslateBy);
        };
        this._point = pos;
        makeAutoObservable(this);
    }
    Object.defineProperty(LinkPointEndpointState.prototype, "point", {
        get: function () {
            return this._point;
        },
        enumerable: false,
        configurable: true
    });
    return LinkPointEndpointState;
}());

var LinkPortEndpointState = /** @class */ (function () {
    function LinkPortEndpointState(nodeId, portId, rootStore) {
        var _this = this;
        this.export = function () {
            return deepCopy({
                nodeId: _this._nodeId,
                portId: _this._portId,
            });
        };
        this._nodeId = nodeId;
        this._portId = portId;
        makeAutoObservable(this);
        this._rootStore = rootStore;
    }
    Object.defineProperty(LinkPortEndpointState.prototype, "nodeId", {
        get: function () {
            return this._nodeId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkPortEndpointState.prototype, "portId", {
        get: function () {
            return this._portId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkPortEndpointState.prototype, "node", {
        get: function () {
            return this._rootStore.nodesStore.getNode(this._nodeId);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkPortEndpointState.prototype, "port", {
        get: function () {
            var _a;
            return (_a = this.node) === null || _a === void 0 ? void 0 : _a.getPort(this._portId);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkPortEndpointState.prototype, "point", {
        get: function () {
            if (this.node &&
                this.port &&
                this.port.offsetRelativeToNode &&
                this.port.realSize) {
                return addPoints(this.node.position, addPoints(this.port.offsetRelativeToNode, multiplyPoint(this.port.realSize, 0.5)));
            }
            return undefined;
        },
        enumerable: false,
        configurable: true
    });
    return LinkPortEndpointState;
}());
function linkPortEndpointsEquals(a, b) {
    return a.nodeId === b.nodeId && a.portId === b.portId;
}

var VisualComponentState = /** @class */ (function () {
    function VisualComponentState(component) {
        var _this = this;
        this._settings = null;
        this.import = function (newComponent) {
            var _a;
            if ('component' in newComponent) {
                _this._component = newComponent.component;
                _this._settings = (_a = newComponent.settings) !== null && _a !== void 0 ? _a : {};
            }
            else {
                _this._component = newComponent;
                _this._settings = {};
            }
        };
        this.import(component);
        makeObservable(this, {
            _component: observable.ref,
            _settings: observable,
            component: computed,
            settings: computed,
            import: action,
        });
    }
    Object.defineProperty(VisualComponentState.prototype, "component", {
        get: function () {
            return this._component;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VisualComponentState.prototype, "settings", {
        get: function () {
            return this._settings;
        },
        enumerable: false,
        configurable: true
    });
    return VisualComponentState;
}());

var VisualComponents = /** @class */ (function () {
    function VisualComponents(defaultComponents) {
        var _this = this;
        this._defaultType = componentDefaultType;
        this.import = function (obj) {
            _this.setDefaultType(obj === null || obj === void 0 ? void 0 : obj.defaultType);
            _this._components = __assign(__assign({}, _this._defaultComponents), _this._createComponentCollection(obj === null || obj === void 0 ? void 0 : obj.components));
        };
        this.getComponent = function (type) {
            var _a;
            var finalComponentType = type !== null && type !== void 0 ? type : _this.defaultType;
            return ((_a = _this._components[finalComponentType]) !== null && _a !== void 0 ? _a : _this._components[_this.defaultType]);
        };
        this.setDefaultType = function (value) {
            _this._defaultType = value !== null && value !== void 0 ? value : componentDefaultType;
        };
        this._createComponentCollection = function (componentsObjects) {
            var collection = {};
            componentsObjects &&
                Object.entries(componentsObjects).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    collection[key] = new VisualComponentState(value);
                });
            return collection;
        };
        this._defaultComponents = this._createComponentCollection(defaultComponents);
        this._components = __assign({}, this._defaultComponents);
        makeAutoObservable(this);
    }
    Object.defineProperty(VisualComponents.prototype, "defaultType", {
        get: function () {
            return this._defaultType;
        },
        enumerable: false,
        configurable: true
    });
    return VisualComponents;
}());
var componentDefaultType = 'default';

function isNumber(value) {
    return Number.isFinite(value);
}
function isObject(value) {
    return value != null && typeof value == 'object' && !Array.isArray(value);
}
function isBoolean(value) {
    return value != null && typeof value == 'boolean';
}

var LinkState = /** @class */ (function () {
    function LinkState(rootStore, id, state) {
        var _this = this;
        this.import = function (state) {
            _this._source = _this._createEndpointState(state.source);
            _this._target = _this._createEndpointState(state.target);
            _this.setType(state.type);
            _this.setSegments(state.segments);
            _this.setExtra(state.extra);
            _this.setIsSelectionEnabled(state === null || state === void 0 ? void 0 : state.isSelectionEnabled);
        };
        this._createEndpointState = function (endpoint) {
            return new LinkPortEndpointState(endpoint.nodeId, endpoint.portId, _this._rootStore);
        };
        this.export = function () {
            var _a;
            return (__assign({ source: _this.source.export(), target: _this.target.export() }, deepCopy({
                id: _this._id,
                type: _this.type,
                segments: _this.segments,
                extra: _this.extra,
                isSelectionEnabled: (_a = _this._isSelectionEnabled) !== null && _a !== void 0 ? _a : undefined,
            })));
        };
        this.setType = function (value) {
            _this._type = value !== null && value !== void 0 ? value : componentDefaultType;
        };
        this.setSegments = function (value) {
            _this._segments = value !== null && value !== void 0 ? value : [];
        };
        this.setExtra = function (value) {
            _this._extra = value !== null && value !== void 0 ? value : null;
        };
        this.setIsSelectionEnabled = function (value) {
            _this._isSelectionEnabled = isBoolean(value) ? value : null;
        };
        this._rootStore = rootStore;
        this._id = id;
        this._selected = false;
        this._hovered = false;
        this.import(state);
        makeAutoObservable(this, {
            // @ts-ignore
            _rootStore: false,
        });
    }
    Object.defineProperty(LinkState.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkState.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkState.prototype, "segments", {
        get: function () {
            return this._segments;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkState.prototype, "path", {
        get: function () {
            return createLinkPath(this._rootStore, this.source, this.target);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkState.prototype, "componentDefinition", {
        get: function () {
            var visualComponents = this._rootStore.linksSettings.visualComponents;
            return visualComponents.getComponent(this.type);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkState.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (value) {
            this._selected = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkState.prototype, "hovered", {
        get: function () {
            return this._hovered;
        },
        set: function (value) {
            this._hovered = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkState.prototype, "extra", {
        get: function () {
            return this._extra;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkState.prototype, "source", {
        get: function () {
            return this._source;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkState.prototype, "target", {
        get: function () {
            return this._target;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkState.prototype, "isSelectionEnabled", {
        get: function () {
            return this._isSelectionEnabled === null
                ? this._rootStore.diagramSettings.userInteraction.linkSelection
                : this._isSelectionEnabled;
        },
        enumerable: false,
        configurable: true
    });
    return LinkState;
}());
function createLinkPath(rootStore, source, target) {
    var linksSettings = rootStore.linksSettings;
    if (!source.port ||
        (target instanceof LinkPortEndpointState && !target.port) ||
        !source.point ||
        !target.point) {
        return undefined;
    }
    var pathStr = linksSettings.pathConstructor({
        point: source.point,
        portType: source.port.type,
        direction: source.port.linkDirection,
    }, {
        point: target.point,
        portType: target instanceof LinkPointEndpointState
            ? undefined
            : target.port.type,
        direction: target instanceof LinkPointEndpointState
            ? undefined
            : target.port.linkDirection,
    });
    return {
        svgPath: pathStr,
        source: source.point,
        target: target.point,
    };
}

var removeSelectedCommand = {
    execute: function (rootStore) {
        removeSelectedNodesCommand.execute(rootStore);
        removeSelectedLinksCommand.execute(rootStore);
    },
};
var removeSelectedNodesCommand = {
    execute: function (rootStore) {
        rootStore.selectionState.selectedNodes.forEach(function (node) {
            rootStore.nodesStore.removeNode(node.id);
        });
    },
};
var removeSelectedLinksCommand = {
    execute: function (rootStore) {
        rootStore.selectionState.selectedItems
            .filter(function (i) { return i instanceof LinkState; })
            .forEach(function (link) {
            rootStore.linksStore.removeLink(link.id);
        });
    },
};

var BackgroundDefault = observer(function (_a) {
    var diagramOffset = _a.diagramOffset, diagramZoom = _a.diagramZoom, settings = _a.settings;
    var finalSettings = settings !== null && settings !== void 0 ? settings : defaultSettings$1;
    var backgroundImage = useMemo(function () {
        return finalSettings.imageGenerator
            ? finalSettings.imageGenerator(100 * diagramZoom, 100 * diagramZoom)
            : undefined;
    }, [finalSettings, finalSettings.imageGenerator, diagramZoom]);
    return (React.createElement("div", { className: 'react_fast_diagram_Background_Default', style: {
            backgroundColor: finalSettings.color,
            backgroundImage: backgroundImage,
            backgroundPosition: diagramOffset[0] + "px " + diagramOffset[1] + "px",
        } }));
});
var gridImageGenerator = function (width, height, sizeMultiplicator, linesColor, linesOpacity) {
    linesColor = linesColor.replace('#', '%23');
    return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='" + width * sizeMultiplicator + "' height='" + height * sizeMultiplicator + "' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='" + linesColor + "' fill-opacity='" + linesOpacity + "'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";
};
var createGridImageGenerator = function (sizeMultiplicator, linesColor, linesOpacity) { return function (width, height) {
    return gridImageGenerator(width, height, sizeMultiplicator, linesColor, linesOpacity);
}; };
var dotsImageGenerator = function (width, height, sizeMultiplicator, dotsColor, dotsOpacity, dotsRadius) {
    sizeMultiplicator = 0.1 * sizeMultiplicator;
    dotsColor = dotsColor.replace('#', '%23');
    return "url(\"data:image/svg+xml,%3Csvg width='" + width * sizeMultiplicator + "' height='" + height * sizeMultiplicator + "' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='" + dotsColor + "' fill-opacity='" + dotsOpacity + "' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='" + dotsRadius + "'/%3E%3Ccircle cx='13' cy='13' r='" + dotsRadius + "'/%3E%3C/g%3E%3C/svg%3E\")";
};
var createDotsImageGenerator = function (sizeMultiplicator, dotsColor, dotsOpacity, dotsRadius) { return function (width, height) {
    return dotsImageGenerator(width, height, sizeMultiplicator, dotsColor, dotsOpacity, dotsRadius);
}; };
var crossesImageGenerator = function (width, height, sizeMultiplicator, color, opacity) {
    color = color.replace('#', '%23');
    return "url(\"data:image/svg+xml,%3Csvg width='" + width * sizeMultiplicator + "' height='" + height * sizeMultiplicator + "' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='" + color + "' fill-opacity='" + opacity + "'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";
};
var createCrossesImageGenerator = function (sizeMultiplicator, color, opacity) { return function (width, height) {
    return crossesImageGenerator(width, height, sizeMultiplicator, color, opacity);
}; };
var defaultSettings$1 = {
    imageGenerator: createCrossesImageGenerator(0.2, '#858585', 0.1),
    color: '#ffffff',
};
var createDefaultBackground = function (settings) {
    var finalSettings = __assign(__assign({}, defaultSettings$1), (settings ? settings : {}));
    return {
        component: BackgroundDefault,
        settings: finalSettings,
    };
};

var useNotifyRef = function (init) {
    var _a = useState(0); _a[0]; var forceUpdate = _a[1];
    var ref = useState(function () { return ({
        value: init,
        facade: {
            get current() {
                return ref.value;
            },
            set current(value) {
                var last = ref.value;
                if (last !== value) {
                    ref.value = value;
                    forceUpdate(function (i) { return i + 1; });
                }
            },
        },
    }); })[0];
    return ref.facade;
};

var DISABLED_USER_SELECT_CSS_CLASS = 'react_fast_diagram_disabled_user_select';
function useUserAbilityToSelectSwitcher(active, elementToSwitchUserSelectOn) {
    useEffect(function () {
        if (!active || !elementToSwitchUserSelectOn) {
            return;
        }
        if (elementToSwitchUserSelectOn.classList.contains(DISABLED_USER_SELECT_CSS_CLASS)) {
            return;
        }
        elementToSwitchUserSelectOn.classList.add(DISABLED_USER_SELECT_CSS_CLASS);
        return function () {
            elementToSwitchUserSelectOn.classList.remove(DISABLED_USER_SELECT_CSS_CLASS);
        };
    }, [active, elementToSwitchUserSelectOn]);
}

var useLinkUserInteraction = function (linkState) {
    var _a, _b;
    var rootStore = useRootStore();
    var activeRef = useNotifyRef(false);
    var selectionHandledRef = useRef(false);
    var selectionTimeoutRef = useRef(null);
    var handlers = useMemo(function () {
        return linkState instanceof LinkState
            ? {
                onPointerEnter: function () {
                    linkState.hovered = true;
                },
                onPointerLeave: function () {
                    linkState.hovered = false;
                },
                onDragStart: function () {
                    activeRef.current = !rootStore.dragState.isActive;
                    if (activeRef.current) {
                        selectionHandledRef.current = false;
                        if (linkState.isSelectionEnabled) {
                            selectionTimeoutRef.current = global.setTimeout(function () {
                                if (!selectionHandledRef.current) {
                                    selectionHandledRef.current = true;
                                    rootStore.selectionState.switch(linkState);
                                }
                            }, selectDelay$1);
                        }
                    }
                },
                onDragEnd: function (_a) {
                    var tap = _a.tap, ctrlKey = _a.ctrlKey;
                    if (activeRef.current) {
                        activeRef.current = false;
                        if (selectionTimeoutRef.current) {
                            clearTimeout(selectionTimeoutRef.current);
                        }
                        if (linkState.isSelectionEnabled &&
                            tap &&
                            !selectionHandledRef.current) {
                            selectionHandledRef.current = true;
                            rootStore.selectionState.select(linkState, !ctrlKey);
                        }
                    }
                },
            }
            : {};
    }, [linkState, rootStore]);
    var bind = useGesture(handlers, {
        eventOptions: { passive: false },
    });
    useUserAbilityToSelectSwitcher(activeRef.current, (_b = (_a = rootStore.diagramState.diagramInnerRef.current) === null || _a === void 0 ? void 0 : _a.ownerDocument) === null || _b === void 0 ? void 0 : _b.body);
    return { bind: bind };
};
var selectDelay$1 = 500;

var LinkWrapper = observer(function (_a) {
    var link = _a.link;
    var bind = useLinkUserInteraction(link).bind;
    return (React.createElement("g", null,
        React.createElement(link.componentDefinition.component, { bind: bind, entity: link, settings: link.componentDefinition.settings })));
});

var LinksLayer = observer(function (_a) {
    var linksStore = _a.linksStore;
    var rootStore = useRootStore();
    return (React.createElement("svg", { className: "react_fast_diagram_Layer" },
        React.createElement("defs", null, rootStore.linksSettings.svgMarkers.map(function (Marker, i) { return React.createElement(Marker, { key: i }); })),
        Array.from(linksStore.links).map(function (_a) {
            _a[0]; var link = _a[1];
            return (React.createElement(LinkWrapper, { key: link.id, link: link }));
        }),
        React.createElement(LinkWrapper, { key: '__creation__', link: linksStore.linkCreation })));
});

/**
 * Check each element starting from the first one in composedPath() (see https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath),
 * if exceptClassName is the first class found -> return false,
 * if className is the first class found -> return true,
 * if neither exceptClassName nor className were found -> return false
 */
var eventPathContainsClass = function (event, className, exceptClassName) {
    var typedEvent = event;
    if ('composedPath' in typedEvent) {
        var targets = typedEvent.composedPath();
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            if ('classList' in target) {
                var classList = target.classList;
                if (exceptClassName && classList.contains(exceptClassName)) {
                    return false;
                }
                else if (classList.contains(className)) {
                    return true;
                }
            }
        }
    }
    return false;
};
/**
 * Does gesture can be potentially a tap/click event?
 * Drag gesture will be tap/click gesture on mouse or touch release only when the drag displacement is inferior to 3 pixels.
 * See useGestures documetation for more information.
 * @param movement - state value of gesture, represent gesture offset
 */
function canDragGestureBeTapInstead(movement) {
    return Math.max(Math.abs(movement[0]), Math.abs(movement[1])) < 3;
}

function useCursor(active, cursor, ref) {
    var cursorBeforeSetRef = useRef('');
    useEffect(function () {
        if (!active || !ref || !cursor || ref.style.cursor === cursor) {
            return;
        }
        cursorBeforeSetRef.current = ref.style.cursor;
        ref.style.cursor = cursor;
        return function () {
            ref.style.cursor = cursorBeforeSetRef.current;
        };
    }, [active, ref]);
}
function useDiagramCursor(active, cursor) {
    var diagramState = useRootStore().diagramState;
    var ref = diagramState.diagramInnerRef.current;
    useCursor(active, cursor, ref);
}

var useNodeUserInteraction = function (nodeState) {
    var _a, _b;
    var rootStore = useRootStore();
    var interactionActiveRef = useRef(false);
    var selectOnLongTapRef = useRef(null);
    var cancelSelectOnLongTap = useCallback(function () {
        if (selectOnLongTapRef.current) {
            clearTimeout(selectOnLongTapRef.current);
            selectOnLongTapRef.current = null;
            return true;
        }
        return false;
    }, [selectOnLongTapRef]);
    var userInteractionElemRef = useRef(null);
    var handlers = useMemo(function () { return ({
        onDrag: function (_a) {
            var pinching = _a.pinching, delta = _a.delta, movement = _a.movement;
            if (!interactionActiveRef.current ||
                pinching ||
                canDragGestureBeTapInstead(movement)) {
                return;
            }
            cancelSelectOnLongTap();
            if (rootStore.dragState.isActive && !nodeState.isDragActive)
                return;
            if (!nodeState.isDragEnabled)
                return;
            if (!nodeState.isDragActive) {
                rootStore.dragState.startDragging(nodeState);
            }
            rootStore.dragState.dragBy(multiplyPoint(delta, 1 / rootStore.diagramState.zoom));
        },
        onDragStart: function (_a) {
            var event = _a.event;
            interactionActiveRef.current =
                allowNodeInteraction(event) && !rootStore.dragState.isActive;
            if (interactionActiveRef.current) {
                cancelSelectOnLongTap();
                if (nodeState.isSelectionEnabled) {
                    selectOnLongTapRef.current = global.setTimeout(function () {
                        if (selectOnLongTapRef.current) {
                            selectOnLongTapRef.current = null;
                            rootStore.selectionState.switch(nodeState);
                        }
                    }, selectDelay);
                }
            }
        },
        onDragEnd: function (_a) {
            var tap = _a.tap, ctrlKey = _a.ctrlKey;
            if (interactionActiveRef.current) {
                interactionActiveRef.current = false;
                var selectLongOnTapCancelled = cancelSelectOnLongTap();
                if (nodeState.isDragActive) {
                    rootStore.dragState.stopDragging();
                }
                // selectLongOnTapCancelled means that callback in timer wasn't executed yet
                if (nodeState.isSelectionEnabled && tap && selectLongOnTapCancelled) {
                    rootStore.selectionState.select(nodeState, !ctrlKey);
                }
            }
        },
    }); }, [nodeState, rootStore]);
    useGesture(handlers, {
        domTarget: userInteractionElemRef,
        eventOptions: { passive: false },
    });
    useUserAbilityToSelectSwitcher(interactionActiveRef.current, (_b = (_a = userInteractionElemRef.current) === null || _a === void 0 ? void 0 : _a.ownerDocument) === null || _b === void 0 ? void 0 : _b.body);
    useDiagramCursor(nodeState.isDragActive, 'move');
    useCursor(nodeState.isDragActive, 'move', nodeState.ref.current);
    return userInteractionElemRef;
};
var selectDelay = 500;
function allowNodeInteraction(event) {
    return eventPathContainsClass(event, enableNodeUserInteractionClassName, disableNodeUserInteractionClassName);
}
var enableNodeUserInteractionClassName = 'react_easy_diagram_enable_node_user_interaction';
var disableNodeUserInteractionClassName = 'react_easy_diagram_disable_node_user_interaction';

var NodeWrapper = observer(function (_a) {
    var node = _a.node;
    var userInteractionElemRef = useNodeUserInteraction(node);
    var renderedPortsContextValue = usePortsCleanUp(node);
    return (React.createElement(NodeContext.Provider, { value: node },
        React.createElement(RenderedPortsComponentsContext.Provider, { value: renderedPortsContextValue },
            React.createElement("div", { id: node.id, className: className$1, style: {
                    transform: "translate(" + node.position[0] + "px, " + node.position[1] + "px)",
                    zIndex: node.selected ? 10 : undefined,
                }, ref: node.ref },
                React.createElement(node.componentDefinition.component, { draggableRef: userInteractionElemRef, entity: node, settings: node.componentDefinition.settings })))));
});
var NodeContext = React.createContext(null);
var RenderedPortsComponentsContext = React.createContext({ render: function () { return undefined; }, unrender: function () { return undefined; } });
var className$1 = "react_fast_diagram_NodeWrapper " + enableNodeUserInteractionClassName;
/**
 * Clean up old ports.
 * @param node
 * @returns ports that are currently rendered
 */
var usePortsCleanUp = function (node) {
    var renderedPortsRef = useNotifyRef([]);
    var renderedPortsContextValue = useMemo(function () { return ({
        render: function (id) {
            if (!renderedPortsRef.current.includes(id)) {
                renderedPortsRef.current = __spreadArrays(renderedPortsRef.current, [id]);
            }
        },
        unrender: function (id) {
            if (renderedPortsRef.current.includes(id)) {
                renderedPortsRef.current = renderedPortsRef.current.filter(function (oldId) { return oldId !== id; });
            }
        },
    }); }, [renderedPortsRef]);
    useLayoutEffect(function () {
        renderedPortsRef.current = [];
    }, [node, renderedPortsRef]);
    useEffect(function () {
        var extraPortsIds = Object.keys(node.ports).filter(function (id) { return !renderedPortsRef.current.includes(id); });
        action(function () { return extraPortsIds.forEach(function (id) { return node.removePort(id); }); });
    }, [renderedPortsRef.current]);
    return renderedPortsContextValue;
};

var NodesLayer = observer(function (_a) {
    var nodesStore = _a.nodesStore;
    var rootStore = useRootStore();
    useEffect(function () {
        rootStore.diagramState.zoomToFit();
    }, []);
    return (React.createElement("div", { className: "react_fast_diagram_Layer" }, Array.from(nodesStore.nodes).map(function (_a) {
        _a[0]; var node = _a[1];
        return (React.createElement(NodeWrapper, { key: node.id, node: node }));
    })));
});

function useDiagramDragHandlers(cancelEvent) {
    var _a, _b;
    var rootStore = useRootStore();
    var diagramState = rootStore.diagramState;
    var activeRef = useNotifyRef(false);
    var handlers = useMemo(function () { return ({
        onDrag: function (_a) {
            var pinching = _a.pinching, delta = _a.delta;
            if (!activeRef.current || pinching) {
                return;
            }
            diagramState.setOffset(addPoints(diagramState.offset, delta));
        },
        onDragStart: function (_a) {
            var event = _a.event, cancel = _a.cancel;
            if (cancelEvent && cancelEvent(event)) {
                cancel();
                return;
            }
            // Do not activate so drag will not be performed, but also don't cancel, as it would not be possible to clear selection
            if (!rootStore.diagramSettings.userInteraction.diagramPan ||
                event.buttons !== 1) {
                return;
            }
            activeRef.current = true;
        },
        onDragEnd: function (_a) {
            var tap = _a.tap;
            if (tap) {
                rootStore.selectionState.unselectAll();
            }
            activeRef.current = false;
        },
    }); }, [activeRef, diagramState, cancelEvent, rootStore]);
    useUserAbilityToSelectSwitcher(activeRef.current, (_b = (_a = diagramState.diagramInnerRef.current) === null || _a === void 0 ? void 0 : _a.ownerDocument) === null || _b === void 0 ? void 0 : _b.body);
    useDiagramCursor(activeRef.current, 'grabbing');
    return handlers;
}

function useDiagramPinchHandlers(cancel) {
    var _a, _b;
    var _c = useRootStore(), diagramState = _c.diagramState, diagramSettings = _c.diagramSettings;
    var activeRef = useNotifyRef(false);
    var pinchState = useRef({
        distance: 0,
        origin: [0, 0],
        elementLeftTop: [0, 0],
    });
    var handlers = useMemo(function () { return ({
        onPinch: function (_a) {
            var distance = _a.da[0], origin = _a.origin;
            if (!activeRef.current || !diagramState.diagramInnerRef.current) {
                return;
            }
            var originDiff = diagramSettings.userInteraction.diagramPan
                ? subtractPoints(origin, pinchState.current.origin)
                : [0, 0];
            var originPositionOnElement = subtractPoints(origin, pinchState.current.elementLeftTop);
            diagramState.tranlsateAndZoomInto(originDiff, originPositionOnElement, distance / pinchState.current.distance);
            pinchState.current = {
                distance: distance,
                origin: origin,
                elementLeftTop: pinchState.current.elementLeftTop,
            };
        },
        onPinchStart: function (_a) {
            var distance = _a.da[0], origin = _a.origin, event = _a.event;
            if (!diagramSettings.userInteraction.diagramZoom ||
                cancel(event) ||
                !diagramState.diagramInnerRef.current) {
                return;
            }
            var rect = diagramState.diagramInnerRef.current.getBoundingClientRect();
            pinchState.current = {
                distance: distance,
                origin: origin,
                elementLeftTop: [rect.left, rect.top],
            };
            activeRef.current = true;
        },
        onPinchEnd: function () { return (activeRef.current = false); },
    }); }, [
        diagramState.diagramInnerRef.current,
        activeRef,
        diagramState,
        cancel,
        diagramSettings,
    ]);
    useUserAbilityToSelectSwitcher(activeRef.current, (_b = (_a = diagramState.diagramInnerRef.current) === null || _a === void 0 ? void 0 : _a.ownerDocument) === null || _b === void 0 ? void 0 : _b.body);
    return handlers;
}

function useDiagramWheelHandler(state) {
    var _a = useRootStore(), diagramState = _a.diagramState, diagramSettings = _a.diagramSettings;
    var handlers = useMemo(function () { return ({
        onWheel: function (_a) {
            var _b = _a.direction; _b[0]; var yDirection = _b[1], event = _a.event;
            if (!diagramState.diagramInnerRef.current ||
                !diagramSettings.userInteraction.diagramZoom)
                return;
            event === null || event === void 0 ? void 0 : event.preventDefault();
            var rect = diagramState.diagramInnerRef.current.getBoundingClientRect();
            var mousePositionOnElement = subtractPoints([event.clientX, event.clientY], [rect.left, rect.top]);
            var factor = 0.9;
            if (yDirection < 0) {
                factor = 1 / factor;
            }
            state.tranlsateAndZoomInto([0, 0], mousePositionOnElement, factor);
        },
    }); }, [diagramState.diagramInnerRef, state, diagramSettings]);
    return handlers;
}

var useDiagramUserInteraction = function () {
    var diagramState = useRootStore().diagramState;
    var cancelGesture = useCallback(function (event) { return event.target !== diagramState.diagramInnerRef.current; }, [diagramState.diagramInnerRef]);
    var dragHandlers = useDiagramDragHandlers(cancelGesture);
    var pinchHandlers = useDiagramPinchHandlers(cancelGesture);
    var wheelHandler = useDiagramWheelHandler(diagramState);
    useGesture(__assign(__assign(__assign({}, dragHandlers), pinchHandlers), wheelHandler), {
        domTarget: diagramState.diagramInnerRef,
        eventOptions: { passive: false },
    });
};

var MiniControlWrapper = observer(function () {
    var rootStore = useRootStore();
    var minicontrolComponentState = rootStore.diagramSettings.miniControlComponentState;
    return (minicontrolComponentState.component && (React.createElement(minicontrolComponentState.component, { rootStore: rootStore, settings: minicontrolComponentState.settings })));
});

var generateTransform = function (translate, scale) {
    var translatePart = "translate(" + translate[0] + "px, " + translate[1] + "px)";
    if (scale) {
        var scalePart = "scale(" + scale + ")";
        return translatePart + ' ' + scalePart;
    }
    else {
        return translatePart;
    }
};
var areTranformationsEqual = function (a, b) {
    return a === b ||
        (a && b && a.zoom === b.zoom && arePointsEqual(a.offset, b.offset));
};

var InnerDiagram = observer(function (props) {
    var rootStore = useRootStore();
    useDiagramUserInteraction();
    var offset = rootStore.diagramState.offset;
    var zoom = rootStore.diagramState.zoom;
    // Notify state about already rendered zoom and offset.
    useEffect(function () {
        rootStore.diagramState.renderOffsetAndZoom(offset, zoom);
    }, [offset, zoom]);
    useEffect(function () {
        var resizeHandler = function () {
            return rootStore.nodesStore.nodes.forEach(function (n) {
                return n.recalculatePortsSizeAndPosition();
            });
        };
        window.addEventListener('resize', resizeHandler);
        return function () { return window.removeEventListener('resize', resizeHandler); };
    }, [rootStore]);
    return (React.createElement("div", { ref: rootStore.diagramState.diagramInnerRef, style: __assign({}, props.diagramStyles), className: 'react_fast_diagram_DiagramInner' },
        React.createElement(BackgroundWrapper, null),
        React.createElement("div", { className: 'react_fast_diagram_DiagramInner_DraggablePart', style: {
                transform: generateTransform(offset, zoom),
            } },
            React.createElement(LinksLayer, { linksStore: rootStore.linksStore }),
            React.createElement(NodesLayer, { nodesStore: rootStore.nodesStore })),
        React.createElement(MiniControlWrapper, null)));
});
InnerDiagram.displayName = 'InnerDiagram';

function isSuccess(result) {
    return result.success;
}
function isError(result) {
    return !result.success;
}
function successResult() {
    return { success: true };
}
function successValueResult(value) {
    return { success: true, value: value };
}
function errorResult(error) {
    return { success: false, error: error };
}
function errorValueResult(value, error) {
    return { success: false, error: error, value: value };
}

var Callbacks = /** @class */ (function () {
    function Callbacks(rootStore) {
        var _this = this;
        this.import = function (callbacks) {
            _this._validateLinkEndpoints = callbacks === null || callbacks === void 0 ? void 0 : callbacks.validateLinkEndpoints;
            _this._nodesAdded = callbacks === null || callbacks === void 0 ? void 0 : callbacks.nodesAdded;
            _this._nodePositionChanged = callbacks === null || callbacks === void 0 ? void 0 : callbacks.nodePositionChanged;
            _this._dragStateChanged = callbacks === null || callbacks === void 0 ? void 0 : callbacks.dragStateChanged;
        };
        this.export = function () { return ({
            validateLinkEndpoints: _this._validateLinkEndpoints,
            nodesAdded: _this._nodesAdded,
            nodePositionChanged: _this._nodePositionChanged,
            dragStateChanged: _this._dragStateChanged,
        }); };
        this.validateLinkEndpoints = function (source, target) {
            if (_this._validateLinkEndpoints)
                return _this._validateLinkEndpoints(source, target, _this._rootStore);
            else
                return true;
        };
        this.nodesAdded = function (addResults, importing) {
            return _this._nodesAdded &&
                _this._nodesAdded(addResults.filter(isSuccess).map(function (r) { return r.value; }), addResults.filter(isError), importing, _this._rootStore);
        };
        this.nodePositionChanged = function (node, oldPosition, newPosition, isDragActive) {
            return _this._nodePositionChanged &&
                _this._nodePositionChanged(node, oldPosition, newPosition, isDragActive, _this._rootStore);
        };
        this.dragStateChanged = function (nodes, started) {
            return _this._dragStateChanged &&
                _this._dragStateChanged(nodes, started, _this._rootStore);
        };
        this._rootStore = rootStore;
        this.import();
    }
    return Callbacks;
}());

var VisualComponentWithDefault = /** @class */ (function () {
    function VisualComponentWithDefault(defaultComponent) {
        var _this = this;
        this.import = function (newComponent) {
            _this._innerComponent = newComponent
                ? new VisualComponentState(newComponent)
                : _this._defaultComponent;
        };
        this._innerComponent = new VisualComponentState(defaultComponent);
        this._defaultComponent = this._innerComponent;
        makeAutoObservable(this);
    }
    Object.defineProperty(VisualComponentWithDefault.prototype, "component", {
        get: function () {
            return this._innerComponent.component;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VisualComponentWithDefault.prototype, "settings", {
        get: function () {
            return this._innerComponent.settings;
        },
        enumerable: false,
        configurable: true
    });
    return VisualComponentWithDefault;
}());

// Icons from https://material-ui.com/components/material-icons/
var RubbishBinIcon = function () { return (React.createElement("svg", { viewBox: '0 0 24 24' },
    React.createElement("path", { d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" }))); };
var CopyIcon = function () { return (React.createElement("svg", { viewBox: '0 0 24 24' },
    React.createElement("path", { d: 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z' }))); };
var FilterCenterFocusIcon = function () { return (React.createElement("svg", { viewBox: '0 0 24 24' },
    React.createElement("path", { d: "M5 15H3v4c0 1.1.9 2 2 2h4v-2H5v-4zM5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5zm14-2h-4v2h4v4h2V5c0-1.1-.9-2-2-2zm0 16h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4zM12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" }))); };

var MiniControlDefault = observer(function (_a) {
    var rootStore = _a.rootStore, settings = _a.settings;
    settings = settings !== null && settings !== void 0 ? settings : defaultSettings;
    if (Object.values(settings.buttons).every(function (v) { return v === false; }))
        return null;
    return (React.createElement("div", { className: 'react_fast_diagram_Minicontrol_Default', style: __assign(__assign({}, getOffsetStyles(settings)), settings === null || settings === void 0 ? void 0 : settings.containerStyle) },
        settings.buttons.deleteSelection &&
            rootStore.selectionState.selectedItems.length > 0 && (React.createElement(Button, { size: settings.buttonsSize, onClick: function () {
                return rootStore.commandExecutor.execute(removeSelectedCommand);
            } },
            React.createElement(RubbishBinIcon, null))),
        settings.buttons.cloneSelectedNodes &&
            rootStore.selectionState.selectedItems.length > 0 && (React.createElement(Button, { size: settings.buttonsSize, onClick: function () {
                return rootStore.commandExecutor.execute(cloneSelectedNodesCommand);
            } },
            React.createElement(CopyIcon, null))),
        settings.buttons.zoomIn && (React.createElement(Button, { size: settings.buttonsSize, onClick: rootStore.diagramState.zoomIn, children: '+' })),
        settings.buttons.zoomOut && (React.createElement(Button, { size: settings.buttonsSize, onClick: rootStore.diagramState.zoomOut, children: '-' })),
        settings.buttons.zoomToFit && (React.createElement(Button, { size: settings.buttonsSize, onClick: rootStore.diagramState.zoomToFit },
            React.createElement(FilterCenterFocusIcon, null)))));
});
function getOffsetStyles(settings) {
    return {
        top: settings.position == 'left-top' || settings.position == 'right-top'
            ? settings.parentOffset
            : undefined,
        right: settings.position == 'right-bottom' || settings.position == 'right-top'
            ? settings.parentOffset
            : undefined,
        bottom: settings.position == 'left-bottom' || settings.position == 'right-bottom'
            ? settings.parentOffset
            : undefined,
        left: settings.position == 'left-top' || settings.position == 'left-bottom'
            ? settings.parentOffset
            : undefined,
    };
}
var Button = function (props) { return (React.createElement("button", { onClick: props.onClick, className: 'react_fast_diagram_Minicontrol_Default_Btn', style: {
        width: props.size + 'px',
        height: props.size + 'px',
        padding: 5,
    } }, props.children)); };
var createDefaultMiniControl = function (settings) {
    var finalSettings = __assign(__assign({}, defaultSettings), (settings ? settings : {}));
    return {
        component: MiniControlDefault,
        settings: finalSettings,
    };
};
var defaultSettings = {
    position: 'left-bottom',
    containerStyle: {},
    buttonsSize: 30,
    buttons: {
        zoomIn: true,
        zoomOut: true,
        deleteSelection: true,
        cloneSelectedNodes: true,
        zoomToFit: true,
    },
    parentOffset: 20,
};

var UserInteractionSettings = /** @class */ (function () {
    function UserInteractionSettings() {
        var _this = this;
        this.import = function (obj) {
            var _a, _b, _c, _d, _e, _f;
            if (obj === true || obj === undefined || obj === null)
                _this.setAll(true);
            else if (obj === false)
                _this.setAll(false);
            else if (isObject(obj)) {
                _this._diagramZoom = (_a = obj.diagramZoom) !== null && _a !== void 0 ? _a : true;
                _this._diagramPan = (_b = obj.diagramPan) !== null && _b !== void 0 ? _b : true;
                _this._nodeDrag = (_c = obj.nodeDrag) !== null && _c !== void 0 ? _c : true;
                _this._portConnection = (_d = obj.portConnection) !== null && _d !== void 0 ? _d : true;
                _this._nodeSelection = (_e = obj.nodeSelection) !== null && _e !== void 0 ? _e : true;
                _this._linkSelection = (_f = obj.linkSelection) !== null && _f !== void 0 ? _f : true;
            }
        };
        this.setAll = function (value) {
            _this._diagramZoom = value;
            _this._diagramPan = value;
            _this._nodeDrag = value;
            _this._portConnection = value;
            _this._nodeSelection = value;
            _this._linkSelection = value;
        };
        this.import();
        makeAutoObservable(this);
    }
    Object.defineProperty(UserInteractionSettings.prototype, "diagramZoom", {
        get: function () {
            return this._diagramZoom;
        },
        set: function (value) {
            this._diagramZoom = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserInteractionSettings.prototype, "diagramPan", {
        get: function () {
            return this._diagramPan;
        },
        set: function (value) {
            this._diagramPan = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserInteractionSettings.prototype, "nodeDrag", {
        get: function () {
            return this._nodeDrag;
        },
        set: function (value) {
            this._nodeDrag = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserInteractionSettings.prototype, "portConnection", {
        get: function () {
            return this._portConnection;
        },
        set: function (value) {
            this._portConnection = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserInteractionSettings.prototype, "nodeSelection", {
        get: function () {
            return this._nodeSelection;
        },
        set: function (value) {
            this._nodeSelection = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserInteractionSettings.prototype, "linkSelection", {
        get: function () {
            return this._linkSelection;
        },
        set: function (value) {
            this._linkSelection = value;
        },
        enumerable: false,
        configurable: true
    });
    return UserInteractionSettings;
}());

var DiagramSettings = /** @class */ (function () {
    function DiagramSettings() {
        var _this = this;
        this._zoomInterval = defaultZoomInterval;
        this._zoomToFitSettings = defaultZoomToFitSettings;
        this.import = function (obj) {
            _this._backgroundComponentState.import(obj === null || obj === void 0 ? void 0 : obj.backgroundComponent);
            _this._miniControlComponentState.import(obj === null || obj === void 0 ? void 0 : obj.miniControlComponent);
            _this.setZoomInterval(obj === null || obj === void 0 ? void 0 : obj.zoomInterval);
            _this._zoomToFitSettings = __assign(__assign({}, defaultZoomToFitSettings), obj === null || obj === void 0 ? void 0 : obj.zoomToFitSettings);
            _this._userInteraction.import(obj === null || obj === void 0 ? void 0 : obj.userInteraction);
        };
        this.setZoomInterval = function (value) {
            _this._zoomInterval = value !== null && value !== void 0 ? value : defaultZoomInterval;
        };
        this._backgroundComponentState = new VisualComponentWithDefault(createDefaultBackground());
        this._miniControlComponentState = new VisualComponentWithDefault(createDefaultMiniControl());
        this._userInteraction = new UserInteractionSettings();
        makeAutoObservable(this);
    }
    Object.defineProperty(DiagramSettings.prototype, "backgroundComponentState", {
        get: function () {
            return this._backgroundComponentState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiagramSettings.prototype, "miniControlComponentState", {
        get: function () {
            return this._miniControlComponentState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiagramSettings.prototype, "zoomInterval", {
        get: function () {
            return this._zoomInterval;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiagramSettings.prototype, "zoomToFitSettings", {
        get: function () {
            return this._zoomToFitSettings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiagramSettings.prototype, "userInteraction", {
        get: function () {
            return this._userInteraction;
        },
        enumerable: false,
        configurable: true
    });
    return DiagramSettings;
}());
var defaultZoomInterval = [0.1, 3];
var defaultZoomToFitSettings = {
    padding: [30, 30],
};

var HtmlElementRefState = /** @class */ (function () {
    function HtmlElementRefState(initValue) {
        var _this = this;
        this._triggerSizePositionRecalculation = 0;
        this.offsetRelativeToParent = function (parent, zoom) {
            _this._triggerSizePositionRecalculation | 1; // to make offsetRelativeToParent dependend on _triggerSizePositionRecalculation
            var curr = _this.current;
            if (!curr)
                return null;
            var boundingRect = curr.getBoundingClientRect();
            var parentBoundingRect = parent.getBoundingClientRect();
            return [(boundingRect.x - parentBoundingRect.x) / zoom, (boundingRect.y - parentBoundingRect.y) / zoom];
        };
        this.recalculateSizeAndPosition = function () {
            _this._triggerSizePositionRecalculation += 1;
        };
        this._currentInternal = initValue;
        makeAutoObservable(this);
    }
    Object.defineProperty(HtmlElementRefState.prototype, "current", {
        get: function () {
            return this._currentInternal;
        },
        set: function (value) {
            this._currentInternal = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HtmlElementRefState.prototype, "realSize", {
        /**
         * @returns Value is calculated without zoom taking into account, that is, the same as zoom would be '1'.
         * Value can be @type {null} in case reference to real DOM object is not set.
         */
        get: function () {
            this._triggerSizePositionRecalculation | 1; // to make realSize dependend on _triggerSizePositionRecalculation
            if (this.current) {
                return [this.current.clientWidth, this.current.clientHeight];
            }
            else {
                return null;
            }
        },
        enumerable: false,
        configurable: true
    });
    return HtmlElementRefState;
}());

var DiagramState = /** @class */ (function () {
    function DiagramState(rootStore) {
        var _this = this;
        this.import = function (state) {
            _this.setOffset(state === null || state === void 0 ? void 0 : state.offset);
            _this.setZoom(state === null || state === void 0 ? void 0 : state.zoom);
        };
        this.export = function () {
            return deepCopy({
                offset: _this._offset,
                zoom: _this._zoom,
            });
        };
        this.setOffset = function (newOffset) {
            _this._offset = newOffset !== null && newOffset !== void 0 ? newOffset : [0, 0];
        };
        this.setZoom = function (newZoom) {
            _this._zoom = clampValue(newZoom !== null && newZoom !== void 0 ? newZoom : 1, _this._rootStore.diagramSettings.zoomInterval);
        };
        this.zoomIn = function () { return _this.zoomIntoCenter(1 / 0.8); };
        this.zoomOut = function () { return _this.zoomIntoCenter(0.8); };
        // See: https://stackoverflow.com/a/30039971/9142642
        this.zoomInto = function (pointToZoomInto, zoomMultiplicator) {
            var newZoom = clampValue(_this._zoom * zoomMultiplicator, _this._rootStore.diagramSettings.zoomInterval);
            var pointDisplacementAfterZoom = multiplyPoint(subtractPoints(pointToZoomInto, _this._offset), newZoom / _this._zoom);
            _this.setTransformation(
            // Compensate for the displacement by moving the point back under the cursor
            subtractPoints(pointToZoomInto, pointDisplacementAfterZoom), newZoom);
        };
        this.setTransformation = function (newOffset, newZoom) {
            _this.setOffset(newOffset);
            _this.setZoom(newZoom);
        };
        this.translate = function (translateBy) {
            _this.setOffset(addPoints(_this._offset, translateBy));
        };
        this.tranlsateAndZoomInto = function (translateBy, pointToZoomInto, zoomMultiplicator) {
            _this.translate(translateBy);
            _this.zoomInto(pointToZoomInto, zoomMultiplicator);
        };
        this.zoomIntoCenter = function (zoomMultiplicator) {
            var diagramRealSize = _this._diagramInnerRef.realSize;
            if (!diagramRealSize)
                return;
            _this.zoomInto(multiplyPoint(diagramRealSize, 0.5), zoomMultiplicator);
        };
        /**
         * Set offset and zoom values that were already rendered.
         */
        this.renderOffsetAndZoom = function (offset, zoom) {
            _this._renderedOffset = offset;
            _this._renderedZoom = zoom;
        };
        this.zoomToFit = function () {
            var nodesBoundingBox = _this._getNodesBoundingBoxWithPadding();
            var diagramSize = _this._diagramInnerRef.realSize;
            if (!diagramSize) {
                console.warn('Cannot retrieve diagram size');
                return;
            }
            var newZoom = calculateNewZoomToFitBoundingBox(diagramSize, nodesBoundingBox);
            // Extend interval to be able to set required zoom
            _this._rootStore.diagramSettings.setZoomInterval([
                Math.min(_this._rootStore.diagramSettings.zoomInterval[0], newZoom),
                Math.max(_this._rootStore.diagramSettings.zoomInterval[1], newZoom),
            ]);
            _this.setZoom(newZoom);
            _this.setOffset(calculateOffsetToCenterBoundingBox(diagramSize, newZoom, nodesBoundingBox));
        };
        this._getNodesBoundingBoxWithPadding = function () {
            var nodesBoundingBox = _this._rootStore.nodesStore.getNodesBoundingBox();
            var padding = _this._rootStore.diagramSettings.zoomToFitSettings.padding;
            nodesBoundingBox.topLeftCorner = subtractPoints(nodesBoundingBox.topLeftCorner, padding);
            nodesBoundingBox.bottomRightCorner = addPoints(nodesBoundingBox.bottomRightCorner, padding);
            nodesBoundingBox.size = subtractPoints(nodesBoundingBox.bottomRightCorner, nodesBoundingBox.topLeftCorner);
            return nodesBoundingBox;
        };
        this._diagramInnerRef = new HtmlElementRefState(null);
        this._rootStore = rootStore;
        this._renderedOffset = [0, 0];
        this._renderedZoom = 1;
        this.import();
        makeAutoObservable(this, {
            // @ts-ignore
            _rootStore: false,
        });
    }
    Object.defineProperty(DiagramState.prototype, "diagramInnerRef", {
        get: function () {
            return this._diagramInnerRef;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiagramState.prototype, "offset", {
        get: function () {
            return this._offset;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiagramState.prototype, "zoom", {
        get: function () {
            return this._zoom;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiagramState.prototype, "renderedOffset", {
        get: function () {
            return this._renderedOffset;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiagramState.prototype, "renderedZoom", {
        get: function () {
            return this._renderedZoom;
        },
        enumerable: false,
        configurable: true
    });
    return DiagramState;
}());
function calculateNewZoomToFitBoundingBox(diagramSize, boundingBox) {
    // Zoom to fit the largest size, horizontal or vertical
    var newZoom = Math.min(diagramSize[0] / boundingBox.size[0], diagramSize[1] / boundingBox.size[1]);
    return newZoom;
}
function calculateOffsetToCenterBoundingBox(diagramSize, zoom, boundingBox) {
    // Take zoom into account
    var contentSizeWithZoom = multiplyPoint(boundingBox.size, zoom);
    var topLeftCornerWithZoom = multiplyPoint(boundingBox.topLeftCorner, zoom);
    var diffBetweenDiagramAndContentSizes = subtractPoints(diagramSize, contentSizeWithZoom);
    return addPoints(multiplyPoint(topLeftCornerWithZoom, -1), // topLeft corner of content will be at topleft corner of diagram
    multiplyPoint(diffBetweenDiagramAndContentSizes, 1 / 2) // center content
    );
}

var LinkDefault = observer(function (_a) {
    var entity = _a.entity, settings = _a.settings, bind = _a.bind;
    var finalSettings = __assign(__assign({}, linkDefaultSettings), settings);
    var path = entity.path;
    if (!path)
        return null;
    var color = finalSettings.color;
    if (entity.selected && finalSettings.selectedColor)
        color = finalSettings.selectedColor;
    else if (entity.hovered && finalSettings.hoveredColor)
        color = finalSettings.hoveredColor;
    return (React.createElement("g", null,
        React.createElement("path", { d: path.svgPath, stroke: color, strokeWidth: finalSettings.strokeWidth, fill: 'none', strokeLinecap: 'round', markerStart: getMarkerBasedOnState(finalSettings.markerStart, entity.selected, entity.hovered), markerEnd: getMarkerBasedOnState(finalSettings.markerEnd, entity.selected, entity.hovered) }),
        React.createElement("path", __assign({ d: path.svgPath, stroke: color, strokeWidth: '5' }, bind(), { pointerEvents: 'auto', fill: 'none', strokeOpacity: entity.hovered && finalSettings.enableHoverEffect ? 0.22 : 0 }))));
});
function getMarkerBasedOnState(marker, selected, hovered) {
    if (!marker)
        return undefined;
    var id = undefined;
    if (typeof marker === 'string') {
        id = marker;
    }
    else {
        id = marker.default;
        if (selected && marker.selected)
            id = marker.selected;
        else if (hovered && marker.hovered)
            id = marker.hovered;
    }
    return "url(#" + id + ")";
}
var linkDefaultSettings = {
    color: '#c2c2c2',
    selectedColor: '#6eb7ff',
    hoveredColor: '#a1d0ff',
    strokeWidth: 1,
    cirleRadius: 3,
    enableHoverEffect: true
};
function createLinkDefault(settings) {
    return {
        component: LinkDefault,
        settings: settings,
    };
}

function getDegree(dir) {
    switch (dir) {
        case 'left':
            return 180;
        case 'up':
            return 90;
        case 'right':
            return 0;
        case 'down':
            return 270;
        case 'left-up':
            return 135;
        case 'right-up':
            return 45;
        case 'right-down':
            return 315;
        case 'left-down':
            return 225;
        default:
            return undefined;
    }
}
function getRadian(dir) {
    var degree = getDegree(dir);
    return degree !== undefined ? degree * Math.PI / 180 : undefined;
}
function createVector(point1, length, angleInRadian) {
    return [
        point1[0] +
            length * (angleInRadian !== undefined ? Math.cos(angleInRadian) : 0),
        point1[1] + length * (angleInRadian !== undefined ? -Math.sin(angleInRadian) : 0),
    ];
}
function commandM(point) {
    return 'M ' + coordinateFromPoint(point);
}
function commandC(startPoint, control1, control2, endPoint) {
    return (commandM(startPoint) +
        ' C ' +
        coordinateFromPoint(control1) +
        ' ' +
        coordinateFromPoint(control2) +
        ' ' +
        coordinateFromPoint(endPoint));
}
function coordinateFromPoint(point) {
    return point[0] + " " + point[1];
}

function curvedLinkPathConstructor(source, target, settings) {
    if (!source || !target)
        return '';
    var directionFactor = settings.tweakDirectionFactorBasedOnDistance(distanceBetweenPoints(source.point, target.point), settings.directionFactor);
    return commandC(source.point, createVector(source.point, directionFactor, getRadian(source.direction)), createVector(target.point, directionFactor, getRadian(target.direction)), target.point);
}
var defualtSettings = {
    directionFactor: 60,
    tweakDirectionFactorBasedOnDistance: function (distance, directionFactor) {
        if (distance < 100) {
            return directionFactor * (distance / 100);
        }
        return directionFactor;
    },
};
function createCurvedLinkPathConstructor(settings) {
    return function (source, target) {
        return curvedLinkPathConstructor(source, target, settings ? __assign(__assign({}, defualtSettings), settings) : defualtSettings);
    };
}

var LinkCreationState = /** @class */ (function () {
    function LinkCreationState(rootStore) {
        var _this = this;
        this._source = null;
        this._target = null;
        this._targetPortCandidate = null;
        this.startLinking = function (portState, pointOnPort) {
            _this._resetProps();
            _this._source = new LinkPortEndpointState(portState.nodeId, portState.id, _this._rootStore);
            var sourcePoint = _this._source.point;
            var portSize = _this._source.port.realSize;
            if (sourcePoint && portSize) {
                // endpoint point is calculated for center of port
                var topLeftCornerPoint = subtractPoints(sourcePoint, multiplyPoint(portSize, 0.5));
                _this._target = new LinkPointEndpointState(addPoints(topLeftCornerPoint, multiplyPoint(pointOnPort, 1 / _this._rootStore.diagramState.zoom)));
            }
            else {
                _this._resetProps();
                return false;
            }
            return true;
        };
        this.setTargetPortCandidate = function (portState) {
            if (!_this._source)
                return;
            var canAddLink = _this._rootStore.linksStore.validateLink({
                source: {
                    nodeId: _this._source.nodeId,
                    portId: _this._source.portId,
                },
                target: {
                    nodeId: portState.nodeId,
                    portId: portState.id,
                },
            });
            _this._targetPortCandidate = portState;
            if (canAddLink.success) {
                portState.validForConnection = true;
            }
            else {
                portState.validForConnection = false;
            }
        };
        this.resetTargetPortCandidate = function (portState) {
            if (_this._targetPortCandidate === portState) {
                _this._targetPortCandidate = null;
            }
            portState.validForConnection = true;
        };
        this.stopLinking = function () {
            if (_this._targetPortCandidate && _this._source) {
                var result = _this._rootStore.linksStore.validateAndAddLink({
                    source: {
                        nodeId: _this._source.nodeId,
                        portId: _this._source.portId,
                    },
                    target: {
                        nodeId: _this._targetPortCandidate.nodeId,
                        portId: _this._targetPortCandidate.id,
                    },
                });
                if (result.success) {
                    _this._rootStore.selectionState.select(result.value, true);
                }
            }
            _this._resetProps();
        };
        this._resetProps = function () {
            if (_this._source) {
                if (_this._source.port) {
                    _this._source.port.validForConnection = true;
                }
                _this._source = null;
            }
            _this._target = null;
            if (_this._targetPortCandidate) {
                _this._targetPortCandidate.validForConnection = true;
                _this._targetPortCandidate = null;
            }
        };
        makeAutoObservable(this);
        this._rootStore = rootStore;
    }
    Object.defineProperty(LinkCreationState.prototype, "selected", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkCreationState.prototype, "hovered", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkCreationState.prototype, "source", {
        get: function () {
            return this._source;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkCreationState.prototype, "target", {
        get: function () {
            return this._target;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkCreationState.prototype, "targetPortCandidate", {
        get: function () {
            return this._targetPortCandidate;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkCreationState.prototype, "isLinking", {
        get: function () {
            return !!this._source;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkCreationState.prototype, "componentDefinition", {
        get: function () {
            var visualComponents = this._rootStore.linksSettings.visualComponents;
            return visualComponents.getComponent(linkCreationComponentType);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkCreationState.prototype, "path", {
        get: function () {
            if (!this._source || !this._target)
                return undefined;
            else
                return createLinkPath(this._rootStore, this._source, this._target);
        },
        enumerable: false,
        configurable: true
    });
    return LinkCreationState;
}());
var linkCreationComponentType = 'linkCreation';

var CircleMarker = function (props) {
    var _a;
    var finalSettings = {
        id: props.id,
        radius: (_a = props.radius) !== null && _a !== void 0 ? _a : 2,
        style: __assign({ stroke: 'none', fill: 'rgb(194, 194, 194)' }, props.style),
    };
    return (React.createElement("marker", { id: finalSettings.id, overflow: 'visible', markerUnits: 'userSpaceOnUse' },
        React.createElement("circle", { r: finalSettings.radius, style: finalSettings.style })));
};
function createCircleMarker(settings) {
    return function () { return React.createElement(CircleMarker, __assign({}, settings)); };
}
var ArrowMarker = function (props) {
    var _a, _b;
    var finalSettings = {
        id: props.id,
        height: (_a = props.height) !== null && _a !== void 0 ? _a : 10,
        width: (_b = props.width) !== null && _b !== void 0 ? _b : 10,
        style: __assign({ stroke: 'none', fill: 'rgb(194, 194, 194)' }, props.style),
    };
    return (React.createElement("marker", { id: finalSettings.id, overflow: 'visible', markerUnits: 'userSpaceOnUse', refX: '-0.5', orient: 'auto' },
        React.createElement("path", { d: "M 0 0 -" + finalSettings.width + " -" + finalSettings.height / 2 + " -" + finalSettings.width + " " + finalSettings.height / 2 + " z", style: finalSettings.style })));
};
function createArrowMarker(settings) {
    return function () { return React.createElement(ArrowMarker, __assign({}, settings)); };
}

var LinksSettings = /** @class */ (function () {
    function LinksSettings() {
        var _a;
        var _this = this;
        this._visualComponents = new VisualComponents((_a = {},
            _a[componentDefaultType] = createLinkDefault(),
            _a[linkCreationComponentType] = createLinkDefault({
                markerEnd: 'default_circle_marker_selected',
            }),
            _a));
        this._defaultSvgMarkers = [
            createCircleMarker({
                id: 'default_circle_marker',
                style: {
                    fill: '#c2c2c2',
                },
            }),
            createCircleMarker({
                id: 'default_circle_marker_selected',
                style: {
                    fill: '#6eb7ff',
                },
            }),
            createCircleMarker({
                id: 'default_circle_marker_hovered',
                style: {
                    fill: '#a1d0ff',
                },
            }),
            createArrowMarker({
                id: 'default_arrow_marker',
                style: {
                    fill: '#c2c2c2',
                },
            }),
            createArrowMarker({
                id: 'default_arrow_marker_selected',
                style: {
                    fill: '#6eb7ff',
                },
            }),
            createArrowMarker({
                id: 'default_arrow_marker_hovered',
                style: {
                    fill: '#a1d0ff',
                },
            }),
        ];
        this._svgMarkers = [];
        this.import = function (obj) {
            var _a;
            _this._visualComponents.import(obj);
            _this.setPathConstructor(obj === null || obj === void 0 ? void 0 : obj.pathConstructor);
            _this._preferLinksDirection = (_a = obj === null || obj === void 0 ? void 0 : obj.preferLinksDirection) !== null && _a !== void 0 ? _a : 'horizontal';
            _this._svgMarkers = (obj === null || obj === void 0 ? void 0 : obj.svgMarkers) ? __spreadArrays(obj.svgMarkers, _this._defaultSvgMarkers) : _this._defaultSvgMarkers;
        };
        this.setPathConstructor = function (value) {
            _this._pathConstructor = value !== null && value !== void 0 ? value : defaultPathConstructor;
        };
        this.import();
        makeAutoObservable(this);
    }
    Object.defineProperty(LinksSettings.prototype, "pathConstructor", {
        get: function () {
            return this._pathConstructor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinksSettings.prototype, "visualComponents", {
        get: function () {
            return this._visualComponents;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinksSettings.prototype, "preferLinksDirection", {
        get: function () {
            return this._preferLinksDirection;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinksSettings.prototype, "svgMarkers", {
        get: function () {
            return this._svgMarkers;
        },
        enumerable: false,
        configurable: true
    });
    return LinksSettings;
}());
var defaultPathConstructor = createCurvedLinkPathConstructor();

function guidS4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
function guid() {
    // return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return (guidS4() +
        guidS4() +
        '-' +
        guidS4() +
        '-' +
        guidS4() +
        '-' +
        guidS4() +
        '-' +
        guidS4() +
        guidS4() +
        guidS4());
}
function guidForcedUniqueness(checkExistence) {
    var id = guid();
    while (checkExistence(id)) {
        id = guid();
    }
    return id;
}

var PortState = /** @class */ (function () {
    function PortState(rootStore, id, nodeId, state) {
        var _this = this;
        this._ref = new HtmlElementRefState(null);
        this._dragging = false;
        this._hovered = false;
        this._validForConnection = true;
        this._sizeAndPositionRecalculationWithDelay = 0;
        this.setLabel = function (value) {
            _this._label = value !== null && value !== void 0 ? value : '';
        };
        this.setType = function (value) {
            _this._type = value !== null && value !== void 0 ? value : componentDefaultType;
        };
        /**
         * Update all properties. If some property missing in `state` parameter, the default one will be used.
         */
        this.import = function (state) {
            _this.setType(state === null || state === void 0 ? void 0 : state.type);
            _this.setLabel(state === null || state === void 0 ? void 0 : state.label);
            _this.setExtra(state === null || state === void 0 ? void 0 : state.extra);
            _this.setComponent(state === null || state === void 0 ? void 0 : state.component);
            _this.setLinkDirection(state === null || state === void 0 ? void 0 : state.linkDirection);
            _this.setIsConnectionEnabled(state === null || state === void 0 ? void 0 : state.isConnectionEnabled);
        };
        /**
         * Update only those properties presented in `state` parameter
         */
        this.update = function (state) {
            if (!state)
                return;
            state.type && _this.setType(state.type);
            state.label && _this.setLabel(state.label);
            state.extra && _this.setExtra(state.extra);
            state.component && _this.setComponent(state.component);
            state.linkDirection && _this.setLinkDirection(state.linkDirection);
            state.isConnectionEnabled &&
                _this.setIsConnectionEnabled(state.isConnectionEnabled);
        };
        this.export = function () {
            var _a, _b;
            return deepCopy({
                id: _this._id,
                nodeId: _this._nodeId,
                label: _this._label,
                type: _this._type,
                linkDirection: (_a = _this._linkDirection) !== null && _a !== void 0 ? _a : undefined,
                isConnectionEnabled: (_b = _this._isConnectionEnabled) !== null && _b !== void 0 ? _b : undefined,
            });
        };
        this.setExtra = function (value) {
            _this._extra = value !== null && value !== void 0 ? value : null;
        };
        this.setComponent = function (value) {
            if (!value) {
                _this._component = null;
            }
            else {
                _this._component = new VisualComponentState(value);
            }
        };
        this.setLinkDirection = function (value) {
            _this._linkDirection = value !== null && value !== void 0 ? value : null;
        };
        this.setLinkDirectionIfNotYet = function (direction) {
            var _a;
            _this._linkDirection = (_a = _this._linkDirection) !== null && _a !== void 0 ? _a : direction;
        };
        this.recalculateSizeAndPosition = function () {
            _this._sizeAndPositionRecalculationWithDelay += 1;
        };
        this.recalculateSizeAndPositionWithoutDelay = function () {
            _this._ref.recalculateSizeAndPosition();
        };
        this.setIsConnectionEnabled = function (value) {
            _this._isConnectionEnabled = isBoolean(value) ? value : null;
        };
        this._id = id;
        this._nodeId = nodeId;
        this.import(state);
        makeAutoObservable(this);
        this._rootStore = rootStore;
        reaction(function () { return [
            _this._id,
            _this._nodeId,
            _this._label,
            _this._type,
            _this._extra,
            _this._component,
        ]; }, function () {
            _this.recalculateSizeAndPosition();
        });
    }
    Object.defineProperty(PortState.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "nodeId", {
        get: function () {
            return this._nodeId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "fullId", {
        get: function () {
            return createFullPortId(this.nodeId, this.id);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "ref", {
        get: function () {
            return this._ref;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "dragging", {
        get: function () {
            return this._dragging;
        },
        set: function (value) {
            this._dragging = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "hovered", {
        get: function () {
            return this._hovered;
        },
        set: function (value) {
            this._hovered = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "validForConnection", {
        get: function () {
            return this._validForConnection;
        },
        set: function (value) {
            this._validForConnection = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "label", {
        get: function () {
            return this._label;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "extra", {
        get: function () {
            return this._extra;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "node", {
        get: function () {
            var node = this._rootStore.nodesStore.getNode(this.nodeId);
            if (node)
                return node;
            else
                throw "Node with id '" + this.nodeId + "' does not exist";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "offsetRelativeToNode", {
        get: function () {
            if (this.node.ref.current) {
                return this._ref.offsetRelativeToParent(this.node.ref.current, 
                // Zoom property cannot be used here because to calculate offset we use real
                // html elements that have not been rendered with the new zoom at this time
                this._rootStore.diagramState.renderedZoom);
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "realSize", {
        /**
         * @returns Value is calculated without zoom taking into account, that is, the same as zoom would be '1'.
         * Value can be @type {null} in case reference to real DOM object is not set.
         */
        get: function () {
            return this._ref.realSize;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "componentDefinition", {
        get: function () {
            if (this._component)
                return this._component;
            var portVisualComponents = this._rootStore.portsSettings.portVisualComponents;
            return portVisualComponents.getComponent(this.type);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "connectedLinks", {
        get: function () {
            return this._rootStore.linksStore.getPortLinks(this.nodeId, this.id);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "connectedPorts", {
        get: function () {
            var _this = this;
            return this.connectedLinks
                .map(function (v) {
                return v.source.portId === _this._id ? v.target.port : v.source.port;
            })
                .filter(function (p) { return p; }); // cast because typescript cannot deal with undefined check
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "linkDirection", {
        get: function () {
            if (this._linkDirection)
                return this._linkDirection;
            // Try to guess
            if (!this.offsetRelativeToNode)
                return undefined;
            var nodeCenter = this.node.realSize && multiplyPoint(this.node.realSize, 0.5);
            if (!nodeCenter)
                return undefined;
            if (this._rootStore.linksSettings.preferLinksDirection === 'horizontal') {
                return this.offsetRelativeToNode[0] < nodeCenter[0] ? 'left' : 'right';
            }
            else if (this._rootStore.linksSettings.preferLinksDirection === 'vertical') {
                return this.offsetRelativeToNode[1] < nodeCenter[1] ? 'up' : 'down';
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "sizeAndPositionRecalculationWithDelay", {
        get: function () {
            return this._sizeAndPositionRecalculationWithDelay;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PortState.prototype, "isConnectionEnabled", {
        get: function () {
            return this._isConnectionEnabled === null
                ? this._rootStore.diagramSettings.userInteraction.portConnection
                : this._isConnectionEnabled;
        },
        enumerable: false,
        configurable: true
    });
    return PortState;
}());
function createFullPortId(nodeId, portId) {
    return nodeId + "-" + portId;
}

var LinksStore = /** @class */ (function () {
    function LinksStore(rootStore) {
        var _this = this;
        this.import = function (newLinks) {
            _this._links = new Map();
            _this._nodesLinksCollection = new Map();
            // do not check existence of link's ports as they could be added after first node rendering
            newLinks &&
                newLinks.forEach(function (link) {
                    if (_this.validateLinkProperties(link)) {
                        _this.addLink(link);
                    }
                });
        };
        this.export = function () {
            return Array.from(_this._links).map(function (_a) {
                _a[0]; var value = _a[1];
                return value.export();
            });
        };
        this.getNodeLinks = function (nodeId) {
            var _a;
            return (_a = _this._nodesLinksCollection.get(nodeId)) !== null && _a !== void 0 ? _a : [];
        };
        this.getLink = function (id) {
            return _this.links.get(id);
        };
        this.getPortLinks = function (nodeId, portId) {
            var nodeLinks = _this.getNodeLinks(nodeId);
            var fullPortId = createFullPortId(nodeId, portId);
            return nodeLinks.filter(function (l) {
                return (l.source.port && l.source.port.fullId === fullPortId) ||
                    (l.target.port && l.target.port.fullId === fullPortId);
            });
        };
        this.removeNodeLinks = function (nodeId) {
            var links = _this.getNodeLinks(nodeId);
            links.forEach(function (l) { return _this.removeLink(l.id); });
        };
        this.removePortLinks = function (nodeId, portId) {
            if (!nodeId || !portId)
                return;
            var links = _this.getNodeLinks(nodeId);
            var endpointToRemove = {
                nodeId: nodeId,
                portId: portId,
            };
            links.forEach(function (l) {
                if (linkPortEndpointsEquals(l.source, endpointToRemove) ||
                    linkPortEndpointsEquals(l.target, endpointToRemove)) {
                    _this.removeLink(l.id);
                }
            });
        };
        this.addLink = function (link) {
            var _a;
            var newLink = new LinkState(_this._rootStore, (_a = link.id) !== null && _a !== void 0 ? _a : guidForcedUniqueness(function (id) { return _this._links.has(id); }), link);
            _this._links.set(newLink.id, newLink);
            _this._addLinkToNodeLinksCollection(newLink, link.source.nodeId);
            _this._addLinkToNodeLinksCollection(newLink, link.target.nodeId);
            return newLink;
        };
        this.validateAndAddLink = function (link) {
            var canAdd = _this.validateLink(link);
            if (!canAdd.success)
                return canAdd;
            var newlyCreatedLink = _this.addLink(link);
            return successValueResult(newlyCreatedLink);
        };
        this.removeLink = function (linkId) {
            var linkToRemove = _this._links.get(linkId);
            if (linkToRemove) {
                _this._removeLinkFromNodeLinksCollection(linkToRemove, linkToRemove.source.nodeId);
                _this._removeLinkFromNodeLinksCollection(linkToRemove, linkToRemove.target.nodeId);
                _this._rootStore.selectionState.unselect(linkToRemove);
                _this._links.delete(linkId);
                return true;
            }
            return false;
        };
        this.validateLink = function (link) {
            var _a, _b;
            var propsValidationResult = _this.validateLinkProperties(link);
            if (!propsValidationResult.success)
                return propsValidationResult;
            var sourcePortResult = _this.getEndpointPortOrError(link.source);
            if (!sourcePortResult.success)
                return sourcePortResult;
            var targetPortResult = _this.getEndpointPortOrError(link.target);
            if (!targetPortResult.success)
                return targetPortResult;
            if (_this.areEndpointsConnected(link.source, link.target))
                return errorResult("Link's endpoints are already connected");
            if (((_b = (_a = _this._rootStore.callbacks).validateLinkEndpoints) === null || _b === void 0 ? void 0 : _b.call(_a, sourcePortResult.value, targetPortResult.value)) === false) {
                return errorResult("Link's endpoints are not valid according to validation callback");
            }
            return successResult();
        };
        this.validateLinkProperties = function (link) {
            if (!link)
                return errorResult("Cannot add empty");
            if (link.id && typeof link !== 'string')
                return errorResult("Cannot add link with id '" + link.id + "' of type different than 'string'");
            if (link.id && _this._links.has(link.id))
                return errorResult("Cannot add link with id '" + link.id + "', as it already exists");
            if (link.source.nodeId === link.target.nodeId)
                return errorResult("Link's endpoints are located in the same node");
            return successResult();
        };
        this.getEndpointPortOrError = function (endpoint) {
            var node = _this._rootStore.nodesStore.getNode(endpoint.nodeId);
            if (!node)
                return errorResult("Node '" + endpoint.nodeId + "' of link's endpoint does not exist");
            var port = node.getPort(endpoint.portId);
            if (!port)
                return errorResult("Port with id '" + endpoint.portId + "' does not exist in the node '" + endpoint.nodeId + "'");
            return successValueResult(port);
        };
        this.getEndpointPort = function (endpoint) {
            var _a;
            return (_a = _this._rootStore.nodesStore
                .getNode(endpoint.nodeId)) === null || _a === void 0 ? void 0 : _a.getPort(endpoint.portId);
        };
        this.areEndpointsConnected = function (source, target) {
            return !!_this.getLinkForEndpointsIfExists(source, target);
        };
        this.getLinkForEndpointsIfExists = function (source, target) {
            var links = _this._nodesLinksCollection.get(source.nodeId);
            if (links) {
                return links.find(function (l) {
                    return (linkPortEndpointsEquals(l.source, source) &&
                        linkPortEndpointsEquals(l.target, target)) ||
                        (linkPortEndpointsEquals(l.target, source) &&
                            linkPortEndpointsEquals(l.source, target));
                });
            }
        };
        this._addLinkToNodeLinksCollection = function (link, nodeId) {
            var links = _this._nodesLinksCollection.get(nodeId);
            if (!links) {
                _this._nodesLinksCollection.set(nodeId, [link]);
            }
            else {
                links.push(link);
            }
        };
        this._removeLinkFromNodeLinksCollection = function (link, nodeId) {
            var collection = _this._nodesLinksCollection.get(nodeId);
            if (collection) {
                collection = collection.filter(function (l) { return l.id !== link.id; });
                if (collection.length > 0) {
                    _this._nodesLinksCollection.set(nodeId, collection);
                }
                else {
                    _this._nodesLinksCollection.delete(nodeId);
                }
            }
        };
        this._linkCreation = new LinkCreationState(rootStore);
        this.import();
        makeAutoObservable(this);
        this._rootStore = rootStore;
    }
    Object.defineProperty(LinksStore.prototype, "links", {
        get: function () {
            return this._links;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinksStore.prototype, "linkCreation", {
        get: function () {
            return this._linkCreation;
        },
        enumerable: false,
        configurable: true
    });
    return LinksStore;
}());

var NodeLabel = observer(function (_a) {
    var node = _a.node;
    return React.createElement("span", null, node.label ? node.label : node.id);
});

function useUpdateOrCreatePortState(port) {
    var nodesStore = useRootStore().nodesStore;
    return useMemo(function () {
        var node = nodesStore.getNode(port.nodeId);
        if (!node)
            return undefined;
        var portState = port.id ? node.getPort(port.id) : undefined;
        if (portState) {
            portState.update(port);
        }
        else {
            var result = node.addPort(port);
            if (result.success) {
                portState = result.value;
            }
        }
        return portState;
    }, [
        nodesStore,
        port === null || port === void 0 ? void 0 : port.id,
        port === null || port === void 0 ? void 0 : port.nodeId,
        port === null || port === void 0 ? void 0 : port.component,
        port === null || port === void 0 ? void 0 : port.extra,
        port === null || port === void 0 ? void 0 : port.isConnectionEnabled,
        port === null || port === void 0 ? void 0 : port.label,
        port === null || port === void 0 ? void 0 : port.linkDirection,
        port === null || port === void 0 ? void 0 : port.type,
    ]);
}

var useRelativePositionStyles = function (position, offsetFromParentCenter, offsetFromOrigin, usePortCenterPivot) {
    if (usePortCenterPivot === void 0) { usePortCenterPivot = true; }
    return useMemo(function () {
        if (!position)
            return {};
        var positionStyle = { position: 'absolute' };
        if (!isNumber(offsetFromParentCenter))
            offsetFromParentCenter = 0;
        if (!isPoint(offsetFromOrigin))
            offsetFromOrigin = [0, 0];
        if (position === 'left-top') {
            positionStyle.left = offsetFromOrigin[0] - offsetFromParentCenter;
            positionStyle.top = offsetFromOrigin[1];
            if (usePortCenterPivot)
                positionStyle.transform = "translateX(-50%)";
        }
        else if (position === 'left-center') {
            positionStyle.left = offsetFromOrigin[0] - offsetFromParentCenter;
            positionStyle.top = '50%';
            positionStyle.transform = "translate(" + (usePortCenterPivot ? '-50%' : 0) + ", calc(-50% + " + offsetFromOrigin[1] + "px))";
        }
        else if (position === 'left-bottom') {
            positionStyle.left = offsetFromOrigin[0] - offsetFromParentCenter;
            positionStyle.bottom = -offsetFromOrigin[1];
            if (usePortCenterPivot)
                positionStyle.transform = "translateX(-50%)";
        }
        if (position === 'top-left') {
            positionStyle.left = offsetFromOrigin[0];
            positionStyle.top = offsetFromOrigin[1] - offsetFromParentCenter;
            if (usePortCenterPivot)
                positionStyle.transform = "translateY(-50%)";
        }
        else if (position === 'top-center') {
            positionStyle.left = '50%';
            positionStyle.transform = "translate(calc(-50% + " + offsetFromOrigin[0] + "px), " + (usePortCenterPivot ? '-50%' : 0) + ")";
            positionStyle.top = offsetFromOrigin[1] - offsetFromParentCenter;
        }
        else if (position === 'top-right') {
            positionStyle.right = -offsetFromOrigin[0];
            positionStyle.top = offsetFromOrigin[1] - offsetFromParentCenter;
            if (usePortCenterPivot)
                positionStyle.transform = "translateY(-50%)";
        }
        if (position === 'right-top') {
            positionStyle.right = -offsetFromOrigin[0] - offsetFromParentCenter;
            positionStyle.top = offsetFromOrigin[1];
            if (usePortCenterPivot)
                positionStyle.transform = "translateX(50%)";
        }
        else if (position === 'right-center') {
            positionStyle.right = -offsetFromOrigin[0] - offsetFromParentCenter;
            positionStyle.top = '50%';
            positionStyle.transform = "translate(" + (usePortCenterPivot ? '50%' : 0) + ", calc(-50% + " + offsetFromOrigin[1] + "px))";
        }
        else if (position === 'right-bottom') {
            positionStyle.right = -offsetFromOrigin[0] - offsetFromParentCenter;
            positionStyle.bottom = -offsetFromOrigin[1];
            if (usePortCenterPivot)
                positionStyle.transform = "translateX(50%)";
        }
        if (position === 'bottom-left') {
            positionStyle.left = offsetFromOrigin[0];
            positionStyle.bottom = -offsetFromOrigin[1] - offsetFromParentCenter;
            if (usePortCenterPivot)
                positionStyle.transform = "translateY(50%)";
        }
        else if (position === 'bottom-center') {
            positionStyle.left = '50%';
            positionStyle.transform = "translate(calc(-50% + " + offsetFromOrigin[0] + "px), " + (usePortCenterPivot ? '50%' : 0) + ")";
            positionStyle.bottom = -offsetFromOrigin[1] - offsetFromParentCenter;
        }
        else if (position === 'bottom-right') {
            positionStyle.right = -offsetFromOrigin[0];
            positionStyle.bottom = -offsetFromOrigin[1] - offsetFromParentCenter;
            if (usePortCenterPivot)
                positionStyle.transform = "translateY(50%)";
        }
        if (position === 'diagonal-left-top') {
            positionStyle.left = offsetFromOrigin[0] - offsetFromParentCenter;
            positionStyle.top = offsetFromOrigin[1] - offsetFromParentCenter;
            if (usePortCenterPivot)
                positionStyle.transform = "translate(-50%, -50%)";
        }
        else if (position === 'diagonal-right-top') {
            positionStyle.right = -offsetFromOrigin[0] - offsetFromParentCenter;
            positionStyle.top = offsetFromOrigin[1] - offsetFromParentCenter;
            if (usePortCenterPivot)
                positionStyle.transform = "translate(50%, -50%)";
        }
        else if (position === 'diagonal-right-bottom') {
            positionStyle.right = -offsetFromOrigin[0] - offsetFromParentCenter;
            positionStyle.bottom = -offsetFromOrigin[1] - offsetFromParentCenter;
            if (usePortCenterPivot)
                positionStyle.transform = "translate(50%, 50%)";
        }
        else if (position === 'diagonal-left-bottom') {
            positionStyle.left = offsetFromOrigin[0] - offsetFromParentCenter;
            positionStyle.bottom = -offsetFromOrigin[1] - offsetFromParentCenter;
            if (usePortCenterPivot)
                positionStyle.transform = "translate(-50%, 50%)";
        }
        return positionStyle;
    }, [position, offsetFromParentCenter, offsetFromOrigin, usePortCenterPivot]);
};
var portPositionValues = [
    'left-top',
    'left-center',
    'left-bottom',
    'top-left',
    'top-center',
    'top-right',
    'right-top',
    'right-center',
    'right-bottom',
    'bottom-left',
    'bottom-center',
    'bottom-right',
    'diagonal-left-top',
    'diagonal-right-top',
    'diagonal-right-bottom',
    'diagonal-left-bottom',
];

var usePortUserInteraction = function (portState) {
    var _a, _b;
    var _c = useRootStore(), linkCreation = _c.linksStore.linkCreation, diagramState = _c.diagramState;
    var handlers = useMemo(function () { return ({
        onDrag: function (_a) {
            var _b;
            var delta = _a.delta;
            if (!portState || !portState.dragging)
                return;
            var parentScale = diagramState.zoom;
            (_b = linkCreation.target) === null || _b === void 0 ? void 0 : _b.translateBy(multiplyPoint(delta, 1 / parentScale));
        },
        onDragStart: function (_a) {
            var event = _a.event, xy = _a.xy;
            if (!portState || !portState.isConnectionEnabled)
                return;
            // Important! Otherwise on touch display onPointerEnter will not work!
            var portHtmlElement = event.target;
            portHtmlElement.releasePointerCapture(event.pointerId);
            var clientRect = portHtmlElement.getBoundingClientRect();
            var pointOnPort = subtractPoints(xy, [clientRect.x, clientRect.y]);
            if (linkCreation.startLinking(portState, pointOnPort)) {
                portState.dragging = true;
            }
        },
        onDragEnd: function () {
            if (!portState)
                return;
            portState.dragging = false;
            linkCreation.stopLinking();
        },
        onPointerEnter: function () {
            if (!portState)
                return;
            if (portState.isConnectionEnabled) {
                portState.hovered = true;
                linkCreation.setTargetPortCandidate(portState);
            }
        },
        onPointerLeave: function () {
            if (!portState)
                return;
            portState.hovered = false;
            linkCreation.resetTargetPortCandidate(portState);
        },
    }); }, [portState, linkCreation, diagramState]);
    // Temporary bug fix when pointer events handlers are not reasigned.
    // See https://github.com/pmndrs/react-use-gesture/issues/263 and https://github.com/pmndrs/react-use-gesture/issues/264
    // There could be some other bugs related to handlers object replacing
    var bind = useGesture(handlers, {
        eventOptions: { passive: false },
    });
    useUserAbilityToSelectSwitcher(!!(portState === null || portState === void 0 ? void 0 : portState.dragging), (_b = (_a = portState === null || portState === void 0 ? void 0 : portState.ref.current) === null || _a === void 0 ? void 0 : _a.ownerDocument) === null || _b === void 0 ? void 0 : _b.body);
    useDiagramCursor(!!(portState === null || portState === void 0 ? void 0 : portState.dragging), 'pointer');
    return {
        active: !!(portState === null || portState === void 0 ? void 0 : portState.dragging),
        bind: bind,
    };
};

var Port = observer(function (props) {
    var node = useContext(NodeContext); // node should already exist
    var portState = useUpdateOrCreatePortState(__assign(__assign({ linkDirection: props.position && positionToLinkDirection[props.position] }, props), { nodeId: node.id }));
    var positionStyles = useRelativePositionStyles(props.position, props.offsetFromNodeCenter, props.offsetFromOrigin);
    useRenderingReport(props.id);
    var bind = usePortUserInteraction(portState).bind;
    useEffect(function () {
        portState === null || portState === void 0 ? void 0 : portState.ref.recalculateSizeAndPosition();
    }, [
        portState,
        portState === null || portState === void 0 ? void 0 : portState.ref,
        portState === null || portState === void 0 ? void 0 : portState.sizeAndPositionRecalculationWithDelay,
    ]);
    if (!portState) {
        return null;
    }
    return (React.createElement("div", __assign({ style: positionStyles, id: portState.fullId, className: className, ref: portState.ref, key: portState.fullId }, bind()),
        React.createElement(portState.componentDefinition.component, { entity: portState, settings: portState.componentDefinition.settings })));
});
var className = "react_fast_diagram_Port " + disableNodeUserInteractionClassName;
/**
 * Report to NodeWrapper that port was rendered so it can clean up the old ports
 * @param id - port id
 */
var useRenderingReport = function (id) {
    var _a = useContext(RenderedPortsComponentsContext), render = _a.render, unrender = _a.unrender;
    useEffect(function () {
        render(id);
        return function () { return unrender(id); };
    }, [id]);
};
var positionToLinkDirection = {
    'left-center': 'left',
    'left-bottom': 'left',
    'left-top': 'left',
    'top-left': 'up',
    'top-center': 'up',
    'top-right': 'up',
    'right-center': 'right',
    'right-bottom': 'right',
    'right-top': 'right',
    'bottom-left': 'down',
    'bottom-center': 'down',
    'bottom-right': 'down',
    'diagonal-left-top': 'left-up',
    'diagonal-right-top': 'right-up',
    'diagonal-right-bottom': 'right-down',
    'diagonal-left-bottom': 'left-down',
};

var Node = observer(function (_a) {
    var entity = _a.entity, settings = _a.settings, draggableRef = _a.draggableRef;
    var finalSettings = __assign(__assign({}, defaultNodeDefaultSettings), settings);
    var finalStyles = __assign(__assign({}, finalSettings.style), (entity.selected ? finalSettings.selectedStyle : undefined));
    return (React.createElement("div", { ref: draggableRef, className: 'react_fast_diagram_Node_Default', style: finalStyles },
        React.createElement(finalSettings.innerNode, { node: entity }),
        Array.isArray(finalSettings.ports) &&
            finalSettings.ports.map(function (p) { return React.createElement(Port, __assign({}, p, { key: p.id })); })));
});
var defaultNodeDefaultSettings = {
    style: {
        padding: '10px',
    },
    selectedStyle: {
        border: '#6eb7ff solid 1px',
    },
    innerNode: NodeLabel,
};
function createNode(settings) {
    return {
        component: Node,
        settings: __assign(__assign({}, defaultNodeDefaultSettings), settings),
    };
}
var createInputOutputHorizontalNode = function (settings) {
    return createNode(__assign(__assign({}, settings), { ports: [
            { id: 'input', type: 'input', position: 'left-center' },
            { id: 'output', type: 'output', position: 'right-center' },
        ] }));
};
var createInputOutputVerticalNode = function (settings) {
    return createNode(__assign(__assign({}, settings), { ports: [
            { id: 'input', type: 'input', position: 'top-center' },
            { id: 'output', type: 'output', position: 'bottom-center' },
        ] }));
};
var createInputHorizontalNode = function (settings) {
    return createNode(__assign(__assign({}, settings), { ports: [{ id: 'input', type: 'input', position: 'left-center' }] }));
};
var createInputVerticalNode = function (settings) {
    return createNode(__assign(__assign({}, settings), { ports: [{ id: 'input', type: 'input', position: 'top-center' }] }));
};
var createOutputHorizontalNode = function (settings) {
    return createNode(__assign(__assign({}, settings), { ports: [{ id: 'output', type: 'output', position: 'right-center' }] }));
};
var createOutputVerticalNode = function (settings) {
    return createNode(__assign(__assign({}, settings), { ports: [{ id: 'output', type: 'output', position: 'bottom-center' }] }));
};
var createStarNode = function (settings) {
    return createNode(__assign(__assign({}, settings), { ports: [
            { id: 'left', position: 'left-center' },
            { id: 'top', position: 'top-center' },
            { id: 'right', position: 'right-center' },
            { id: 'bottom', position: 'bottom-center' },
        ] }));
};

var NodesSettings = /** @class */ (function () {
    function NodesSettings() {
        var _a;
        var _this = this;
        this._visualComponents = new VisualComponents((_a = {},
            _a[componentDefaultType] = createNode({ ports: [] }),
            _a.input_output_horizontal = createInputOutputHorizontalNode(),
            _a.input_output_vertical = createInputOutputVerticalNode(),
            _a.input_vertical = createInputVerticalNode(),
            _a.input_horizontal = createInputHorizontalNode(),
            _a.output_vertical = createOutputVerticalNode(),
            _a.output_horizontal = createOutputHorizontalNode(),
            _a.star = createStarNode(),
            _a));
        this.import = function (obj) {
            _this._visualComponents.import(obj);
            _this.setGridSnap(obj === null || obj === void 0 ? void 0 : obj.gridSnap);
        };
        this.setGridSnap = function (gridSnap) {
            if (!gridSnap) {
                _this._gridSnap = null;
            }
            else if (typeof gridSnap === 'number') {
                _this._gridSnap = [gridSnap, gridSnap];
            }
            else if (Array.isArray(gridSnap) && gridSnap.length === 2) {
                _this._gridSnap = gridSnap;
            }
        };
        this.setGridSnap();
        makeAutoObservable(this);
    }
    Object.defineProperty(NodesSettings.prototype, "visualComponents", {
        get: function () {
            return this._visualComponents;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodesSettings.prototype, "gridSnap", {
        get: function () {
            return this._gridSnap;
        },
        enumerable: false,
        configurable: true
    });
    return NodesSettings;
}());

var NodeState = /** @class */ (function () {
    function NodeState(rootStore, id, state) {
        var _this = this;
        this._isDragActive = false;
        this.import = function (newState) {
            var _a;
            _this.setPosition(newState === null || newState === void 0 ? void 0 : newState.position);
            _this.setType(newState === null || newState === void 0 ? void 0 : newState.type);
            _this.setExtra(newState === null || newState === void 0 ? void 0 : newState.extra);
            _this.label = (_a = newState === null || newState === void 0 ? void 0 : newState.label) !== null && _a !== void 0 ? _a : '';
            _this._ports = new Map();
            _this.setIsSelectionEnabled(newState === null || newState === void 0 ? void 0 : newState.isSelectionEnabled);
            _this.setIsDragEnabled(newState === null || newState === void 0 ? void 0 : newState.isDragEnabled);
        };
        this.export = function () {
            var _a, _b;
            return (__assign({}, deepCopy({
                id: _this._id,
                label: _this._label,
                position: _this._position,
                type: _this._type,
                extra: _this.extra,
                isSelectionEnabled: (_a = _this._isSelectionEnabled) !== null && _a !== void 0 ? _a : undefined,
                isDragEnabled: (_b = _this._isDragEnabled) !== null && _b !== void 0 ? _b : undefined,
            })));
        };
        /**
         * @param newPosition - new position
         * @param ignoreSnapping - do not take into account snapping to grid
         * @returns remainder in case snap to grid is turned on. For example if newPosition would be [22,17] and snap [10,10],
         * the node position would be set to [20,20] and remainder equals [2,-3]
         */
        this.setPosition = function (newPosition, ignoreSnapping) {
            if (ignoreSnapping === void 0) { ignoreSnapping = false; }
            newPosition = newPosition !== null && newPosition !== void 0 ? newPosition : [0, 0];
            var remainder = undefined;
            if (!ignoreSnapping) {
                var result = snapPositionToGrid(newPosition, _this._rootStore.nodesSettings.gridSnap);
                newPosition = result.position;
                remainder = result.remainder;
            }
            if (arePointsEqual(newPosition, _this._position))
                return remainder;
            var lastPos = _this._position;
            _this._position = newPosition;
            // Do not notify if position was not initialized before
            if (lastPos) {
                _this._rootStore.callbacks.nodePositionChanged(_this, lastPos, _this._position, _this.isDragActive);
            }
            return remainder;
        };
        this.setType = function (value) {
            _this._type = value !== null && value !== void 0 ? value : componentDefaultType;
        };
        this.setExtra = function (value) {
            _this._extra = value !== null && value !== void 0 ? value : null;
        };
        this.getPort = function (portId) {
            if (portId) {
                return _this._ports.get(portId);
            }
            else
                return undefined;
        };
        this.addPort = function (port) {
            var _a;
            if (!port || (port.id && _this._ports.get(port.id))) {
                return errorResult();
            }
            var newPort = new PortState(_this._rootStore, (_a = port.id) !== null && _a !== void 0 ? _a : guidForcedUniqueness(function (id) { return !!_this._ports.get(id); }), _this._id, port);
            _this._ports.set(newPort.id, newPort);
            return successValueResult(newPort);
        };
        this.removePort = function (portId) {
            if (portId && _this._ports.get(portId)) {
                _this._ports.delete(portId);
                _this._rootStore.linksStore.removePortLinks(_this._id, portId);
                return true;
            }
            return false;
        };
        this.getPortOrThrowException = function (portId) {
            var port = _this.getPort(portId);
            if (port)
                return port;
            else
                throw "Port with id '" + portId + "' does not exist in the node '" + _this._id + "'";
        };
        this.recalculatePortsSizeAndPosition = function () {
            _this._ports.forEach(function (p) { return p.recalculateSizeAndPosition(); });
        };
        this.setIsSelectionEnabled = function (value) {
            _this._isSelectionEnabled = isBoolean(value) ? value : null;
        };
        this.setIsDragEnabled = function (value) {
            _this._isDragEnabled = isBoolean(value) ? value : null;
        };
        this._rootStore = rootStore;
        this._id = id;
        this._ref = new HtmlElementRefState(null);
        this._selected = false;
        this.import(state);
        makeAutoObservable(this, {
            // @ts-ignore
            _rootStore: false,
        });
        reaction(function () { return [_this._id, _this._label, _this._extra, _this._type]; }, function () {
            _this.recalculatePortsSizeAndPosition();
        });
    }
    Object.defineProperty(NodeState.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeState.prototype, "label", {
        get: function () {
            return this._label;
        },
        set: function (value) {
            this._label = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeState.prototype, "position", {
        get: function () {
            return this._position;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeState.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeState.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (value) {
            this._selected = value;
            if (!value) {
                this.isDragActive = false;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeState.prototype, "extra", {
        get: function () {
            return this._extra;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeState.prototype, "ref", {
        get: function () {
            return this._ref;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeState.prototype, "ports", {
        get: function () {
            return this._ports;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeState.prototype, "transformString", {
        get: function () {
            return generateTransform(this._position);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeState.prototype, "componentDefinition", {
        get: function () {
            var visualComponents = this._rootStore.nodesSettings.visualComponents;
            return visualComponents.getComponent(this.type);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeState.prototype, "realSize", {
        /**
         * @returns Value is calculated without zoom taking into account, that is, the same as zoom would be '1'.
         * Value can be @type {null} in case reference to real DOM object is not set.
         */
        get: function () {
            return this._ref.realSize;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeState.prototype, "connectedExternalPorts", {
        get: function () {
            var keyValues = Object.values(this.ports).map(function (p) { return [
                p.id,
                p.connectedPorts,
            ]; });
            return Object.fromEntries(keyValues);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeState.prototype, "connectedLinks", {
        get: function () {
            return this._rootStore.linksStore.getNodeLinks(this._id);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeState.prototype, "isSelectionEnabled", {
        get: function () {
            return this._isSelectionEnabled === null
                ? this._rootStore.diagramSettings.userInteraction.nodeSelection
                : this._isSelectionEnabled;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeState.prototype, "isDragEnabled", {
        get: function () {
            return ((this._isDragEnabled === null
                ? this._rootStore.diagramSettings.userInteraction.nodeDrag
                : this._isDragEnabled) && this.isSelectionEnabled);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeState.prototype, "isDragActive", {
        get: function () {
            return this._isDragActive;
        },
        set: function (value) {
            if (this._isDragActive != value) {
                this._isDragActive = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    return NodeState;
}());
function snapPositionToGrid(position, snap) {
    if (!snap)
        return {
            position: position,
            remainder: undefined,
        };
    var resultX = snapPositionValueToGridValue(position[0], snap[0]);
    var resultY = snapPositionValueToGridValue(position[1], snap[1]);
    return {
        position: [resultX.value, resultY.value],
        remainder: [resultX.remainder, resultY.remainder],
    };
}
function snapPositionValueToGridValue(value, snapValue) {
    var mod = value % snapValue;
    var remainder = 0;
    var newValue = value;
    if (snapValue / 2 > mod) {
        newValue -= mod;
        remainder = mod;
    }
    else {
        newValue += snapValue - mod;
        remainder = -(snapValue - mod);
    }
    return { value: newValue, remainder: remainder };
}

var NodesStore = /** @class */ (function () {
    function NodesStore(rootStore) {
        var _this = this;
        this._nodes = new Map();
        this.import = function (newNodes) {
            _this._nodes = new Map();
            if (newNodes) {
                var results = _this._addNodesInternal(newNodes, false);
                results.length != 0 &&
                    _this._rootStore.callbacks.nodesAdded(results, true);
            }
        };
        this.export = function () {
            return Array.from(_this._nodes).map(function (_a) {
                _a[0]; var value = _a[1];
                return value.export();
            });
        };
        this.addNodes = function (nodes, rewriteIfExists) {
            if (rewriteIfExists === void 0) { rewriteIfExists = false; }
            var results = _this._addNodesInternal(nodes, rewriteIfExists);
            results.length != 0 &&
                _this._rootStore.callbacks.nodesAdded(results, false);
            return results;
        };
        this._addNodesInternal = function (nodes, rewriteIfExists) {
            if (!Array.isArray(nodes) || nodes.length == 0)
                return [];
            var results = nodes.map(function (node) {
                return _this._addNodeInternal(node, rewriteIfExists);
            });
            return results;
        };
        this.addNode = function (node, rewriteIfExists) {
            if (rewriteIfExists === void 0) { rewriteIfExists = false; }
            var result = _this._addNodeInternal(node, rewriteIfExists);
            _this._rootStore.callbacks.nodesAdded([result], false);
            return result;
        };
        this._addNodeInternal = function (node, rewriteIfExists) {
            var _a;
            if (!node)
                return errorValueResult(node, 'Node object is null or undefined');
            if (!rewriteIfExists && node.id && _this._nodes.has(node.id))
                return errorValueResult(node, "Node with id '" + node.id + "' already exists");
            var newNode = new NodeState(_this._rootStore, (_a = node.id) !== null && _a !== void 0 ? _a : guidForcedUniqueness(function (id) { return _this._nodes.has(id); }), node);
            _this._nodes.set(newNode.id, newNode);
            return successValueResult(newNode);
        };
        this.removeNode = function (nodeId) {
            var node = _this._nodes.get(nodeId);
            if (node) {
                _this._rootStore.linksStore.removeNodeLinks(nodeId);
                _this._rootStore.selectionState.unselect(node);
                _this._nodes.delete(nodeId);
                return true;
            }
            return false;
        };
        this.getNode = function (nodeId) {
            return _this._nodes.get(nodeId);
        };
        /**
         * @returns Values are calculated without zoom taking into account, that is, the same as zoom would be '1'
         */
        this.getNodesBoundingBox = function () {
            var topLeftCorner = [
                Number.POSITIVE_INFINITY,
                Number.POSITIVE_INFINITY,
            ];
            var bottomRightCorner = [
                Number.NEGATIVE_INFINITY,
                Number.NEGATIVE_INFINITY,
            ];
            _this._nodes.forEach(function (node) {
                var _a;
                var pos = node.position;
                var size = (_a = node.realSize) !== null && _a !== void 0 ? _a : [0, 0];
                topLeftCorner = [
                    Math.min(topLeftCorner[0], pos[0]),
                    Math.min(topLeftCorner[1], pos[1]),
                ];
                bottomRightCorner = [
                    Math.max(bottomRightCorner[0], pos[0] + size[0]),
                    Math.max(bottomRightCorner[1], pos[1] + size[1]),
                ];
            });
            if (_this._nodes.size == 0) {
                topLeftCorner = [0, 0];
                bottomRightCorner = [100, 100];
            }
            return {
                topLeftCorner: topLeftCorner,
                bottomRightCorner: bottomRightCorner,
                size: subtractPoints(bottomRightCorner, topLeftCorner),
            };
        };
        makeAutoObservable(this);
        this._rootStore = rootStore;
    }
    Object.defineProperty(NodesStore.prototype, "nodes", {
        get: function () {
            return this._nodes;
        },
        enumerable: false,
        configurable: true
    });
    return NodesStore;
}());

var PortInnerDefault = observer(function (_a) {
    var port = _a.entity, settings = _a.settings;
    var finalSettings = __assign(__assign({}, portDefaultSettings), settings);
    var color = finalSettings.color;
    if (port.dragging)
        color = finalSettings.dragColor;
    else if (port.hovered && port.validForConnection)
        color = finalSettings.hoverColor;
    else if (port.hovered && !port.validForConnection)
        color = finalSettings.invalidColor;
    return (React.createElement("div", { style: {
            width: finalSettings.size[0],
            height: finalSettings.size[1],
            opacity: finalSettings.opacity,
            backgroundColor: color,
            borderRadius: '2px',
        } }));
});
var portDefaultSettings = {
    size: [10, 10],
    color: '#6eb7ff',
    dragColor: '#49f860',
    hoverColor: '#49f860',
    invalidColor: '#fa4040',
};
function createPortInnerDefault(settings) {
    return {
        component: PortInnerDefault,
        settings: __assign(__assign({}, portDefaultSettings), settings),
    };
}

var PortsSettings = /** @class */ (function () {
    function PortsSettings() {
        var _a;
        var _this = this;
        this._portVisualComponents = new VisualComponents((_a = {},
            _a[componentDefaultType] = createPortInnerDefault(),
            _a));
        this.import = function (obj) {
            _this.portVisualComponents.import({
                components: obj === null || obj === void 0 ? void 0 : obj.portComponents,
                defaultType: obj === null || obj === void 0 ? void 0 : obj.portDefaultType,
            });
        };
        makeAutoObservable(this);
    }
    Object.defineProperty(PortsSettings.prototype, "portVisualComponents", {
        get: function () {
            return this._portVisualComponents;
        },
        enumerable: false,
        configurable: true
    });
    return PortsSettings;
}());

var SelectionState = /** @class */ (function () {
    function SelectionState() {
        var _this = this;
        this._selectedItems = [];
        this.select = function (item, unselectOther) {
            if (unselectOther === void 0) { unselectOther = false; }
            if (unselectOther)
                _this.unselectAll();
            if (!item.selected) {
                item.selected = true;
                _this._selectedItems = __spreadArrays(_this._selectedItems, [item]);
                return true;
            }
            else
                return false;
        };
        this.switch = function (item) {
            if (item.selected) {
                _this.unselect(item);
            }
            else {
                _this.select(item);
            }
        };
        this.unselect = function (item) {
            if (item.selected) {
                item.selected = false;
                _this._selectedItems = _this._selectedItems.filter(function (i) { return i !== item; });
                return true;
            }
            else
                return false;
        };
        this.unselectAll = function () {
            _this._selectedItems.forEach(function (i) { return (i.selected = false); });
            _this._selectedItems = [];
        };
        this.unselectItems = function (itemsToClear) {
            itemsToClear.forEach(function (i) { return _this.unselect(i); });
        };
        makeAutoObservable(this);
    }
    Object.defineProperty(SelectionState.prototype, "selectedItems", {
        get: function () {
            return this._selectedItems;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SelectionState.prototype, "selectedNodes", {
        get: function () {
            return this.selectedItems.filter(function (i) { return i instanceof NodeState; });
        },
        enumerable: false,
        configurable: true
    });
    return SelectionState;
}());

/**
 * Encapsulate logic for dragging mechanism. Right now only nodes are supposed to be dragged.
 */
var DragState = /** @class */ (function () {
    function DragState(selectionState, callbacks) {
        var _this = this;
        this._nodesBeingDragged = new Set();
        // In case the snap to grid option is enabled in settings
        this._remaindersFromDrags = new Map();
        this.startDragging = function (nodeToDrag) {
            if (!nodeToDrag.isDragEnabled || _this.isActive)
                return;
            if (nodeToDrag.selected) {
                _this._selectionState.unselectItems(_this._selectionState.selectedItems.filter(function (i) { return !(i instanceof NodeState) || !i.isDragEnabled; }));
            }
            else {
                _this._selectionState.unselectAll();
                _this._selectionState.select(nodeToDrag);
            }
            _this._selectionState.selectedNodes.forEach(function (n) {
                n.isDragActive = true;
                _this._nodesBeingDragged.add(n);
            });
            _this._callbacks.dragStateChanged(_this._selectionState.selectedNodes, true);
        };
        /**
         * Drag by a vector
         * @param vector vector to drag by which takes into account diagram zoom
         */
        this.dragBy = function (vector) {
            _this._nodesBeingDragged.forEach(function (n) {
                var newPosition = addPoints(n.position, vector, _this._remaindersFromDrags.get(n.id));
                var newRemainder = n.setPosition(newPosition);
                _this._remaindersFromDrags.set(n.id, newRemainder);
            });
        };
        this.stopDragging = function () {
            _this._nodesBeingDragged.forEach(function (n) { return (n.isDragActive = false); });
            _this._nodesBeingDragged.clear();
            _this._remaindersFromDrags.clear();
            _this._callbacks.dragStateChanged(_this._selectionState.selectedNodes, false);
        };
        makeAutoObservable(this);
        this._selectionState = selectionState;
        this._callbacks = callbacks;
    }
    Object.defineProperty(DragState.prototype, "isActive", {
        get: function () {
            return this._nodesBeingDragged.size !== 0;
        },
        enumerable: false,
        configurable: true
    });
    return DragState;
}());

var CommandExecutor = /** @class */ (function () {
    function CommandExecutor(rootStore) {
        var _this = this;
        this.execute = function (command) {
            command.execute(_this._rootStore);
        };
        makeAutoObservable(this);
        this._rootStore = rootStore;
    }
    return CommandExecutor;
}());

var RootStore = /** @class */ (function () {
    function RootStore() {
        var _this = this;
        this.importState = function (nodes, links) {
            _this._nodesStore.import(nodes);
            _this._linksStore.import(links);
        };
        this.export = function () { return ({
            nodes: _this._nodesStore.export(),
            links: _this._linksStore.export(),
        }); };
        this.importSettings = function (settings) {
            _this._diagramSettings.import(settings.diagram);
            _this._nodesSettings.import(settings.nodes);
            _this._linksSettings.import(settings.links);
            _this._portsSettings.import(settings.ports);
            _this._callbacks.import(settings.callbacks);
        };
        this._diagramSettings = new DiagramSettings();
        this._nodesSettings = new NodesSettings();
        this._linksSettings = new LinksSettings();
        this._portsSettings = new PortsSettings();
        this._callbacks = new Callbacks(this);
        this._diagramState = new DiagramState(this);
        this._commandExecutor = new CommandExecutor(this);
        this._nodesStore = new NodesStore(this);
        this._linksStore = new LinksStore(this);
        this._selectionState = new SelectionState();
        this._dragState = new DragState(this._selectionState, this._callbacks);
    }
    Object.defineProperty(RootStore.prototype, "diagramState", {
        get: function () {
            return this._diagramState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RootStore.prototype, "nodesStore", {
        get: function () {
            return this._nodesStore;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RootStore.prototype, "linksStore", {
        get: function () {
            return this._linksStore;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RootStore.prototype, "diagramSettings", {
        get: function () {
            return this._diagramSettings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RootStore.prototype, "nodesSettings", {
        get: function () {
            return this._nodesSettings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RootStore.prototype, "linksSettings", {
        get: function () {
            return this._linksSettings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RootStore.prototype, "portsSettings", {
        get: function () {
            return this._portsSettings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RootStore.prototype, "callbacks", {
        get: function () {
            return this._callbacks;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RootStore.prototype, "selectionState", {
        get: function () {
            return this._selectionState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RootStore.prototype, "dragState", {
        get: function () {
            return this._dragState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RootStore.prototype, "commandExecutor", {
        get: function () {
            return this._commandExecutor;
        },
        enumerable: false,
        configurable: true
    });
    return RootStore;
}());

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".react_fast_diagram_DiagramInner {\n  width: 100%;\n  height: 100%;\n  min-height: 100%;\n  position: relative;\n  overflow: hidden;\n  touch-action: none;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n.react_fast_diagram_DiagramInner > * {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  color: black;\n}\n\n.react_fast_diagram_DiagramInner_DraggablePart {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  overflow: visible;\n  transform-origin: 0px 0px;\n  top: 0px;\n  left: 0px;\n  /* useGestures hook use targetTouches instead of simply touches, \n  so we should set this property to Movable, otherwise if user put \n  one finger above Movable and another above DiagramInner, the hook \n  will not trigger pinch gesture */\n  pointer-events: none;\n}\n\n.react_fast_diagram_Layer {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  overflow: visible;\n}\n\n.react_fast_diagram_NodeWrapper {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  height: -webkit-fit-content;\n  height: -moz-fit-content;\n  height: fit-content;\n  pointer-events: auto;\n}\n\n.react_fast_diagram_Node_Default {\n  min-width: 10px;\n  min-height: 10px;\n  border-radius: 3px;\n  background-color: white;\n  border: #c2c2c2 solid 1px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  margin: auto;\n  font-size: small;\n}\n\n.react_fast_diagram_PortContainer_Default {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.react_fast_diagram_Node_Default > * {\n  text-align: center;\n  margin: auto;\n}\n\n.react_fast_diagram_disabled_user_select {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n\n.react_fast_diagram_BackgroundWrapper {\n  height: 100%;\n  width: 100%;\n  pointer-events: none;\n}\n\n.react_fast_diagram_Background_Default {\n  height: 100%;\n  width: 100%;\n}\n\n.react_fast_diagram_Minicontrol_Default {\n  position: absolute;\n  height: -webkit-fit-content;\n  height: -moz-fit-content;\n  height: fit-content;\n  display: flex;\n  flex-direction: column;\n}\n\n.react_fast_diagram_Minicontrol_Default_Btn {\n  background-color: white;\n  border: 1px solid rgb(209, 209, 209);\n  color: black;\n  padding: 2px;\n  font-size: 16px;\n  cursor: pointer;\n  text-align: center;\n}\n\n@media (hover: hover) and (pointer: fine) {\n  .react_fast_diagram_Minicontrol_Default_Btn:hover {\n    background-color: rgb(228, 228, 228);\n  }\n}\n\n.react_fast_diagram_Port {\n  cursor: pointer;\n}\n\n/* Containers with gap between items */\n\n.react_fast_diagram_flex_gap {\n  --gap: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.react_fast_diagram_flex_gap_y {\n  flex-direction: column;\n  height: 100%;\n}\n\n.react_fast_diagram_flex_gap_y > * {\n  margin: var(--gap) 0 0 0;\n}\n\n.react_fast_diagram_flex_gap_y > :first-child {\n  margin: 0;\n}\n\n.react_fast_diagram_flex_gap_x {\n  flex-direction: row;\n  width: 100%;\n}\n\n.react_fast_diagram_flex_gap_x > * {\n  margin: 0 0 0 var(--gap);\n}\n\n.react_fast_diagram_flex_gap_x > :first-child {\n  margin: 0;\n}\n\n/* Containers with gap between items */\n";
styleInject(css_248z);

var RootStoreContext = React.createContext(null);
function Diagram(props) {
    var rootStore = useMemo(function () {
        var _a, _b, _c, _d;
        var store = new RootStore();
        props.settings && store.importSettings(props.settings);
        store.importState((_b = (_a = props.initState) === null || _a === void 0 ? void 0 : _a.nodes) !== null && _b !== void 0 ? _b : [], (_d = (_c = props.initState) === null || _c === void 0 ? void 0 : _c.links) !== null && _d !== void 0 ? _d : []);
        return store;
    }, []);
    useEffect(function () {
        if (props.storeRef) {
            props.storeRef.current = rootStore;
        }
    }, [rootStore, props.storeRef]);
    return (React.createElement(RootStoreContext.Provider, { value: rootStore },
        React.createElement(InnerDiagram, null)));
}
Diagram.displayName = 'Diagram';

var useRootStore = function () { return useContext(RootStoreContext); };

var BackgroundWrapper = observer(function () {
    var _a = useRootStore(), diagramSettings = _a.diagramSettings, diagramState = _a.diagramState;
    return (React.createElement("div", { className: 'react_fast_diagram_BackgroundWrapper' },
        React.createElement(diagramSettings.backgroundComponentState.component, { diagramOffset: diagramState.offset, diagramZoom: diagramState.zoom, settings: diagramSettings.backgroundComponentState.settings })));
});

var positionValues = ['left', 'top', 'right', 'bottom'];

var PortsContainer = observer(function (_a) {
    var position = _a.position, ports = _a.ports, style = _a.style, gapBetweenPorts = _a.gapBetweenPorts, offsetFromOriginPosition = _a.offsetFromOriginPosition;
    var portsModified = useMemo(function () {
        return ports &&
            ports.map(function (p) {
                return (__assign({ linkDirection: positionToDirection[position] }, p));
            });
    }, [position, ports]);
    if (!portsModified || portsModified.length === 0)
        return null;
    var className = 'react_fast_diagram_flex_gap ';
    if (position === 'top' || position === 'bottom') {
        className += 'react_fast_diagram_flex_gap_x';
    }
    else {
        className += 'react_fast_diagram_flex_gap_y';
    }
    var positionStyle = {
        position: 'absolute',
        left: position === 'left' ? 0 : undefined,
        top: position === 'left' || position === 'right' || position === 'top'
            ? 0
            : undefined,
        right: position === 'right' ? 0 : undefined,
        bottom: position === 'bottom' ? 0 : undefined,
        height: position === 'left' || position === 'right' ? '100%' : undefined,
        width: position === 'top' || position === 'bottom' ? '100%' : undefined,
    };
    var offsetFromOriginPositionStyle = {};
    if (offsetFromOriginPosition && positionValues.includes(position)) {
        offsetFromOriginPositionStyle[position] = -offsetFromOriginPosition;
    }
    return (React.createElement("div", { className: className, style: __assign(__assign(__assign({ 
            // @ts-ignore
            '--gap': gapBetweenPorts }, style), positionStyle), offsetFromOriginPositionStyle) }, portsModified &&
        portsModified.map(function (port) { return React.createElement(Port, __assign({}, port, { key: port.id })); })));
});
var positionToDirection = {
    left: 'left',
    top: 'up',
    right: 'right',
    bottom: 'down',
};
function createPortsContainer(settings) {
    return function (props) { return (React.createElement(PortsContainer, __assign({}, __assign(__assign({}, defaultPortsContainerSettings), settings), props))); };
}
var defaultPortsContainerSettings = {
    gapBetweenPorts: '8px',
};

var useDiagram = function (initState, settings) {
    var storeRef = useNotifyRef(null);
    var obj = useMemo(function () { return ({
        Diagram: function () { return (React.createElement(Diagram, { storeRef: storeRef, initState: initState, settings: settings })); },
        storeRef: storeRef,
    }); }, []);
    return obj;
};

function straightLinkPathConstructor(source, target) {
    var path = "M " + source.point[0] + " " + source.point[1] + ", " + target.point[0] + " " + target.point[1];
    return path;
}
function createStraightLinkPathConstructor() {
    return straightLinkPathConstructor;
}

export { BackgroundWrapper, Button, Callbacks, CommandExecutor, CopyIcon, DISABLED_USER_SELECT_CSS_CLASS, Diagram, DiagramSettings, DiagramState, DragState, FilterCenterFocusIcon, HtmlElementRefState, InnerDiagram, LinkCreationState, LinkDefault, LinkPointEndpointState, LinkPortEndpointState, LinkState, LinkWrapper, LinksLayer, LinksSettings, LinksStore, MiniControlWrapper, Node, NodeContext, NodeLabel, NodeState, NodeWrapper, NodesLayer, NodesSettings, NodesStore, Port, PortInnerDefault, PortState, PortsSettings, RenderedPortsComponentsContext, RootStore, RootStoreContext, RubbishBinIcon, SelectionState, UserInteractionSettings, VisualComponentState, VisualComponentWithDefault, VisualComponents, addPoints, arePointsEqual, areTranformationsEqual, canDragGestureBeTapInstead, clampValue, className$1 as className, cloneSelectedNodesCommand, commandC, commandM, componentDefaultType, coordinateFromPoint, createArrowMarker, createCircleMarker, createCrossesImageGenerator, createCurvedLinkPathConstructor, createDefaultBackground, createDefaultMiniControl, createDotsImageGenerator, createFullPortId, createGridImageGenerator, createInputHorizontalNode, createInputOutputHorizontalNode, createInputOutputVerticalNode, createInputVerticalNode, createLinkDefault, createLinkPath, createNode, createOutputHorizontalNode, createOutputVerticalNode, createPortInnerDefault, createPortsContainer, createStarNode, createStraightLinkPathConstructor, createVector, deepCopy, disableNodeUserInteractionClassName, distanceBetweenPoints, enableNodeUserInteractionClassName, errorResult, errorValueResult, eventPathContainsClass, generateTransform, getDegree, getRadian, guid, guidForcedUniqueness, isBoolean, isError, isNumber, isObject, isPoint, isSuccess, linkCreationComponentType, linkPortEndpointsEquals, multiplyPoint, portPositionValues, positionValues, removeSelectedCommand, removeSelectedLinksCommand, removeSelectedNodesCommand, roundPoint, subtractPoints, successResult, successValueResult, useCursor, useDiagram, useDiagramCursor, useDiagramDragHandlers, useDiagramPinchHandlers, useDiagramUserInteraction, useDiagramWheelHandler, useLinkUserInteraction, useNodeUserInteraction, useNotifyRef, usePortUserInteraction, useRelativePositionStyles, useRootStore, useUpdateOrCreatePortState, useUserAbilityToSelectSwitcher };
//# sourceMappingURL=index.esm.js.map

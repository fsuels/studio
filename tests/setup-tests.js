const Module = require('module');
const path = require('path');

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  const normalized = request.replace(/\\/g, '/');
  if (
    normalized === 'canvas' ||
    normalized.startsWith('canvas/') ||
    normalized.endsWith('canvas.node')
  ) {
    return {};
  }
  if (normalized === 'debug' || normalized.startsWith('debug/')) {
    return () => () => {};
  }

  return originalLoad.apply(this, arguments);
};

import isObject from './isObject';

function isPlainObject(value) {
  return isObject(value) && Object.getPrototypeOf(value) === Object.prototype;
}

/**
 * The 'src' argument plays the command role.
 * The returned values is always of the same type as the 'src'.
 * @param dst
 * @param src
 * @returns {*}
 */
function mergeOne(dst, src) {
  if (src === undefined) return dst;

  // According to specification arrays must be concatenated.
  // Also, the '.concat' creates a new array instance. Overrides the 'dst'.
  if (Array.isArray(src)) return (Array.isArray(dst) ? dst : []).concat(src);

  // Now deal with non plain 'src' object. 'src' overrides 'dst'
  // Note that functions are also assigned! We do not deep merge functions.
  if (!isPlainObject(src)) return src;

  // See if 'dst' is allowed to be mutated. If not - it's overridden with a new plain object.
  const returnValue = isObject(dst) ? dst : {};

  Object.keys(src).forEach(key => {
    const srcValue = src[key];
    // Do not merge properties with the 'undefined' value.
    if (srcValue === undefined) return;

    // Recursive calls to mergeOne() must allow only plain objects in dst!!!
    const dstValue = returnValue[key];
    const newDst = isPlainObject(dstValue) || Array.isArray(srcValue) ? dstValue : {};

    // deep merge each property. Recursion!
    returnValue[key] = mergeOne(newDst, srcValue);
  });

  return returnValue;
}

export const assign = Object.assign;

export function merge(dst, ...srcs) {
  return srcs.reduce((target, src) => mergeOne(target, src), dst);
}

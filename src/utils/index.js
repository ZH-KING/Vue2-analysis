/*
 * @Author: JLDiao
 * @Date: 2022-09-07 16:56:24
 * @LastEditors: ***
 * @LastEditTime: 2022-09-14 15:25:15
 * @FilePath: \vue2-rollup\src\utils\index.js
 * @Description:
 * Copyright (c) 2022 by JLDiao, All Rights Reserved.
 */
export function isFunction(val) {
  return typeof val === "function";
}
export function isObject(val) {
  return typeof val === "object";
}

const strats = {};
const LIFECYCLE = ["beforeCreate", "created"];
LIFECYCLE.forEach((hook) => {
  strats[hook] = function (p, c) {
    if (c) {
      if (p) {
        return p.concat(c);
      } else {
        return [c];
      }
    } else {
      return p;
    }
  };
});
export function mergeOptions(parent, child) {
  const options = {};
  for (let key in parent) {
    mergeField(key);
  }
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key]);
    } else {
      options[key] = child[key] || parent[key];
    }
  }
  return options;
}

import { mergeOptions } from "../utils";

/*
 * @Author: JLDiao
 * @Date: 2022-09-14 14:26:59
 * @LastEditors: ***
 * @LastEditTime: 2022-09-14 15:25:09
 * @FilePath: \vue2-rollup\src\globalApi\index.js
 * @Description:
 * Copyright (c) 2022 by JLDiao, All Rights Reserved.
 */
export function initGlobalApi(Vue) {

  Vue.options = {};
  
  Vue.mixin = function (mixin) {
    // 我们期望将用户的选项和全局的options进行合并
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
}

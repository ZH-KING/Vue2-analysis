/*
 * @Author: JLDiao
 * @Date: 2022-09-07 16:11:59
 * @LastEditors: ***
 * @LastEditTime: 2022-09-14 15:17:57
 * @FilePath: \vue2-rollup\src\index.js
 * @Description: 
 * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
 */

import { initGlobalApi } from "./globalApi"
import { initMixin } from "./init"
import { initLifeCycle } from "./lifecycle"
import { nextTick } from "./observe/watcher"

// 创建一个Vue构造函数
function Vue(options){
    this._init(options)
}

Vue.prototype.$nextTick = nextTick

initMixin(Vue)
initLifeCycle(Vue)
initGlobalApi(Vue)











export default Vue
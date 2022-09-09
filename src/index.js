/*
 * @Author: JLDiao
 * @Date: 2022-09-07 16:11:59
 * @LastEditors: ***
 * @LastEditTime: 2022-09-09 16:54:58
 * @FilePath: \vue2-rollup\src\index.js
 * @Description: 
 * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
 */

import { initMixin } from "./init"

// 创建一个Vue构造函数
function Vue(options){
    this._init(options)
}

initMixin(Vue)
initLifeCycle(Vue)

export default Vue
/*
 * @Author: JLDiao
 * @Date: 2022-09-08 14:54:51
 * @LastEditors: ***
 * @LastEditTime: 2022-09-09 17:38:52
 * @FilePath: \vue2-rollup\src\compiler\index.js
 * @Description: 
 * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
 */
import { codegen } from "./generate";
import { parseHTML } from "./parse";

export function compileToFunction(template){

    // 1、将template转成AST语法树：AST用来描述代码本身形成树结构，不仅可以描述html，也能描述css以及js语法
    let ast = parseHTML(template);
    /**
     * 2、通过AST，重新生成代码
     * 生成的代码需要跟render函数一样
     * 类似 _c('div',{id: "app"},_c('div',undefined,_v(_s(name)),_c('span',undefined,_v(_s(age))))
     * _c代表创建元素 _v代表创建文本 _s代表变量
     */

    let code = codegen(ast)
    // 模板引擎的实现原理就是 with + new Function
    code = `with(this){return ${code}}`
    let render = new Function(code)
    
    return render
}

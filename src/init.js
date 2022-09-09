import { compileToFunction } from "./compiler";
import { initState } from "./state";

/*
 * @Author: JLDiao
 * @Date: 2022-09-07 16:39:18
 * @LastEditors: ***
 * @LastEditTime: 2022-09-09 16:50:17
 * @FilePath: \vue2-rollup\src\init.js
 * @Description: 
 * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
 */
export function initMixin(Vue){
    Vue.prototype._init = function(options){
        const vm = this;
        // 在实例上添加 $options 属性
        vm.$options = options;
        // 初始化状态，包括initProps、initData、initMethod、initComputed、initWatch等
        initState(vm)
        // 挂载数据
        if(options.el){
            vm.$mount(options.el)
        }
    }
    Vue.prototype.$mount = function(el){
        const vm = this;
        const opts = vm.$options;
        el = document.querySelector(el)
        /**
         * 1、把模板转化成render函数
         * 2、执行render函数，生成VNode
         * 3、更新时进行diff
         * 4、产生真实DOM
         */
        // 可以直接在options中写render函数
        // 优先级： render > template > el
        if(!opts.render){
            let template = opts.template
            if(!opts.template && el){
                template = el.outerHTML;
            }
            // 写了 template 就用写了的 template
            if(template){
                // 将 template转化成render函数
                const render = compileToFunction(template)
                opts.render = render;
            }
        }
        // 组件的挂载
        mountComponent(vm, el)
    }
}


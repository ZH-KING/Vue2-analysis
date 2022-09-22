/*
 * @Author: JLDiao
 * @Date: 2022-09-13 10:46:16
 * @LastEditors: ***
 * @LastEditTime: 2022-09-13 14:19:14
 * @FilePath: \vue2-rollup\src\vdom\index.js
 * @Description: 
 * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
 */


export function createElementVnode(vm, tag, data, ...children){
    if(data === null){
        data = {}
    }
    let key = data.key;
    if(key){
        delete data.key
    }
    return vnode(vm, tag, key, data, children)
}

export function createTextVnode(vm, text){
    return vnode(vm, undefined, undefined, undefined, undefined, text)
}

// 虚拟DOM
function vnode(vm, tag, key, data, children, text){
    return {
        vm,
        tag,
        key,
        data,
        children,
        text
    }
}
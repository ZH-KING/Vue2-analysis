import Watcher from './observe/watcher';
import { createElementVnode, createTextVnode } from './vdom'

/*
 * @Author: JLDiao
 * @Date: 2022-09-09 16:51:07
 * @LastEditors: ***
 * @LastEditTime: 2022-09-14 15:33:14
 * @FilePath: \vue2-rollup\src\lifecycle.js
 * @Description: 
 * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
 */
function createElm(vnode){
    let {tag,data,children,text} = vnode
    if(typeof tag === 'string'){ // 标签
        vnode.el = document.createElement(tag)
        patchProps(vnode.el, data)
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        });
    }else{
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

function patchProps(el, props){
    for(let key in props){
        if(key === 'style'){
            // style: {color: 'red'; background: 'orange'}
            for(let styleName in props.style){
                el.style[styleName] = props.style[styleName]
            }
        }else{
            el.setAttribute(key, props[key])
        }
    }
}

function patch(oldVNode, vnode){

    const isRealElement = oldVNode.nodeType;
    // isRealElement为真即为 初始渲染
    if(isRealElement){
        const elm = oldVNode; // 拿到真是元素
        const parentElm = elm.parentNode; // 拿到父元素
        let newElm = createElm(vnode)
        parentElm.insertBefore(newElm, elm.nextSibling)
        parentElm.removeChild(elm) // 删除老节点
        return newElm
    }else{
        // diff算法
    }
}

export function initLifeCycle(Vue){
    Vue.prototype._update = function(vnode){
        const vm = this;
        const el = vm.$el;
        // patch既有初始化的功能，又有更新
        vm.$el = patch(el, vnode)
    }
    Vue.prototype._c = function(){
        return createElementVnode(this, ...arguments)
    }
    Vue.prototype._v = function(){
        return createTextVnode(this, ...arguments)
    }
    Vue.prototype._s = function(value){
        if(typeof value !== 'object') return value;
        return JSON.stringify(value)
    }
    Vue.prototype._render = function(){
        const vm = this;
        return vm.$options.render.call(vm)
    }
}

export function mountComponent(vm, el){
    vm.$el = el;
    
    // 1、调用render方法产生虚拟节点 虚拟DOM
    const updateComponent = function(){
        vm._update(vm._render())
    }
    let watcher = new Watcher(vm, updateComponent, true)
    // 2、根据虚拟DOM产生真实DOM

    // 3、插入到el元素中
}

export function callHook(vm, hook){
    const handlers = vm.$options[hook];
    if(handlers){
        handlers.forEach(handler=>handler.call(vm))
    }
}
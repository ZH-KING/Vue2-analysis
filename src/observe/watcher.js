import Dep, { popTarget, pushTarget } from "./dep";

/*
 * @Author: JLDiao
 * @Date: 2022-09-13 15:27:50
 * @LastEditors: ***
 * @LastEditTime: 2022-09-14 18:01:50
 * @FilePath: \vue2-rollup\src\observe\watcher.js
 * @Description: 
 * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
 */
let id = 0;
class Watcher{
    constructor(vm, fn, options){
        this.id = id++;
        this.renderWatcher = options;
        this.getter = fn;
        this.deps = [];
        this.depsIds = new Set()
        this.get()
    }
    addDep(dep){
        let id = dep.id;
        if(!this.depsIds.has(id)){
            this.deps.push(dep);
            this.depsIds.add(id)
            dep.addSub(this)
        }
    }
    get(){
        pushTarget(this)
        this.getter()
        popTarget() // 渲染完毕后清空
    }
    update(){
        queueWatcher(this)
    }
    run(){
        this.get()
    }
}

/**
 * @param {Array} queue watcher队列
 * @param {*} has watcher 的id集合
 */
let queue = [];
let has = {};
let pending = false; // 防抖
function flushSchedulerQueue(){
    let flushQueue = queue.slice(0)
    queue = []
    has = {}
    pending = false
    flushQueue.forEach(q=>q.run())
}
function queueWatcher(watcher){
    const id = watcher.id;
    if(!has[id]){
        queue.push(watcher)
        has[id] = true
        if(!pending){
            nextTick(flushSchedulerQueue, 0)
            pending = true
        }
    }
}

let callback = [];
let waiting = false;
function flushCallbacks(){
    let cbs = callback.slice(0)
    waiting = false;
    callback = []
    cbs.forEach(cb=>cb())
}
// nextTick 没有直接使用某个api 而是采用优雅降级的方式
// 内部先采用Promise（ie不兼容） MutationObserver（h5的api） ie专享的setImmediate  最后是setTimeout
// let timerFunc;
// if(Promise){
//     timerFunc = ()=>{
//         Promise.resolve().then(flushCallbacks)
//     }
// }else if(MutationObserver){
//     let observer = new MutationObserver(flushCallbacks)
//     let textNode = document.createTextNode(1)
//     observer.observe(textNode,{
//         characterData: true
//     })
//     timerFunc = ()=>{
//         textNode.textContent = 2
//     }
// }else if(setImmediate){
//     timerFunc = ()=>{
//         setImmediate(flushCallbacks)
//     }
// }else{
//     timerFunc = ()=>{
//         setTimeout(flushCallbacks)
//     }
// }
// 改进后的不需要兼容ie了 直接使用Promise
export function nextTick(cb){
    callback.push(cb)
    if(!waiting){
        // timerFunc()
        Promise.resolve().then(flushCallbacks)
        waiting = true
    }
}

export default Watcher
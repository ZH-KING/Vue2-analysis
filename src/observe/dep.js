/*
 * @Author: JLDiao
 * @Date: 2022-09-13 15:41:25
 * @LastEditors: ***
 * @LastEditTime: 2022-09-14 18:00:59
 * @FilePath: \vue2-rollup\src\observe\dep.js
 * @Description: 
 * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
 */
let id = 0;
class Dep {
    constructor(){
        this.id = id++; // 属性的dep要收集watcher
        this.subs = []; // 这里存放着当前属性对应的watcher有哪些
    }
    depend(){
        Dep.target.addDep(this)
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(watcher=>watcher.update())
    }
}
Dep.target = null;

let stack = [];
export function pushTarget(watcher){
    stack.push(watcher)
    Dep.target = watcher
}
export function popTarget(){
    stack.pop()
    Dep.target = stack[stack.length - 1]
}

export default Dep
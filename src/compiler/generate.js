/*
 * @Author: JLDiao
 * @Date: 2022-09-09 13:58:03
 * @LastEditors: ***
 * @LastEditTime: 2022-09-21 11:08:40
 * @FilePath: \vue2-rollup\src\compiler\generate.js
 * @Description: 
 * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
 */
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配花括号 {{  }}；捕获花括号里面的内容

function genProps(attrs){
    let str = ''
    for(let i=0;i<attrs.length;i++){
        let attr = attrs[i]
        // 如果属性为 style 时，转化为 style:{a:b,c:d} 格式
        if(attr.name === 'style'){
            let obj = {}
            attr.value.split(";").forEach(item => {
                let [key, value] = item.split(":");
                obj[key] = value
            });
            attr.value = obj
        }
        // 结果变为 a:b,c:d,...
        str += `${attr.name}:${JSON.stringify(attr.value)},`
        
    }
    // 删掉多余的逗号
    return `{${str.slice(0,-1)}}`
}

function gen(node){
    if(node.type === 1){
        return codegen(node)
    }else{
        // 如果是纯文本
        let text = node.text;
        if(!defaultTagRE.test(text)){
            return `_v(${JSON.stringify(text)})`
        }else{
            let tokens = [];
            let match,index;
            // 正则是全局模式 每次需要重置正则的lastIndex属性，不然会引发匹配bug（defaultTagRE.exec()匹配完一次后，再次匹配为null，需要重置lastIndex）
            defaultTagRE.lastIndex = 0;
            let lastIndex = 0;
            while(match = defaultTagRE.exec(text)){
                // 匹配的位置
                index = match.index;
                // 放入文本值  {{name}}  hello {{age}}  取hello放入tokens
                if(index > lastIndex){
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)))
                }
                // tokens中放入变量
                tokens.push(`_s(${match[1].trim()})`)
                // 记录 }} 结束的位置
                lastIndex = index + match[0].length
            }
            // 如果匹配完了花括号，text里面还有剩余的普通文本，那么继续push到tokens
            if(lastIndex < text.length){
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join("+")})`
        }
    }
}

function genChildren(children){
    if(children){
        return children.map(child=>gen(child)).join(",")
    }
}

export function codegen(ast){
    let children = genChildren(ast.children)
    let code = `_c('${ast.tag}',${ast.attrs.length > 0 ? genProps(ast.attrs) : null
    }${ast.children.length > 0 ? `,${children}` : ''
    })`
    return code
}
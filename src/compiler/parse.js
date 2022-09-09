// 以下为vue源码的正则
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //匹配标签名；形如 abc-123
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //匹配特殊标签;形如 abc:234,前面的abc:可有可无；获取标签名；
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配标签开头；形如  <  ；捕获里面的标签名
const startTagClose = /^\s*(\/?)>/; // 匹配标签结尾，形如 >、/>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配结束标签 如 </abc-123> 捕获里面的标签名
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性  形如 id="app"

export function parseHTML(template){

    const ELEMENT_TYPE = 1;
    const TEXT_TYPE = 3;
    const stack = []; // 用于存放元素
    let currentParent; // 指向的是栈中的最后一个
    let root;

    // 最终需要转化成一颗抽象语法树
    function createASTElement(tag, attrs){
        return {
            tag,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }
    
    function start(tagName, attrs){
        let node = createASTElement(tagName, attrs)
        // 如果没有根元素，那么当前元素为根元素
        if(!root){
            root = node;
        }
        // 给当前节点绑定父子关系
        if(currentParent){
            node.parent = currentParent;
            currentParent.children.push(node)
        }
        // 将当前元素放入栈中
        stack.push(node);
        // 当前currentParent为当前节点
        currentParent = node
    }

    function chars(text){
        text = text.replace(/\s/g, '')
        // 文本直接放到当前指向的节点中
        if(text){
            currentParent.children.push({
                type: TEXT_TYPE,
                text,
                parent: currentParent
            })
        }
    }
    function end(tagName){
        // 处理到结束标签时，将该元素从栈中移出
        let node = stack.pop()
        // 此时currentParent为stack中的上一个元素
        currentParent = stack[stack.length - 1]
    }
    // 截取 template 字符串，每次匹配到了就截掉
    function advance(n){
        template = template.substring(n)
    }
    // 解析开始标签
    function parseStartTag(){
        // 匹配开始标签
        const start = template.match(startTagOpen)
        // start 格式为：['<div', 'div', index: 0, groups: undefined, input: '<div id=\"app\">']
        if(start){
            const match = {
                tagName: start[1], // 标签名
                attrs: []
            }
            advance(start[0].length)

            // 如果不是开始标签的结束，就一直匹配下去
            // attr 格式为：["class=\"myClass\"", "class", "=", "myClass", undefined, undefined]
            let attr,end;
            while(!(end = template.match(startTagClose)) && (attr = template.match(attribute))){
                advance(attr[0].length)
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
            }
            if(end){
                advance(end[0].length)   
            }
            return match
        }
        
        return false;
    }
    /**
     * 递归解析template，进行初步处理
     * 解析开始标签，将结果 {tagName, attrs} 交给handleStartTag函数处理
     * 解析结束标签，将结果 tagName 交给 handleEndTag 函数处理
     * 解析文本类型，将结果 text 交给 handleChars 函数处理
     */
    while(template){
        // 查找 < 的位置，根据它的位置判断第一个元素是什么标签
        let textEnd = template.indexOf("<")
        // 第一个元素为 '<' 时，即碰到开始/结束标签
        if(textEnd === 0){
            // 匹配到开始标签 例如：<div>
            const startTagMatch = parseStartTag()
            if(startTagMatch){
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            // 匹配到结束标签 例如：</div>
            const endTagMatch = template.match(endTag)
            if(endTagMatch){
                end(endTagMatch[1])
                advance(endTagMatch[0].length)
                continue
            }
        }
        // 第一个元素为文本时
        if(textEnd > 0){
            let text = template.substring(0,textEnd)
            if(text){
                chars(text)
                advance(text.length)
            }
        }
    }
    return root;
}
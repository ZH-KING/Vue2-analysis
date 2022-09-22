(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /*
   * @Author: JLDiao
   * @Date: 2022-09-07 16:56:24
   * @LastEditors: ***
   * @LastEditTime: 2022-09-14 15:25:15
   * @FilePath: \vue2-rollup\src\utils\index.js
   * @Description:
   * Copyright (c) 2022 by JLDiao, All Rights Reserved.
   */
  function isFunction(val) {
    return typeof val === "function";
  }
  function isObject(val) {
    return _typeof(val) === "object";
  }
  var strats = {};
  var LIFECYCLE = ["beforeCreate", "created"];
  LIFECYCLE.forEach(function (hook) {
    strats[hook] = function (p, c) {
      if (c) {
        if (p) {
          return p.concat(c);
        } else {
          return [c];
        }
      } else {
        return p;
      }
    };
  });
  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }

    function mergeField(key) {
      if (strats[key]) {
        options[key] = strats[key](parent[key], child[key]);
      } else {
        options[key] = child[key] || parent[key];
      }
    }

    return options;
  }

  /*
   * @Author: JLDiao
   * @Date: 2022-09-14 14:26:59
   * @LastEditors: ***
   * @LastEditTime: 2022-09-14 15:25:09
   * @FilePath: \vue2-rollup\src\globalApi\index.js
   * @Description:
   * Copyright (c) 2022 by JLDiao, All Rights Reserved.
   */

  function initGlobalApi(Vue) {
    Vue.options = {};

    Vue.mixin = function (mixin) {
      // 我们期望将用户的选项和全局的options进行合并
      this.options = mergeOptions(this.options, mixin);
      return this;
    };
  }

  /*
   * @Author: JLDiao
   * @Date: 2022-09-09 13:58:03
   * @LastEditors: ***
   * @LastEditTime: 2022-09-09 16:44:25
   * @FilePath: \vue2-rollup\src\compiler\generate.js
   * @Description: 
   * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
   */
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配花括号 {{  }}；捕获花括号里面的内容

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i]; // 如果属性为 style 时，转化为 style:{a:b,c:d} 格式

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(";").forEach(function (item) {
            var _item$split = item.split(":"),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      } // 结果变为 a:b,c:d,...


      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    } // 删掉多余的逗号


    return "{".concat(str.slice(0, -1), "}");
  }

  function gen(node) {
    if (node.type === 1) {
      return codegen(node);
    } else {
      // 如果是纯文本
      var text = node.text;

      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        var tokens = [];
        var match, index; // 正则是全局模式 每次需要重置正则的lastIndex属性，不然会引发匹配bug（defaultTagRE.exec()匹配完一次后，再次匹配为null，需要重置lastIndex）

        defaultTagRE.lastIndex = 0;
        var lastIndex = 0;

        while (match = defaultTagRE.exec(text)) {
          // 匹配的位置
          index = match.index; // 放入文本值  {{name}}  hello {{age}}  取hello放入tokens

          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          } // tokens中放入变量


          tokens.push("_s(".concat(match[1].trim(), ")")); // 记录 }} 结束的位置

          lastIndex = index + match[0].length;
        } // 如果匹配完了花括号，text里面还有剩余的普通文本，那么继续push到tokens


        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }

        return "_v(".concat(tokens.join("+"), ")");
      }
    }
  }

  function genChildren(children) {
    if (children) {
      return children.map(function (child) {
        return gen(child);
      }).join(",");
    }
  }

  function codegen(ast) {
    var children = genChildren(ast.children);
    var code = "_c('".concat(ast.tag, "',").concat(ast.attrs.length > 0 ? genProps(ast.attrs) : null).concat(ast.children.length > 0 ? ",".concat(children) : '', ")");
    return code;
  }

  // 以下为vue源码的正则
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; //匹配标签名；形如 abc-123

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //匹配特殊标签;形如 abc:234,前面的abc:可有可无；获取标签名；

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 匹配标签开头；形如  <  ；捕获里面的标签名

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结尾，形如 >、/>

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配结束标签 如 </abc-123> 捕获里面的标签名

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性  形如 id="app"

  function parseHTML(template) {
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var stack = []; // 用于存放元素

    var currentParent; // 指向的是栈中的最后一个

    var root; // 最终需要转化成一颗抽象语法树

    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    function start(tagName, attrs) {
      var node = createASTElement(tagName, attrs); // 如果没有根元素，那么当前元素为根元素

      if (!root) {
        root = node;
      } // 给当前节点绑定父子关系


      if (currentParent) {
        node.parent = currentParent;
        currentParent.children.push(node);
      } // 将当前元素放入栈中


      stack.push(node); // 当前currentParent为当前节点

      currentParent = node;
    }

    function chars(text) {
      text = text.replace(/\s/g, ''); // 文本直接放到当前指向的节点中

      if (text) {
        currentParent.children.push({
          type: TEXT_TYPE,
          text: text,
          parent: currentParent
        });
      }
    }

    function end(tagName) {
      // 处理到结束标签时，将该元素从栈中移出
      stack.pop(); // 此时currentParent为stack中的上一个元素

      currentParent = stack[stack.length - 1];
    } // 截取 template 字符串，每次匹配到了就截掉


    function advance(n) {
      template = template.substring(n);
    } // 解析开始标签


    function parseStartTag() {
      // 匹配开始标签
      var start = template.match(startTagOpen); // start 格式为：['<div', 'div', index: 0, groups: undefined, input: '<div id=\"app\">']

      if (start) {
        var match = {
          tagName: start[1],
          // 标签名
          attrs: []
        };
        advance(start[0].length); // 如果不是开始标签的结束，就一直匹配下去
        // attr 格式为：["class=\"myClass\"", "class", "=", "myClass", undefined, undefined]

        var attr, _end;

        while (!(_end = template.match(startTagClose)) && (attr = template.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          advance(_end[0].length);
        }

        return match;
      }

      return false;
    }
    /**
     * 递归解析template，进行初步处理
     * 解析开始标签，将结果 {tagName, attrs} 交给handleStartTag函数处理
     * 解析结束标签，将结果 tagName 交给 handleEndTag 函数处理
     * 解析文本类型，将结果 text 交给 handleChars 函数处理
     */


    while (template) {
      // 查找 < 的位置，根据它的位置判断第一个元素是什么标签
      var textEnd = template.indexOf("<"); // 第一个元素为 '<' 时，即碰到开始/结束标签

      if (textEnd === 0) {
        // 匹配到开始标签 例如：<div>
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        } // 匹配到结束标签 例如：</div>


        var endTagMatch = template.match(endTag);

        if (endTagMatch) {
          end(endTagMatch[1]);
          advance(endTagMatch[0].length);
          continue;
        }
      } // 第一个元素为文本时


      if (textEnd > 0) {
        var text = template.substring(0, textEnd);

        if (text) {
          chars(text);
          advance(text.length);
        }
      }
    }

    return root;
  }

  /*
   * @Author: JLDiao
   * @Date: 2022-09-08 14:54:51
   * @LastEditors: ***
   * @LastEditTime: 2022-09-09 17:38:52
   * @FilePath: \vue2-rollup\src\compiler\index.js
   * @Description: 
   * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
   */
  function compileToFunction(template) {
    // 1、将template转成AST语法树：AST用来描述代码本身形成树结构，不仅可以描述html，也能描述css以及js语法
    var ast = parseHTML(template);
    /**
     * 2、通过AST，重新生成代码
     * 生成的代码需要跟render函数一样
     * 类似 _c('div',{id: "app"},_c('div',undefined,_v(_s(name)),_c('span',undefined,_v(_s(age))))
     * _c代表创建元素 _v代表创建文本 _s代表变量
     */

    var code = codegen(ast); // 模板引擎的实现原理就是 with + new Function

    code = "with(this){return ".concat(code, "}");
    var render = new Function(code);
    return render;
  }

  /*
   * @Author: JLDiao
   * @Date: 2022-09-08 13:40:22
   * @LastEditors: ***
   * @LastEditTime: 2022-09-14 17:32:48
   * @FilePath: \vue2-rollup\src\observe\array.js
   * @Description: 
   * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
   */
  // 获取数组原型
  var oldArrayProto = Array.prototype; // newArrayProto.__proto__ = oldArrayProto

  var newArrayProto = Object.create(oldArrayProto);
  var methods = ["push", "pop", "shift", "unshift", "sort", "reverse", "splice"];
  methods.forEach(function (method) {
    // 重写数组方法
    newArrayProto[method] = function () {
      var _oldArrayProto$method;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // 调用原数组方法，切片编程
      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args)); // 对新增的数据进行劫持


      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      } // 对新增的数据进行观测


      if (inserted) {
        ob.observeArray(inserted);
      }

      ob.dep.notify();
      return result;
    };
  });

  /*
   * @Author: JLDiao
   * @Date: 2022-09-13 15:41:25
   * @LastEditors: ***
   * @LastEditTime: 2022-09-14 18:00:59
   * @FilePath: \vue2-rollup\src\observe\dep.js
   * @Description: 
   * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
   */
  var id$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++; // 属性的dep要收集watcher

      this.subs = []; // 这里存放着当前属性对应的watcher有哪些
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        Dep.target.addDep(this);
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  Dep.target = null;
  var stack = [];
  function pushTarget(watcher) {
    stack.push(watcher);
    Dep.target = watcher;
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // data可以是数组也可以是对象
      this.dep = new Dep(); // 将__ob__变成不可枚举（循环的时候无法获取）

      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false
      }); // data.__ob__ = this;

      if (Array.isArray(data)) {
        // 保留数组原有的特性，并且重写部分方法
        data.__proto__ = newArrayProto;
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          // 对 data 中的每个属性进行响应式处理
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);

    return Observer;
  }();

  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function defineReactive(data, key, value) {
    // 对深层次对象进行递归处理
    var childOb = observe(value);
    var dep = new Dep(); // 重写对象，给每个属性添加get和set

    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend();

          if (childOb) {
            childOb.dep.depend();

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },
      set: function set(newVal) {
        if (newVal === value) return; // 对象赋值  重新代理

        observe(newVal);
        value = newVal;
        dep.notify();
      }
    });
  }

  function observe(data) {
    // 判断data是否返回一个对象，vue要求data return {}
    if (!isObject(data)) return; // 说明这个对象已经被代理过了

    if (data.__ob__ instanceof Observer) {
      return data.__ob__;
    } // 返回一个响应式对象


    return new Observer(data);
  }

  /*
   * @Author: JLDiao
   * @Date: 2022-09-07 16:46:24
   * @LastEditors: ***
   * @LastEditTime: 2022-09-07 17:27:13
   * @FilePath: \vue2-rollup\src\state.js
   * @Description: 
   * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
   */
  function initState(vm) {
    var opts = vm.$options; // 初始化data

    if (opts.data) {
      initData(vm);
    }
  } // 初始化data

  function initData(vm) {
    var data = vm.$options.data; // 往实例上添加一个 _data 属性，即传入的data
    // vue组件data推荐使用函数，防止数据在组件之间共享

    data = vm._data = isFunction(data) ? data.call(vm) : data; // 将vm._data上的数据代理到vm上

    for (var key in data) {
      proxy(vm, "_data", key);
    } // 对数据进行观测


    observe(data);
  } // 代理数据


  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newVal) {
        vm[source][key] = newVal;
      }
    });
  }

  /*
   * @Author: JLDiao
   * @Date: 2022-09-13 15:27:50
   * @LastEditors: ***
   * @LastEditTime: 2022-09-14 18:01:50
   * @FilePath: \vue2-rollup\src\observe\watcher.js
   * @Description: 
   * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
   */

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, fn, options) {
      _classCallCheck(this, Watcher);

      this.id = id++;
      this.renderWatcher = options;
      this.getter = fn;
      this.deps = [];
      this.depsIds = new Set();
      this.get();
    }

    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsIds.has(id)) {
          this.deps.push(dep);
          this.depsIds.add(id);
          dep.addSub(this);
        }
      }
    }, {
      key: "get",
      value: function get() {
        pushTarget(this);
        this.getter();
        popTarget(); // 渲染完毕后清空
      }
    }, {
      key: "update",
      value: function update() {
        queueWatcher(this);
      }
    }, {
      key: "run",
      value: function run() {
        this.get();
      }
    }]);

    return Watcher;
  }();
  /**
   * @param {Array} queue watcher队列
   * @param {*} has watcher 的id集合
   */


  var queue = [];
  var has = {};
  var pending = false; // 防抖

  function flushSchedulerQueue() {
    var flushQueue = queue.slice(0);
    queue = [];
    has = {};
    pending = false;
    flushQueue.forEach(function (q) {
      return q.run();
    });
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (!has[id]) {
      queue.push(watcher);
      has[id] = true;

      if (!pending) {
        nextTick(flushSchedulerQueue);
        pending = true;
      }
    }
  }

  var callback = [];
  var waiting = false;

  function flushCallbacks() {
    var cbs = callback.slice(0);
    waiting = false;
    callback = [];
    cbs.forEach(function (cb) {
      return cb();
    });
  } // nextTick 没有直接使用某个api 而是采用优雅降级的方式
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


  function nextTick(cb) {
    callback.push(cb);

    if (!waiting) {
      // timerFunc()
      Promise.resolve().then(flushCallbacks);
      waiting = true;
    }
  }

  /*
   * @Author: JLDiao
   * @Date: 2022-09-13 10:46:16
   * @LastEditors: ***
   * @LastEditTime: 2022-09-13 14:19:14
   * @FilePath: \vue2-rollup\src\vdom\index.js
   * @Description: 
   * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
   */
  function createElementVnode(vm, tag, data) {
    if (data === null) {
      data = {};
    }

    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    return vnode(vm, tag, key, data, children);
  }
  function createTextVnode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  } // 虚拟DOM

  function vnode(vm, tag, key, data, children, text) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text
    };
  }

  /*
   * @Author: JLDiao
   * @Date: 2022-09-09 16:51:07
   * @LastEditors: ***
   * @LastEditTime: 2022-09-14 15:33:14
   * @FilePath: \vue2-rollup\src\lifecycle.js
   * @Description: 
   * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
   */

  function createElm(vnode) {
    var tag = vnode.tag,
        data = vnode.data,
        children = vnode.children,
        text = vnode.text;

    if (typeof tag === 'string') {
      // 标签
      vnode.el = document.createElement(tag);
      patchProps(vnode.el, data);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function patchProps(el, props) {
    for (var key in props) {
      if (key === 'style') {
        // style: {color: 'red'; background: 'orange'}
        for (var styleName in props.style) {
          el.style[styleName] = props.style[styleName];
        }
      } else {
        el.setAttribute(key, props[key]);
      }
    }
  }

  function patch(oldVNode, vnode) {
    var isRealElement = oldVNode.nodeType; // isRealElement为真即为 初始渲染

    if (isRealElement) {
      var elm = oldVNode; // 拿到真是元素

      var parentElm = elm.parentNode; // 拿到父元素

      var newElm = createElm(vnode);
      parentElm.insertBefore(newElm, elm.nextSibling);
      parentElm.removeChild(elm); // 删除老节点

      return newElm;
    }
  }

  function initLifeCycle(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var el = vm.$el; // patch既有初始化的功能，又有更新

      vm.$el = patch(el, vnode);
    };

    Vue.prototype._c = function () {
      return createElementVnode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function () {
      return createTextVnode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._s = function (value) {
      if (_typeof(value) !== 'object') return value;
      return JSON.stringify(value);
    };

    Vue.prototype._render = function () {
      var vm = this;
      return vm.$options.render.call(vm);
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el; // 1、调用render方法产生虚拟节点 虚拟DOM

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };

    new Watcher(vm, updateComponent, true); // 2、根据虚拟DOM产生真实DOM
    // 3、插入到el元素中
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      handlers.forEach(function (handler) {
        return handler.call(vm);
      });
    }
  }

  /*
   * @Author: JLDiao
   * @Date: 2022-09-07 16:39:18
   * @LastEditors: ***
   * @LastEditTime: 2022-09-14 15:42:26
   * @FilePath: \vue2-rollup\src\init.js
   * @Description: 
   * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
   */

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 在实例上添加 $options 属性

      vm.$options = mergeOptions(this.constructor.options, options);
      callHook(vm, 'beforeCreate'); // 初始化状态，包括initProps、initData、initMethod、initComputed、initWatch等

      initState(vm);
      callHook(vm, 'created'); // 挂载数据

      if (options.el) {
        vm.$mount(options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var opts = vm.$options;
      el = document.querySelector(el);
      /**
       * 1、把模板转化成render函数
       * 2、执行render函数，生成VNode
       * 3、更新时进行diff
       * 4、产生真实DOM
       */
      // 可以直接在options中写render函数
      // 优先级： render > template > el

      if (!opts.render) {
        var template = opts.template;

        if (!opts.template && el) {
          template = el.outerHTML;
        } // 写了 template 就用写了的 template


        if (template) {
          // 将 template转化成render函数
          var render = compileToFunction(template);
          opts.render = render;
        }
      } // 组件的挂载


      mountComponent(vm, el);
    };
  }

  /*
   * @Author: JLDiao
   * @Date: 2022-09-07 16:11:59
   * @LastEditors: ***
   * @LastEditTime: 2022-09-14 15:17:57
   * @FilePath: \vue2-rollup\src\index.js
   * @Description: 
   * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
   */

  function Vue(options) {
    this._init(options);
  }

  Vue.prototype.$nextTick = nextTick;
  initMixin(Vue);
  initLifeCycle(Vue);
  initGlobalApi(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map

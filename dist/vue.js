(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  /*
   * @Author: JLDiao
   * @Date: 2022-09-08 14:54:51
   * @LastEditors: ***
   * @LastEditTime: 2022-09-09 11:25:43
   * @FilePath: \vue2-rollup\src\compiler\index.js
   * @Description: 
   * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
   */
  // 以下为vue源码的正则
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; //匹配标签名；形如 abc-123

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //匹配特殊标签;形如 abc:234,前面的abc:可有可无；获取标签名；

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 匹配标签开头；形如  <  ；捕获里面的标签名

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结尾，形如 >、/>

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配结束标签 如 </abc-123> 捕获里面的标签名

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性  形如 id="app"

  function compileToFunction(template) {
    //1、将template转成AST语法树：AST用来描述代码本身形成树结构，不仅可以描述html，也能描述css以及js语法
    parseHTML(template); //2、生成render方法
  }

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

    console.log(root);
    return root;
  }

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

  /*
   * @Author: JLDiao
   * @Date: 2022-09-07 16:56:24
   * @LastEditors: ***
   * @LastEditTime: 2022-09-07 17:14:13
   * @FilePath: \vue2-rollup\src\utils\index.js
   * @Description: 
   * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
   */
  function isFunction(val) {
    return typeof val === 'function';
  }
  function isObject(val) {
    return _typeof(val) === 'object';
  }

  /*
   * @Author: JLDiao
   * @Date: 2022-09-08 13:40:22
   * @LastEditors: ***
   * @LastEditTime: 2022-09-08 14:19:28
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

      console.log("method", ob);
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 将__ob__变成不可枚举（循环的时候无法获取）
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

  function defineReactive(data, key, value) {
    // 对深层次对象进行递归处理
    observe(value); // 重写对象，给每个属性添加get和set

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newVal) {
        if (newVal === value) return; // 对象赋值  重新代理

        observe(newVal);
        value = newVal;
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
   * @Date: 2022-09-07 16:39:18
   * @LastEditors: ***
   * @LastEditTime: 2022-09-08 15:04:16
   * @FilePath: \vue2-rollup\src\init.js
   * @Description: 
   * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
   */

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; // 在实例上添加 $options 属性

      vm.$options = options; // 初始化状态，包括initProps、initData、initMethod、initComputed、initWatch等

      initState(vm); // 挂载数据

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
      }
    };
  }

  /*
   * @Author: JLDiao
   * @Date: 2022-09-07 16:11:59
   * @LastEditors: ***
   * @LastEditTime: 2022-09-07 16:42:34
   * @FilePath: \vue2-rollup\src\index.js
   * @Description: 
   * Copyright (c) 2022 by JLDiao, All Rights Reserved. 
   */

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map

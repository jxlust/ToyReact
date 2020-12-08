const RENDER_TO_DOM = Symbol("render to dom");
class Component {
  constructor() {
    this.props = Object.create(null);
    this.children = [];
    this._root = null;
  }
  setAttribute(name, value) {
    this.props[name] = value;
  }
  appendChild(component) {
    this.children.push(component);
  }
  [RENDER_TO_DOM](range) {
    this.render()[RENDER_TO_DOM](range);
  }
  // _renderToDOM(range){
  //     this.render()._renderToDOM(range)
  // }
  // get root(){
  //     if(!this._root){
  //         this._root = this.render().root;//如果render的还是component继续递归获取root
  //     }
  //     return this._root;
  // }
}
export { Component };

class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  appendChild(component) {
    this.root.appendChild(component.root);
  }
}
class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
}

export function createElement(type, attr, ...children) {
  let e;
  if (typeof type === "string") {
    // e = document.createElement(type);
    e = new ElementWrapper(type);
  } else {
    e = new type();
  }
  for (let key in attr) {
    e.setAttribute(key, attr[key]);
  }
  const insertChildren = (children) => {
    for (let cnode of children) {
      if (typeof cnode === "string") {
        // cnode = document.createTextNode(cnode);
        cnode = new TextWrapper(cnode);
      }
      if (Array.isArray(cnode)) {
        insertChildren(cnode);
      } else {
        e.appendChild(cnode);
      }
    }
  };
  insertChildren(children);

  return e;
}

export function render(component, parentElement) {
  //真实dom parentElement
  parentElement.appendChild(component.root);
}

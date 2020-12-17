const RENDER_TO_DOM = Symbol('render to dom')
class Component {
    constructor() {
        this.props = Object.create(null);
        this.children = [];
        this._range = null;
        this._vdom = null;
        this.vchildren = null;
    }
    setAttribute(name, value) {
        this.props[name] = value;
    }
    appendChild(component) {
        this.children.push(component)
    }

    [RENDER_TO_DOM](range) {
        this._range = range;
        this._vdom = this.vdom;
        this._vdom[RENDER_TO_DOM](range);
    }

    get vdom() {
        return this.render().vdom;
    }
    // get vchildren() {
    //     return this.children.map(child => child.vdom)
    // }
    update() {
        let isSameNode = (oldNode, newNode) => {
            if (oldNode.type !== newNode.type) {
                return false;
            }
            for (let name in newNode.props) {
                if (newNode.props[name] !== oldNode.props[name]) {
                    return false;
                }
            }
            if (Object.keys(oldNode.props).length > Object.keys(newNode.props).length) {
                return false;
            }
            if (newNode.type === '#text') {
                if (newNode.content !== oldNode.content) {
                    return false;
                }
            }
            return true;
        }
        let update = (oldNode, newNode) => {
            //type props children
            //#text content 

            if (!isSameNode(oldNode, newNode)) {
                newNode[RENDER_TO_DOM](oldNode._range);
                return;
            }
            newNode._range = oldNode._range;

            let newChildren = newNode.vchildren;
            let oldChildren = oldNode.vchildren;

            if (!newChildren || !newChildren.length) {
                return;
            }
            let tailRange = oldChildren[oldChildren.length - 1]._range;


            for (let i = 0; i < newChildren.length; i++) {
                let newchild = newChildren[i];
                let oldchild = oldChildren[i];
                if (i < oldChildren.length) {
                    update(oldchild, newchild);
                } else {
                    //TODO
                    let range = document.createRange();
                    range.setStart(tailRange.endContainer, tailRange.endOffset);
                    range.setEnd(tailRange.endContainer, tailRange.endOffset);
                    newchild[RENDER_TO_DOM](range);
                    tailRange = range;

                }
            }
        }
        let vdom = this.vdom;
        update(this._vdom, vdom);
        this._vdom = vdom;
    }
    /*
    
    reRender() {
        // this._range.deleteContents();
        // this[RENDER_TO_DOM](this._range);
        let oldRange = this._range;

        let range = document.createRange();
        range.setStart(oldRange.startContainer, this._range.startOffset);
        range.setEnd(oldRange.startContainer, this._range.startOffset);
        this[RENDER_TO_DOM](range);

        oldRange.setStart(range.endContainer, range.endOffset);
        oldRange.deleteContents();
    }*/
    setState(newState) {
        if (this.state === null || typeof this.state !== 'object') {
            //typeof null === object
            this.state = newState;
            this.reRender();
            return;
        }
        let merge = (oldState, newState) => {
            for (let p in newState) {
                if (oldState[p] === null || typeof oldState[p] !== 'object') {
                    oldState[p] = newState[p];
                } else {
                    merge(oldState[p], newState[p])
                }

            }
        }
        merge(this.state, newState);
        this.update();
    }
    // _renderToDOM(range){
    //     this.render()._renderToDOM(range)
    // }

}
export {
    Component
}

class ElementWrapper extends Component {
    constructor(type) {
        super();
        this.type = type;
    }

    [RENDER_TO_DOM](range) {
        this._range = range;
        let root = document.createElement(this.type)

        for (let name in this.props) {
            let value = this.props[name];
            if (name.match(/^on([\s\S]+)$/)) {
                // RegExp.$1
                root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
            } else {
                if (name === 'className') {
                    name = 'class'
                }
                root.setAttribute(name, value)
            }
        }
        if (!this.vchildren) {
            this.vchildren = this.children.map(child => child.vdom)
        }
        for (let child of this.vchildren) {
            let childRange = document.createRange();
            childRange.setStart(root, root.childNodes.length);
            childRange.setEnd(root, root.childNodes.length);
            child[RENDER_TO_DOM](childRange);
        }

        replaceContent(range, root)
        // range.insertNode(root)
    }

    get vdom() {
        this.vchildren = this.children.map(child => child.vdom)
        return this;

    }
}
class TextWrapper extends Component {
    constructor(content) {
        super(content);
        this.type = '#test';
        this.content = content;
    }

    get vdom() {
        return this

    }

    [RENDER_TO_DOM](range) {
        this._range = range;
        let root = document.createTextNode(this.content)
        // range.deleteContents();
        // range.insertNode(this.root);
        replaceContent(range, root)
    }

}

function replaceContent(range, node) {
    range.insertNode(node);
    range.setStartAfter(node);
    range.deleteContents();

    range.setStartBefore(node);
    range.setEndAfter(node);
}

export function createElement(type, attr, ...children) {
    let e;
    if (typeof type === 'string') {
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
            if (typeof cnode === 'string') {
                // cnode = document.createTextNode(cnode);
                cnode = new TextWrapper(cnode)
            }
            if (cnode === null) {
                continue;
            }
            if (Array.isArray(cnode)) {
                insertChildren(cnode)
            } else {
                e.appendChild(cnode);
            }
        }
    }
    insertChildren(children)

    return e;
}

export function render(component, parentElement) {
    //真实dom parentElement
    let range = document.createRange();
    range.setStart(parentElement, 0);
    range.setEnd(parentElement, parentElement.childNodes.length);
    range.deleteContents();
    component[RENDER_TO_DOM](range)
}
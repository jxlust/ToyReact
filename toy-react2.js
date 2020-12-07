const RENDER_TO_DOM = Symbol('render to dom')
class Component {
    constructor() {
        this.props = Object.create(null);
        this.children = [];
        this._root = null;
        this._range = null;
    }
    setAttribute(name, value) {
        this.props[name] = value;
    }
    appendChild(component) {
        this.children.push(component)
    }
    [RENDER_TO_DOM](range){
        this._range = range;
        this.render()[RENDER_TO_DOM](range)
    }
    reRender(){
        // this._range.deleteContents();
        // this[RENDER_TO_DOM](this._range);
        let oldRange = this._range;

        let range = document.createRange();
        range.setStart(oldRange.startContainer,this._range.startOffset);
        range.setEnd(oldRange.startContainer,this._range.startOffset);
        this[RENDER_TO_DOM](range);

        oldRange.setStart(range.endContainer,range.endOffset);
        oldRange.deleteContents();
    }
    setState(newState){
        if(this.state === null || typeof this.state  !== 'object'){
            //typeof null === object
            this.state = newState;
            this.reRender();
            return;
        }
        let merge = (oldState,newState) => {
            for(let p in newState){
                if(oldState[p] === null || typeof oldState[p] !== 'object'){
                    oldState[p] = newState[p];
                }else{
                    merge(oldState[p],newState[p])
                }
                 
            }
        }
        merge(this.state,newState);
        this.reRender();
    }
    // _renderToDOM(range){
    //     this.render()._renderToDOM(range)
    // }
    
}
export {
    Component
}

class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }
    setAttribute(name, value) {
        if(name.match(/^on([\s\S]+)$/)){
            // RegExp.$1
            this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()),value)
        }else {
            if(name === 'className'){
                name = 'class'
            }
            this.root.setAttribute(name, value)
        }
    }
    appendChild(component) {
        let range = document.createRange();
        range.setStart(this.root,this.root.childNodes.length);
        range.setEnd(this.root,this.root.childNodes.length);
        component[RENDER_TO_DOM](range);
        // this.root.appendChild(component.root)
    }
    [RENDER_TO_DOM](range){
        range.deleteContents();
        range.insertNode(this.root)
    }
}
class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
    [RENDER_TO_DOM](range){
        range.deleteContents();
        range.insertNode(this.root)
    }
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
            if(cnode === null){
                continue;
            }
            if(Array.isArray(cnode)){
                insertChildren(cnode)
            }else{
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
    range.setStart(parentElement,0);
    range.setEnd(parentElement,parentElement.childNodes.length);
    range.deleteContents();
    component[RENDER_TO_DOM](range)
}
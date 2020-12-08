import { Component, render } from "./toy-react2.js";

class MyComponent extends Component {
  // constructor() {
  // }
  // setAttribute(name,value) {

  // }
  // appendChild() {
  // }
  constructor() {
    super();
    this.state = {
      a: 1,
      b: 2,
    };
  }
  // <button onclick={ ()=> {this.state.a++;this.reRender();}}>add</button>
  render() {
    return (
      <div>
        <h1>my first component</h1>
        <button
          onclick={() => {
            this.setState({ a: this.state.a + 1 });
          }}
        >
          add
        </button>
        <span>{this.state.a.toString()}</span>
        <span>{this.state.b.toString()}</span>
        {this.children}
      </div>
    );
  }
}

let a = (
  <MyComponent id="jxlId" class="root">
    <div>aaaa</div>
    <div>cccc</div>
    <div></div>
  </MyComponent>
);
// document.body.appendChild(a)
render(a, document.body);
// window.a = createElement("div", {
//     id: "jxlId",
//     "class": "root"
//   }, " ", createElement("div", null), " ", createElement("div", null), " ", createElement("div", null), " ");

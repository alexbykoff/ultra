const state = {
  counter: 0,
  max: 10,
  min: 0,
  inputValue: 'change me'
}

class MyApp extends Widget {

  updateCounter (mod) {
    let counter = this.state.counter + mod
    if (counter < this.state.min) counter = this.state.min
    if (counter > this.state.max) counter = this.state.max
    this.setState(() => ({counter}))
  }

  updateValue (input) {
    if (input.value === this.state.inputValue) return
    this.setState(() => ({inputValue: input.value}))
  }

  render () {
    return `
<div id="app">
    <h3>Simple Counter</h3>
    <span>${this.state.counter}</span>
    <button onclick="app.updateCounter(-1)">-</button>
    <button onclick="app.updateCounter(1)">+</button>
    <h3>Input Binding</h3>
    <input type="text" value="${state.inputValue}" onkeyup="app.updateValue(this)">
    <p>${this.state.inputValue}</p>
</div>`
  }
}

const app = new MyApp('app', state)
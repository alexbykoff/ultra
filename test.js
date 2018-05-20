const state = {
  groceryList: [],
  inputValue: '',
  index: 0,
  handleInput (e) {
    if (this.inputValue === e.value) return
    this.inputValue = e.value
    render()
  },
  addItem () {
    if (!this.inputValue) return
    this.groceryList.push({
      item: this.inputValue,
      inCart: false,
      index: this.index++
    })
    this.inputValue = ''
    render()
  },
  checkItem (index) {
    const item = this.groceryList.find(e => e.index === index)
    item.inCart = !item.inCart
    render()
  }
}

function render () {
  const app = `
<div id="app">
<h2>Grocery Manager</h2>
<input value="${state.inputValue}" type="text" onkeyup="state.handleInput(this)" onchange="state.addItem(this)"/>
<h3>Wish List</h3>
<ol>
${buildWishList()}
</ol>
<hr>
<h3>In Cart</h3>
<ol>
${buildListInCart()}
</ol>
</div>`
  R(document.querySelector('#app'), app)
}

render()

function buildWishList () {
  return state.groceryList
    .slice()
    .filter(e => !e.inCart)
    .sort(byItemName)
    .map(e => `<li onclick="state.checkItem(${e.index})">${e.item}</li>`)
    .join('')
}

function buildListInCart () {
  const cartList = state.groceryList
    .slice()
    .filter(e => e.inCart)
    .sort(byItemName)
  return cartList.length ?
    cartList.map(e => `<li class='in-cart' onclick="state.checkItem(${e.index})">${e.item}</li>`)
      .join('') : '<h5>Your shopping cart is empty</h5>'
}

function byItemName (a, b) {
  return a.item.localeCompare(b.item)
}




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
      index: this.index++,
      quantity: 1
    })
    this.inputValue = ''
    render()
  },
  checkItem (index) {
    const item = this.groceryList.find(e => e.index === index)
    item.inCart = !item.inCart
    render()
  },
  changeQuantity (index, inc) {
    event.stopPropagation()
    const item = this.groceryList.find(e => e.index === index)
    item.quantity += inc
    if (item.quantity === 0) {
      item.quantity = 1
      item.inCart = false
    }
    render()
  }
}

function render () {
  const app = `
<div id="app">
    <h2>Grocery Manager</h2>
    <input autofocus value="${state.inputValue}" type="text" onkeyup="state.handleInput(this)" onchange="state.addItem(this)"/>
    <h3>Wish List</h3>
    <ol>
        ${buildWishList()}
    </ol>    
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
  return cartList.length
    ? cartList.map(e => `
<li class='in-cart'>
    <span class="in-cart-description" onclick="state.checkItem(${e.index})">${e.item}</span>
    ${buttons(e)}
    <span class="in-cart-quantity">${e.quantity}</span>
</li>`)
    .join('') + `<div>You have ${cartList.length} positions in you cart</div>`
    : '<h5>Your shopping cart is empty</h5>'
}

function byItemName (a, b) {
  return a.item.localeCompare(b.item)
}

const buttons = props => `
<span class="in-cart-buttons">
    <button onclick="state.changeQuantity(${props.index}, -1)">-</button>
    <button onclick="state.changeQuantity(${props.index}, 1)">+</button>
</span>`



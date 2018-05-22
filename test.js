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
      price: ~~(Math.random() * 12) + 1,
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

const buttons = props => `
<span class="in-cart-buttons">
    <button onclick="state.changeQuantity(${props.index}, -1)">-</button>
    <button onclick="state.changeQuantity(${props.index}, 1)">+</button>
</span>`

const listItem = props =>
  `<li onclick="state.checkItem(${props.index})">${props.item} <span>$${props.price.toFixed(2)}</span></li>`

const cartItem = props => `
<li class='in-cart'>
    <span class="in-cart-description" onclick="state.checkItem(${props.index})">${props.item}</span>
    ${buttons(props)}
    <span class="in-cart-quantity">${props.quantity}</span>
</li>`

function render () {
  const itemsInCart = state.groceryList.filter(item => item.inCart).length
  const totalPrice = getTotalPrice()
  console.log(totalPrice)
  const app = document.querySelector('#app')
  const template = `
<div id="app">
    <h2>Grocery Manager</h2>
    <input autofocus value="${state.inputValue}" type="text" onkeyup="state.handleInput(this)" onchange="state.addItem(this)"/>
    <h3>Wish List</h3>
    <ol>
        ${buildWishList()}
    </ol>
    ${totalPrice ? `<div>Total price in wish list: ${totalPrice}</div>` : ''}    
    <h3>In Cart</h3>
    <ol>
        ${buildListInCart()}
    </ol>
    ${itemsInCart ? `<div>You have ${itemsInCart} positions in you cart</div>` : `<div>Your shopping cart is empty</div>`}    
</div>`

  R(app, template)
}

render()

function getTotalPrice () {
  return state.groceryList.reduce((total, item) => {
    if (!item.inCart) total += item.price
    return total
  }, 0)
}

function buildWishList () {
  return state.groceryList.slice().filter(e => !e.inCart).sort(byItemName).map(listItem).join('')
}

function buildListInCart () {
  const cartList = state.groceryList.slice().filter(e => e.inCart).sort(byItemName)
  return cartList.length ? cartList.map(cartItem).join('') : ''
}

function byItemName (a, b) {
  return a.item.localeCompare(b.item)
}


const state = {
  groceryList: [],
  inputValue: '',
  index: 0,
  validInput: false,
  handleInput (e) {
    if (this.inputValue === e.value) return
    this.validInput = e.value.length > 3
    this.inputValue = e.value
    render()
  },
  addItem () {
    if (!this.validInput) return
    this.groceryList.push({
      item: this.inputValue,
      inCart: false,
      index: this.index++,
      price: ~~(Math.random() * 12) + 1,
      quantity: 1
    })
    this.inputValue = ''
    this.validInput = false
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

const buttons = props =>
  `<span class="in-cart-buttons">
    <button onclick="state.changeQuantity(${props.index}, -1)">-</button>
    <button onclick="state.changeQuantity(${props.index}, 1)">+</button>
</span>`

const listItem = props =>
  `<li onclick="state.checkItem(${props.index})">${props.item} <span>$${props.price.toFixed(2)}</span></li>`

const cartItem = props =>
  `<li class='in-cart'>
    <span class="in-cart-description">${props.item}</span>
    ${buttons(props)}    
    <span class="in-cart-quantity">${props.quantity}</span>
    <span class="in-cart-price">per item: $${props.price.toFixed(2)}</span>    
</li>`

function render () {
  const itemsInCart = state.groceryList.filter(item => item.inCart).length
  const checkoutPrice = getCheckoutPrice()
  const counter = itemsInCart ? `<div>You have ${itemsInCart} position${itemsInCart > 1 ? 's' : ''} in your cart</div>` : `<div>Your shopping cart is empty</div>`
  const app = document.querySelector('#app')
  const template = `
<div id="app">
    <h2>Shopping List</h2>
    <input 
        class="${state.validInput ? 'valid' : ''}" 
        placeholder="enter desired positions here" 
        autofocus value="${state.inputValue}" 
        type="text" 
        onkeyup="state.handleInput(this)" 
        onchange="state.addItem(this)"/>
    <h3>Wish List</h3>
    <ol>${buildWishList()}</ol>    
    <h3>In Cart</h3>
    ${itemsInCart ? `<ol>${buildListInCart()}</ol>` : ''}
    ${counter}
    ${checkoutPrice ? `<div class="price-tag-holder"><i class="material-icons">shopping_cart</i> <span class="price-tag">$${checkoutPrice.toFixed(2)}</span></div>` : ''}        
</div>`
  R(app, template)
}

render()

function getCheckoutPrice () {
  return state.groceryList.reduce((total, item) => item.inCart ? total + (item.price * item.quantity) : total, 0)
}

function buildWishList () {
  return state.groceryList.slice().filter(e => !e.inCart).sort(abc).map(listItem).join('')
}

function buildListInCart () {
  const cartList = state.groceryList.slice().filter(e => e.inCart).sort(abc)
  return cartList.length ? cartList.map(cartItem).join('') : ''
}

function abc (a, b) {
  return a.item.localeCompare(b.item)
}


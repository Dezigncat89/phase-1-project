//Fetch Property to Render
fetch("https://realty-mole-property-api.p.rapidapi.com/saleListings?city=Austin&state=TX", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "8083349b5cmshccd0f23a12a5c31p116547jsnd085c55a0ee1",
		"x-rapidapi-host": "realty-mole-property-api.p.rapidapi.com"
	}
})
.then((response) => response.json())
.then((data) => {
	renderProperties(data)
	ready()
});

//Render Property Data to Cards
let renderProperties = (properties) => {
	console.log("running renderProperties() function")
  let propertyContainer = document.querySelector(`#propertyContainer`);
	properties.forEach(property => {
	  let propertyCard = document.createElement('div');
		propertyCard.setAttribute('class', 'propertyCard');
	  propertyCard.innerHTML = `
	    <h1 class="fullAddress"> Full Address: ${property.formattedAddress}</h1>

	    <p class ="numBathrooms">Number Bathrooms: ${property.bathrooms}</p>
		  <p class ="numBedrooms">Number Bedrooms: ${property.bedrooms}</p>
		  <p class ="propType">Property Type: ${property.propertyType}</p>
		  <p class ="avgPrice">Price: ${property.price}</p>
			<button class="btn btn-primary property-item-button" type="button">ADD TO CART</button>
   `;
   propertyContainer.append(propertyCard);

  });
};

//Shopping Cart Functionality
if (document.readyState == 'loading') {
  document.addEventListner('DOMContentLoaded', ready)
} else {
   ready()
}
function ready() {
	console.log("running the ready() function")
let removeItemButtons = document.getElementsByClassName('btn-danger')
for (let i = 0; i < removeItemButtons.length; i++) {
  let button = removeItemButtons[i]
  button.addEventListener('click', removeCartItem)
  }
  let quantityInputs = document.getElementsByClassName('cart-quantity-input')
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i]
    input.addEventListner('change', quantityChanged)
  }
  let addToCartButtons = document.getElementsByClassName('property-item-button')
  for (let i = 0; i < addToCartButtons.length; i++) {
    let button = addToCartButtons[i]
    button.addEventListener('click', addToCartClicked)
  }

document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked() {
  alert('Thank You for purchasing a home')
  let cartItems = document.getElementsByClassName('cart-items')[0]
  while(cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild)
  }
  updateCartTotal()
}

function removeCartItem(event) {
  let buttonClicked = event.target
  buttonClicked.parentElement.parentElement.remove()
  updateCartTotal()
}
function quantityChanged(event) {
  let input = event.target
  if(input.value <= 0) {
  input.value = 1
  }
  updateCartTotal()
}

function addToCartClicked(event) {
  let button = event.target
  let propertyItems1 = button.parentElement
  let fullAddress = propertyItems1.querySelector('.fullAddress').innerText
	let propType = propertyItems1.querySelector('.propType').innerText
  let avgPrice = propertyItems1.querySelector('.avgPrice').innerText
  addItemToCart(fullAddress,propType,avgPrice)
  updateCartTotal()

}

function addItemToCart(fullAddress, propType, avgPrice) {
    let cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    let cartItems = document.getElementsByClassName('cart-items')[0]
		let cartItemNames = cartItems.getElementsByClassName('cart-fullAddress')
    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == fullAddress) {
            alert('This item is already added to the cart')
            return
        }
    }

    let cartRowContents = `
        <div class="cart-item cart-column">
            <span class="cart-fullAddress">${fullAddress}</span>
						<span class="cart-propType">${propType}</span>
        </div>
        <span class="price cart-column">${avgPrice}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" min="0" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]
    let cartRows = cartItemContainer.getElementsByClassName('cart-row')
    let total = 0
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
				let price = cartRow.getElementsByClassName('price')[0]
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        let avgPrice = parseFloat(price.innerText.replace("Price: ",''))
        let quantity = parseFloat(quantityElement.value)
				console.log(price, quantityElement);
        total = total + (avgPrice * quantity)
    }
    total = Math.round(total * 100) / 100
		let totalPriceSpan = document.getElementById('total')
    totalPriceSpan.innerText = '$' + total
}

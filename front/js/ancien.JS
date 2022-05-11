// *********************** Déclarations des variables ********************
// Ceci est mon ancien "cart.js", je le laisse car j'aimerais avoir un avis l dessus 
const cartItems = document.getElementById('cart__items');
const cartItem = document.getElementsByClassName('cart__item');
const recupQuantity = document.getElementById('totalQuantity');
const getInput = document.getElementsByClassName('itemQuantity');
const recupPrice = document.getElementById('totalPrice');
const deleteItem = document.getElementsByClassName('deleteItem')
const shopInCarts = JSON.parse(localStorage.getItem("ShopCart"));
const firstNameErr = document.getElementById('firstNameErrorMsg');
const lastNameErr = document.getElementById('lastNameErrorMsg');
const addressErr = document.getElementById('addressErrorMsg');
const cityErr = document.getElementById('cityErrorMsg');
const emailErr = document.getElementById('emailErrorMsg');
const form = document.querySelector('form');
const nameRegex = /^[A-zÀ-ú' -]*$/;
const addressRegex = /([0-9]{1,}) ?([A-zÀ-ú,' -\. ]*)/;
const mailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
let cartCompleted = [];
let totalQuantity = 0;
let totauxPrice = 0;
let numbsInput;
let produitArray;
// ********************Recupérations des données ************************
const fectDocument =  () => {
      fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {   
        produitArray = data  
        actualsCartCompleted();
        cartDisplay();
        quantityPriceDisplay();
        supresseur();})
        .catch((error) => {
        console.error(error)
        return alert('Le serveur ne répond pas')
      })
  }
//   ************************Afficher les produits du panier ********************************************
const cartDisplay = () => {
    cartCompleted.forEach(e => {
        cartItems.innerHTML += `
        <article class="cart__item" data-id="${e.id}" data-color="${e.colors}">
        <div class="cart__item__img">
          <img src="${e.image}" alt="Photographie d'un canapé">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${e.name}</h2>
            <p>${e.colors}</p>
            <p>${e.price} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${e.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`
    });

// ************************************AddEventListenner input **********************************************************************************
    
for (let u = 0; u < getInput.length; u++) {
  const x = getInput[u]; 
  x.addEventListener('input', (e)=> {
    totalQuantity = 0;
    totauxPrice = 0;
    const idInput = e.target.closest('article').dataset.id;
    const colorInput = e.target.closest('article').dataset.color;
    
    numbsInput = e.target.value
    for (let i = 0; i < shopInCarts.length; i++) {
      const shops = shopInCarts[i];

      if (shops.cartId === idInput && shops.cartColors === colorInput)  {
        shops.cartValue = parseInt(numbsInput)
      }

      if (shops.cartValue > 100 ) {
        shops.cartValue = 100 
        numbsInput = 100 
      }

      else if ( !shops.cartValue || shops.cartValue === 0) {
       shops.cartValue = 1
       numbsInput = 1
      }
    }
 localStorage.setItem("ShopCart", JSON.stringify(shopInCarts));
 cartCompleted = [];
 actualsCartCompleted();
 quantityPriceDisplay();
})}}

// ***********************************AddeventListenner delete ******************************
const supresseur = () => {
  for (let i of deleteItem)
  i.addEventListener('click', () => {
    if (window.confirm('Voulez-vous vraiment supprimer cet article?')) {
      
      const idInput = i.closest('article').dataset.id;
      const colorInput = i.closest('article').dataset.color;
      const article = i.closest('article');
      for (let i = 0; i < shopInCarts.length; i++) {
        const e = shopInCarts[i];
      if (e.cartId === idInput && colorInput === e.cartColors) {
        shopInCarts.splice(i , 1)
        cartCompleted.splice(i, 1)
        localStorage.setItem("ShopCart", JSON.stringify(shopInCarts));
        article.remove()
        totalQuantity = 0;
        totauxPrice = 0;
        quantityPriceDisplay()
        if (totalQuantity === 0 ) {
          recupPrice.innerHTML = '0'
          recupQuantity.innerHTML = '0'
        }
      }
    }
    }
  })
}
// ****************************************Je lance la fonction ***************************************************************************************************
const quantityPriceDisplay = () => {
  for (let i = 0; i < cartCompleted.length; i++) {
    const e = cartCompleted[i];
    totalQuantity += e.quantity 
    totauxPrice += e.totalPrice
    recupQuantity.innerHTML = ` ${totalQuantity}`
    recupPrice.innerHTML = `${totauxPrice}`

  }
}

const actualsCartCompleted = () => {
    for (let i = 0; i < produitArray.length; i++) {
      const b = produitArray[i];
      shopInCarts.forEach((e) => {
        if (e.cartId === b._id ) {
          let x = {
            price: b.price,
            name : b.name,
            image : b.imageUrl,
            id : b._id,
            alt : b.altTxt, 
            descr : b.description,
            colors : e.cartColors,
            quantity: e.cartValue,
            totalPrice: e.cartValue * b.price,
          }
          cartCompleted.push(x)
      }
  }
)}
}
/*********************Fonction de check pour le formulaire*****************************************************************************************************/
const checkerOrder = () => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    let error = false;
    let firstName = e.target.firstName.value;
    let lastName = e.target.lastName.value;
    let address = e.target.address.value;
let city = e.target.city.value;
let email = e.target.email.value
if (!firstName.match(nameRegex)) {
    firstNameErr.innerHTML = 'Prénom invalide';
    error = false;
}
if (!lastName.match(nameRegex)) {
    lastNameErr.innerHTML = 'Nom invalide';
    error = true;
}
if (!address.match(addressRegex)) {
    addressErr.innerHTML = 'Adresse invalide';
    error = true;
}
if (!city.match(nameRegex)) {
    cityErr.innerHTML = 'Ville invalide';
    error = true;
}
if (!email.match(mailRegex)) {
    emailErr.innerHTML = 'Email invalide';
error = true;
}
if (error === true) {return alert('Certains champs sont incorrect')}
let contact = {
    firstName,
    lastName,
    address,
    city,
    email
}
let products = []
for (const id of shopInCarts) {products.push(id.cartId)}
const params = {
method: "POST",
headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
},

body: JSON.stringify({
    products,
    contact
})
}
try {

const fectDocument = await fetch ('http://localhost:3000/api/products/order', params);
localStorage.removeItem('ShopCart')
const data = await fectDocument.json()
location.href = './confirmation.html?id= ' + data.orderId
}
catch(error){console.error(error);}
})
}
fectDocument()
checkerOrder()

// ********************************************************Formulaire*******************************************************





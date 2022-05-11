// *********************** Déclarations des variables ********************
document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('form');
    const firstNameErr = document.getElementById('firstNameErrorMsg');
    const lastNameErr = document.getElementById('lastNameErrorMsg');
    const addressErr = document.getElementById('addressErrorMsg');
    const cityErr = document.getElementById('cityErrorMsg');
    const emailErr = document.getElementById('emailErrorMsg');
    const shopInCarts = JSON.parse(localStorage.getItem("ShopCart"));
    const section = document.getElementById("cart__items")
    const quantityCart = document.getElementsByClassName('itemQuantity')
    const deleteItem = document.getElementsByClassName('deleteItem');

    const nameRegex = /^[A-zÀ-ú' -]*$/;
    const addressRegex = /([0-9]{1,}) ?([A-zÀ-ú,' -\. ]*)/;
    const mailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    let banalArray = []
 // *****************************************************************************
        if (!shopInCarts) {
            const h2 = document.createElement('h2');
            h2.textContent = 'Votre panier est vide !';
            section.appendChild(h2);
            return
        }
// ******************Une boucle qui affiche tous les produits du localeStorage, j'ajoute aussi les produits au complets dans un tableau pour recuperer le prix************************************************************
        for (const canap of shopInCarts) {
            const res = await fetch("http://localhost:3000/api/products/" + canap.cartId)
            produitArray = await res.json(); 
            banalObject = {
                id : canap.cartId,
                colors : canap.cartColors,
                price : produitArray.price
            }
            banalArray.push(banalObject)
            

            const article = document.createElement("article");
            const divImg = document.createElement("div");
            const img = document.createElement("img");
            const divContent = document.createElement('div');
            const divDesc = document.createElement('div');
            const h2 = document.createElement('h2');
            const pColor = document.createElement('p');
            const pPrice = document.createElement('p');
            const divSett = document.createElement('div');
            const divQty = document.createElement('div');
            const pQty = document.createElement('p');
            const input = document.createElement('input');
            const divDel = document.createElement('div');
            const pDel = document.createElement('p');
                
            img.src = produitArray.imageUrl;
            img.alt = produitArray.altTxt;
            h2.textContent = produitArray.name;
            pColor.textContent = canap.cartColors;
            pPrice.textContent = produitArray.price + ' €';
            pQty.textContent = 'Qté : ';
            pDel.textContent = 'Supprimer';
            
            article.classList.add("cart__item");
            divImg.classList.add("cart__item__img");
            divContent.classList.add('cart__item__content');
            divDesc.classList.add('cart__item__content__description');
            divSett.classList.add('cart__item__content__settings');
            divQty.classList.add('cart__item__content__settings__quantity');
            divDel.classList.add('cart__item__content__settings__delete');
            input.classList.add('itemQuantity');
            pDel.classList.add('deleteItem');
            
            article.dataset.id = canap.cartId;
            article.dataset.color = canap.cartColors;
            input.type = 'number';
            input.name = 'itemQuantity';
            input.min  = '1';
            input.max  = '100';
            input.value  = canap.cartValue;
            
            section.appendChild(article);
            article.appendChild(divImg);
            divImg.appendChild(img);
            article.appendChild(divContent);
            divContent.appendChild(divDesc);
            divDesc.appendChild(h2);
            divDesc.appendChild(pColor);
            divDesc.appendChild(pPrice);
            divContent.appendChild(divSett);
            divSett.appendChild(divQty);
            divQty.appendChild(pQty);
            divQty.appendChild(input);
            divSett.appendChild(divDel);
            divDel.appendChild(pDel);
        }
        
// **************************Boucle pour recuperer chacun des supprimer et recuperer les data puis un listenner pour écouter le click ************************************************************************
for (let e of deleteItem) {
    const idInput = e.closest('article').dataset.id;
    const colorInput = e.closest('article').dataset.color;
    const article = e.closest('article');
    e.addEventListener('click', () => {
        if (confirm('Voulez-vous vraiment supprimer cet article')) {
            article.parentNode.removeChild(article)
            shopInCarts.splice(shopInCarts.indexOf(shopInCarts.find(test => test.cartId === idInput && test.cartColors === colorInput)), 1 )
            banalArray.splice(banalArray.indexOf(banalArray.find(test => test.id === idInput && test.colors === colorInput)), 1 )
            localStorage.setItem('ShopCart', JSON.stringify(shopInCarts))
            alert('Le produit a bien été supprimé')
            total(shopInCarts)
        }
        total(shopInCarts)
    })
}
// ****************Fonction pour les totaux*************************************************************************************************************************************************************************
const total = (shopInCarts) => {
    let totalPrice = 0;
    let totalQuantity = 0;

    for (let i = 0; i < shopInCarts.length; i++) {
        const e = shopInCarts[i];
        let price = banalArray[i].price
        totalQuantity += parseInt(e.cartValue);
        totalPrice += parseInt(price) * parseInt(e.cartValue);
    }
    document.getElementById('totalQuantity').textContent = totalQuantity
    document.getElementById('totalPrice').textContent = totalPrice
    }

// *********************Une boucle sur les inputs; pour recuperer les data et y ajouter un listenner******************************************************************************
for (let e of quantityCart) {
    const idInput = e.closest('article').dataset.id;
    const colorInput = e.closest('article').dataset.color;
    e.addEventListener('input', (e) => {
            const quantityInput = e.target.value
            let cartFound = shopInCarts.find(test => test.cartId === idInput && test.cartColors === colorInput)
            if (quantityInput > 100 ) {
                quantityInput = 100
                alert('Vous ne pouvez pas dépasser les 100 articles par produit')
            }
            else if ( quantityInput < 0  || quantityInput === null || quantityInput === '' ) {
                quantityInput = 1
            }
            cartFound.cartValue = parseInt(quantityInput)
            localStorage.setItem('ShopCart', JSON.stringify(shopInCarts))
            total(shopInCarts)
    })
    total(shopInCarts)
}

// *****************Check du formulaire ***********************************************************************************************************************************************
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

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
// **************************************Je prépare les informations à envoyer************************************************************
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
// *****************************J'envoie les informations *********************************************************************************
try {
    
    const fectDocument = await fetch ('http://localhost:3000/api/products/order', params);
    localStorage.removeItem('ShopCart')
    const data = await fectDocument.json()
    location.href = './confirmation.html?id= ' + data.orderId
}
catch(error){console.error(error);}
})

})
// ********************************************************************************************************************************************************

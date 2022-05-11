// ***************Je déclare mes variables*********************
let nameOfPage = document.querySelector('title').textContent
const href = window.location.href;
const sectionItems = document.getElementById("items");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const productImg = document.querySelector(".item__img");
const h1 = document.getElementById("title");
const price = document.getElementById("price");
const descr = document.getElementById("description");
const colors = document.getElementById("colors");
const quantity = document.getElementById("quantity");
const addToCart = document.getElementById("addToCart");
let qV;
let cV;

// *****************Récuperation des données / écouteur sur la quantitée et la couleur choisis********
const fectDocument = async () => {
  await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => (produitArray = data));
};

const colorsCheck = () => {
  colors.addEventListener("input", (e) => {
    cV = e.target.value;
  });
};

const quantityCheck = () => {
  quantity.addEventListener("input", (e) => {
    qV = e.target.value;
  });
};

// ******************Fonction pour afficher chaque produit sur l'index ************************************
const kanapsDisplay = async () => {
  await fectDocument();
  for (let i = 0; i < produitArray.length; i++) {
    sectionItems.innerHTML += `<a href ="./product.html?id=${produitArray[i]._id}">
        <article>
        <img src="${produitArray[i].imageUrl}" alt="${produitArray[i].altTxt},${produitArray[i].name}">
        <h3 class="productName">${produitArray[i].name}</h3>
        <p class="productDescription">${produitArray[i].description}</p>
        </article>
        </a>
        `;
  }
};

// *************************Fonction qui sert a affiché le produit choisis sur la page product**********
const productDisplay = async () => {
  await fectDocument();
  produitArray.forEach((kanap) => {
    if (kanap._id === id) {
      productImg.innerHTML = `<img src="${kanap.imageUrl}"alt="${kanap.altTxt}">`;
      h1.innerHTML = `${kanap.name}`;
      price.innerHTML = `${kanap.price}`;
      descr.innerHTML = `${kanap.description}`;
      kanap.colors.forEach((couleur) => {
        colors.innerHTML += `<option value="${couleur}">${couleur}</option>`;
      });
    }
  });
};

// *******************Fonction pour lancer le contrôle du panier au clique du bouton  *********************************************************************
const buttonCheck = () => {
  addToCart.addEventListener("click", () => {
    addToCartCheck();
  });
};

// *************************************Fonction pour faire le contrôle du panier dans les conditions demandée **********************************************************************************
const addToCartCheck =  () => {
  colorsCheck();
  quantityCheck();
  let shopInCarts = JSON.parse(localStorage.getItem("ShopCart"));
  let shopInCartsUnstri = localStorage.getItem("ShopCart");
  let banalArray = [];
  let actualCart = { cartId: id, cartValue: parseInt(qV), cartColors: cV,};

  if (!qV || !cV || qV === "0" || qV > 100) {
    return alert("Veuillez remplir correctement les valeurs demandé.");
  }

  if (shopInCarts === undefined || shopInCarts === 0 || shopInCarts === null) {
    banalArray.push(actualCart);
    localStorage.setItem("ShopCart", JSON.stringify(banalArray));

    return alert("Votre sélection a bien été ajouté au panier. Merci !");
  } else if (shopInCarts.length > 0) {
    for (let i = 0; i < shopInCarts.length; i++) {
      const e = shopInCarts[i];

      if (e.cartId === id && e.cartColors === cV) {
        e.cartValue = parseInt(shopInCarts[i].cartValue) + parseInt(qV);

        if (e.cartValue > 100) {
          return alert(
            `Si vous ajouté cette quantité, votre panier sera de ${e.cartValue} pour ce produit. Les produit ont une limite d'achat de 100 maximum.`
          );
        } else {
          localStorage.setItem("ShopCart", JSON.stringify(shopInCarts));
          return alert(`Vous avez ajouté ${qV} article(s) pour un total de ${e.cartValue} articles. Merci !` )
        }
      }
    }
  }
  shopInCarts.push(actualCart)
  localStorage.setItem("ShopCart", JSON.stringify(shopInCarts));
  return alert('Votre sélection a bien été ajouté au panier! Merci !')
};

// ************************** Si qui compare le lien de la page pour savoir quelle fonction lancé en fonction de la page  ********************************
if ("Kanap" === nameOfPage) {
  kanapsDisplay();  
} else {
  productDisplay();
  buttonCheck();
  colorsCheck();
  quantityCheck();
}
// *******************************************************************************************************************************

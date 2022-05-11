const params = new URLSearchParams(window.location.search);
const orderId = document.getElementById('orderId');
const id = params.get("id");
orderId.textContent = id;

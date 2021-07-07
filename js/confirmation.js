var orderData = JSON.parse(localStorage.getItem("orinoco-order-data"));
console.log(orderData);

const d_orderId = document.getElementById("orderId");
const d_orderPrice = document.getElementById("orderPrice");

// fill the confirmation page
window.addEventListener("load", async function () {
	d_orderId.textContent = "Identifiant de commande : " + orderData.id;
	d_orderPrice.textContent = "Prix total : " + orderData.price + "€";
});

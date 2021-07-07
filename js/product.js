const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

const img = document.getElementById("product_img");
const title = document.getElementById("product_title");
const description = document.getElementById("product_description");
const price = document.getElementById("product_price");
const color_select = document.getElementById("product_color");
const quantity_select = document.getElementById("product_quantity");

const addBtn = document.getElementById("add-cart-btn");

window.addEventListener("load", async function () {
	const product = await getDataFromApi(id);
	fillProduct(product);

	var cart = JSON.parse(localStorage.getItem("orinoco-cart"));
	console.log(cart);
});

function fillProduct(product) {
	document.title = "Orinoco | Peluche " + product.name;

	setAttributes(img, {
		src: product.imageUrl,
		alt: "Photo d'ours en peluche " + product.name,
	});
	title.textContent = product.name;
	description.textContent = product.description;
	price.textContent = product.price + "€";

	product.colors.forEach((color) => {
		var option = document.createElement("option");
		option.text = color;
		option.value = color;
		color_select.add(option);
	});

	for (i = 1; i < 11; i++) {
		var option = document.createElement("option");
		option.text = i;
		option.value = i;
		quantity_select.add(option);
	}

	addBtn.addEventListener("click", clientAddToCart);
}

function clientAddToCart() {
	const p_color = color_select.value;
	const p_quantity = Number(quantity_select.value);

	var cart = JSON.parse(localStorage.getItem("orinoco-cart"));
	if (cart == null) {
		var newcart = [];
		var newItem = { id: id, color: p_color, quantity: p_quantity };
		newcart.push(newItem);
		localStorage.setItem("orinoco-cart", JSON.stringify(newcart));
	} else {
		var identicalItem = false;
		cart.forEach((item) => {
			if (item.id == id) {
				if (item.color == p_color) {
					identicalItem = true;
					item.quantity = item.quantity + p_quantity;
					localStorage.setItem("orinoco-cart", JSON.stringify(cart));
					return false;
				}
			}
		});

		if (identicalItem == false) {
			var newItem = { id: id, color: p_color, quantity: p_quantity };
			cart.push(newItem);
			localStorage.setItem("orinoco-cart", JSON.stringify(cart));
		}
	}
	alert("Le produit a bien été ajouté à votre panier.");
	console.log(cart);
}

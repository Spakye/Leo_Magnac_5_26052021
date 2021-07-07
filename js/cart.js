const d_cart = document.getElementById("cart");
const d_price = document.getElementById("cart_price");
const title_cart = document.getElementById("title_cart");
const d_order = document.getElementById("order");
const hrmid = document.getElementById("hrmid");
var cart = JSON.parse(localStorage.getItem("orinoco-cart"));
console.log(cart);
var productsData = new Map();

// form elements
const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

const btn_order = document.getElementById("btn_order");
btn_order.addEventListener("click", isFormValid);
//

// on page loaded, ask data from api
window.addEventListener("load", async function () {
	cart.forEach((itemInCart) => {
		getDataFromApi(itemInCart.id)
			.then((itemData) => {
				productsData.set(itemData._id, {
					price: itemData.price,
					img: itemData.imageUrl,
					name: itemData.name,
				});
				AddItemToTheCartPage(itemInCart);
			})
			.catch((err) => {
				console.log(err);
			});
	});
	if (cart.length == 0) {
		title_cart.innerText = "Vôtre panier est vide";
		d_order.style.display = "none";
		hrmid.style.display = "none";
	}
	console.log(productsData);
});

function AddItemToTheCartPage(item) {
	if (d_cart.children[1] != null) {
		const hr = document.createElement("hr");
		setAttributes(hr, {
			id: "hr_" + item.id + "_" + item.color,
		});
		d_cart.append(hr);
	}
	const index = cart.indexOf(item);

	const card = document.createElement("div");
	setAttributes(card, {
		id: "card_" + item.id + "_" + item.color,
		class: "card mb-3",
	});

	const cardRow = document.createElement("div");
	setAttributes(cardRow, {
		class: "row g-0",
	});

	const cardDivImg = document.createElement("div");
	setAttributes(cardDivImg, {
		class: "col-md-2",
	});

	const cardImg = document.createElement("img");
	setAttributes(cardImg, {
		src: productsData.get(item.id).img,
		alt: "Photo de l'ours en peluche " + productsData.get(item.id).img,
		class: "card-img-left",
	});

	const cardDivRight = document.createElement("div");
	setAttributes(cardDivRight, {
		class: "col-md-10",
	});

	const cardDivBody = document.createElement("div");
	setAttributes(cardDivBody, {
		class: "card-body",
	});

	const cardTitle = document.createElement("h5");
	setAttributes(cardTitle, {
		class: "card-title",
	});
	cardTitle.innerText = productsData.get(item.id).name;

	const cardColor = document.createElement("p");
	setAttributes(cardColor, {
		class: "card-color",
	});
	cardColor.innerText = "Couleur : " + item.color;

	const cardPrice = document.createElement("p");
	setAttributes(cardPrice, {
		class: "card-price",
	});
	cardPrice.innerText = "Prix : " + productsData.get(item.id).price + "€";

	const cardQuantityDiv = document.createElement("div");
	setAttributes(cardQuantityDiv, {
		class: "d-flex align-items-center",
	});

	const btnPlus = document.createElement("button");
	setAttributes(btnPlus, {
		class: "btn btn-primary",
		type: "button",
		id: "btn+_" + item.id + "_" + item.color,
	});
	btnPlus.innerText = "+";
	btnPlus.addEventListener("click", changeQuantity);

	const btnMinus = document.createElement("button");
	setAttributes(btnMinus, {
		class: "btn btn-primary",
		type: "button",
		id: "btn-_" + item.id + "_" + item.color,
	});
	btnMinus.innerText = "-";
	btnMinus.addEventListener("click", changeQuantity);

	const cardQuantity = document.createElement("label");
	setAttributes(cardQuantity, {
		class: "px-1",
		id: "qtt_" + item.id + "_" + item.color,
	});
	cardQuantity.innerText = item.quantity;

	const btnTrash = document.createElement("button");
	setAttributes(btnTrash, {
		class: "btn btn-primary ms-3",
		type: "button",
		id: "trash_" + item.id + "_" + item.color,
	});
	// btnTrash.innerHTML = '<i class="fas fa-trash-alt"/>';
	// bin icone
	btnTrash.innerHTML = "🗑";
	btnTrash.addEventListener("click", deleteProduct);

	card.append(cardRow);

	cardRow.append(cardDivImg, cardDivRight);
	cardDivImg.append(cardImg);

	cardDivRight.append(cardDivBody);

	cardDivBody.append(cardTitle, cardColor, cardPrice, cardQuantityDiv);

	cardQuantityDiv.append(btnMinus, cardQuantity, btnPlus, btnTrash);

	d_cart.append(card);
	updateTotalPrice(item.quantity, productsData.get(item.id).price);
}

function updateTotalPrice() {
	var totalPrice = 0;
	cart.forEach((item) => {
		totalPrice = totalPrice + item.quantity * productsData.get(item.id).price;
	});
	d_price.innerText = "Total: " + totalPrice + " €";
}

function changeQuantity() {
	var target = event.target;
	var selector = target.id.substr(5);
	var theCard = document.getElementById("card_" + selector);
	var hr = document.getElementById("hr_" + selector);
	var quantityLabel = document.getElementById("qtt_" + selector);
	var newQuantity;
	if (target.textContent == "+") {
		quantityLabel.innerText = Number(quantityLabel.textContent) + 1;
		newQuantity = Number(quantityLabel.textContent);
	} else {
		quantityLabel.innerText = Number(quantityLabel.textContent) - 1;
		newQuantity = Number(quantityLabel.textContent);
		if (newQuantity == 0) {
			theCard.remove();
			if (hr != null) {
				hr.remove();
			}
		}
	}
	cart.forEach((item) => {
		if (item.id + "_" + item.color == selector) {
			item.quantity = newQuantity;
			if (newQuantity == 0) {
				var index = cart.indexOf(item);
				cart.splice(index, 1);
			}
		}
	});
	localStorage.setItem("orinoco-cart", JSON.stringify(cart));

	deleteFirstHr();
	updateTotalPrice();
	checkIfCartIsEmpty();
}

function deleteProduct() {
	var target = event.target;
	var selector = target.id.substr(6);
	var theCard = document.getElementById("card_" + selector);
	var hr = document.getElementById("hr_" + selector);

	console.log(target.id);
	console.log(selector);
	console.log(theCard);
	console.log(hr);

	if (hr != null) {
		hr.remove();
	}
	theCard.remove();
	cart.forEach((item) => {
		if (item.id + "_" + item.color == selector) {
			var index = cart.indexOf(item);
			cart.splice(index, 1);
		}
	});
	localStorage.setItem("orinoco-cart", JSON.stringify(cart));

	deleteFirstHr();
	updateTotalPrice();
	checkIfCartIsEmpty();
}

function checkIfCartIsEmpty() {
	if (cart.length == 0) {
		title_cart.innerText = "Vôtre panier est vide";
		d_order.style.display = "none";
		d_price.innerText = "";
		hrmid.style.display = "none";
	}
}

function deleteFirstHr() {
	if (d_cart.children[1] != null) {
		if (d_cart.children[1].tagName == "HR") {
			d_cart.children[1].remove();
		}
	}
}

function isFormValid() {
	//regex
	const regNumber = new RegExp("\\d");
	const regEmail = new RegExp(
		"[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]*"
	);
	//

	if (
		firstname.value != "" &&
		firstname.value.length >= 2 &&
		regNumber.test(firstname.value) == false
	) {
		console.log("First name is ok!");
		if (
			lastname.value != "" &&
			lastname.value.length >= 2 &&
			regNumber.test(lastname.value) == false
		) {
			console.log("Last name is ok!");
			if (address.value != "" && address.value.length >= 10) {
				console.log("Address is ok!");
				if (
					city.value != "" &&
					city.value.length >= 3 &&
					regNumber.test(city.value) == false
				) {
					console.log("City is ok!");
					if (email.value != "" && regEmail.test(email.value) == true) {
						console.log("Email is ok!");
						newOrder();
					} else {
						alert("Email invalide");
					}
				} else {
					alert("Ville invalide");
				}
			} else {
				alert("Adresse invalide");
			}
		} else {
			alert("Nom invalide");
		}
	} else {
		alert("Prénom invalide");
	}
}

function newOrder() {
	const contact = {
		firstName: firstname.value,
		lastName: lastname.value,
		address: address.value,
		city: city.value,
		email: email.value,
	};
	var products = [];
	cart.forEach((item) => {
		products.push(item.id);
	});
	postData(contact, products)
		.then((response) => {
			console.log(response);
			emptyTheCart();
			saveOrderData(response);

			window.location.replace("confirmation.html");
		})
		.catch((err) => {
			console.log(err);
			alert("Erreur");
		});
}

function saveOrderData(data) {
	var orderPrice = d_price.textContent.match(/(\d+)/);
	var orderData = { id: data.orderId, price: orderPrice[0] };
	localStorage.setItem("orinoco-order-data", JSON.stringify(orderData));
}

function emptyTheCart() {
	var newcart = [];
	localStorage.setItem("orinoco-cart", JSON.stringify(newcart));
}

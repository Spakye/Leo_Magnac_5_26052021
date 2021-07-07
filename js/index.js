const s_products = document.getElementById("section_products");

window.addEventListener("load", async function () {
	getDataFromApi()
		.then((products) => {
			fillProducts(products);
		})
		.catch((err) => {
			console.log(err);
		});
});

function fillProducts(products) {
	products.forEach((product) => {
		const card = document.createElement("div");
		setAttributes(card, {
			id: product._id,
			class: "card col-12 col-sm-12 col-md-5 col-lg-3 mx-5 my-5",
		});

		const cardImage = document.createElement("img");
		setAttributes(cardImage, {
			src: product.imageUrl,
			class: "card-img-top",
			alt: "Photo de l'ours en peluche " + product.name,
		});

		const cardBody = document.createElement("div");
		setAttributes(cardBody, {
			class: "card-body",
		});

		const cardTitle = document.createElement("h5");
		setAttributes(cardTitle, {
			class: "card-title",
		});
		cardTitle.innerText = product.name;

		const cardDescription = document.createElement("p");
		setAttributes(cardDescription, {
			class: "card-text",
		});
		cardDescription.innerText = product.description;

		const cardPrice = document.createElement("p");
		setAttributes(cardPrice, {
			class: "card-text",
		});
		cardPrice.innerText = product.price + "€";

		const cardLink = document.createElement("a");
		setAttributes(cardLink, {
			href: "produit.html?id=" + product._id,
			class: "btn btn-primary",
		});
		cardLink.innerText = "Voir plus";

		card.append(cardImage, cardBody);
		cardBody.append(cardTitle, cardTitle, cardDescription, cardPrice, cardLink);

		s_products.appendChild(card);
	});
}

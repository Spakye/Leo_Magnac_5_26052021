function getDataFromApi(id) {
	if (id == null) {
		id = "";
	}
	return new Promise((resolve, reject) => {
		fetch("http://localhost:3000/api/teddies/" + id)
			.then((res) => {
				resolve(res.json());
			})
			.catch((error) => {
				reject(error);
			});
	});
}

function postData(contact, products) {
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ contact, products }),
	};
	return new Promise((resolve, reject) => {
		fetch("http://localhost:3000/api/teddies/order", options)
			.then((res) => {
				resolve(res.json());
			})
			.catch((error) => {
				reject(error);
			});
	});
}

function setAttributes(element, attributes) {
	for (let key in attributes) {
		element.setAttribute(key, attributes[key]);
	}
}

function getParentNode(element, level = 1) {
	while (level-- > 0) {
		element = element.parentNode;
		if (!element) {
			return null;
		}
	}
	return element;
}

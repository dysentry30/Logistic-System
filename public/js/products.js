const tableContentElt = document.querySelector("#table-content");
const loadingElt = document.querySelector("#loading");
const tableElt = document.querySelector(".table");
const menuElt = document.querySelector(".menu");
const deleteButton = document.querySelector("#delete-button");
const editButton = document.querySelector("#edit-button");
const notFoundElt = document.querySelector(".not-found");
const loadingV2Elt = document.querySelector(".loading-v2");
const editProductElt = document.querySelector(".edit-product");
const inputNameProduct = document.querySelector("#name-product2");
const inputPriceProduct = document.querySelector("#price-product");
const inputIDProduct = document.querySelector("#id-product");
const inputEditProductElt = document.querySelector("form");
const textFieldPriceProduct = document.querySelector("#price-product");
const paginationButtons = document.querySelectorAll(".pagination > li > a");



tableElt.style.display = "none";

const numberToMoneyFormat = (number) => {
    if (number instanceof Number) {
        const numberFormatted = Intl.NumberFormat("id", {}).format(number);
        return numberFormatted;
    }
    throw `This function require number parameter not ${typeof number} parameter`;
}

const moneyFormatToNumber = (string) => {
    if (string instanceof String) {
        return new Number(string.replaceAll(".", "").trim().toString());
    }
    throw `this function require string parameter not ${typeof string} parameter`;
}


fetch("/get-products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(resolve => resolve.json())
    .then(products => {
        const showData = (products) => {
            let html = "";
            tableContentElt.innerHTML = "";
            if (products.length < 1) {
                notFoundElt.classList.remove("hide");
                tableElt.classList.add("hide");
                return;
            }
            if (products instanceof Object) {
                products.forEach(product => {
                    const date = new Date(product.first_added_at);
                    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    html += `<tr
                    class="align-middle text-center clickable-row"
                    data-id-product="${product.id_product}"
                    data-name-product="${product.name}"
                  >
                    <td>
                      <img
                        class="img-thumbnail"
                        width="100"
                        height="100"
                        loading="lazy"
                        src="./assets/image/${product.image_product}"
                        alt="${product.name}"
                      />
                    </td>
                    <td>${product.id_product}</td>
                    <td style="max-width: 100px">${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>Rp ${numberToMoneyFormat(new Number(product.price))}</td>
                    <td>${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${date.getHours(``)}:${date.getSeconds().toString().padEnd(2, "0")}</td>
                  </tr>`
                });
            } else {
                throw "showData has 1 parameter and must be Object";
            }

            tableContentElt.innerHTML = html;

            const clickableRowsElt = document.querySelectorAll(".clickable-row");
            clickableRowsElt.forEach(row => {
                row.addEventListener("contextmenu", e => {
                    e.preventDefault();
                    const nameProduct = row.getAttribute("data-name-product");
                    const idProduct = row.getAttribute("data-id-product");

                    menuElt.style.top = `${e.clientY}px`;
                    menuElt.style.left = `${e.clientX - 145}px`;

                    const nameProductSpan = menuElt.querySelector("#name-product");
                    const actionButtons = menuElt.querySelectorAll("button");

                    actionButtons.forEach(button => {
                        button.setAttribute("data-id-product", idProduct);
                        button.setAttribute("data-name-product", nameProduct);
                    })
                    nameProductSpan.textContent = nameProduct;
                    menuElt.classList.remove("hide");
                });
                menuElt.addEventListener("mouseleave", () => {
                    menuElt.classList.add("hide");
                });
            });
        }

        tableElt.style.display = "";
        loadingElt.style.display = "none";

        showData(products);

        deleteButton.addEventListener("click", async e => {
            e.preventDefault();
            loadingV2Elt.style.top = "5%";
            const idProduct = deleteButton.getAttribute("data-id-product");
            const getProduct = products.find(product => product.id_product === parseInt(idProduct));

            const result = await fetch("/delete-product", {
                method: "POST",
                body: JSON.stringify(getProduct),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(resolve => resolve.json());
            console.log(result);
            if (result.status === "Success") {
                products = products.filter(product => product !== getProduct);
                showData(products);
                Swal.fire({
                    icon: result.status.toLowerCase(),
                    title: result.status,
                    text: result.message,
                });
            } else {
                Swal.fire({
                    icon: result.status.toLowerCase(),
                    title: result.status,
                    text: result.message,
                });
            }

            menuElt.classList.add("hide");
            loadingV2Elt.style.top = "-100%";
        });

        editButton.addEventListener("click", e => {
            e.preventDefault();
            const nameProduct = editButton.getAttribute("data-name-product");
            const idProduct = editButton.getAttribute("data-id-product");
            inputNameProduct.setAttribute("value", nameProduct);
            inputIDProduct.value = idProduct;
        });

        textFieldPriceProduct.addEventListener("keyup", e => {
            const price = moneyFormatToNumber(new String(e.target.value));
            const numberFormatted = numberToMoneyFormat(price);
            textFieldPriceProduct.value = numberFormatted;
        })

        inputEditProductElt.addEventListener("submit", async e => {
            e.preventDefault();

            document.querySelector("#btn-edit-product").classList.add("disabled");
            document.querySelector("#btn-edit-product > .spinner-border").classList.remove("hide");

            const formData = new FormData(inputEditProductElt);
            const idProduct = parseInt(formData.get("id-product"));
            const price = moneyFormatToNumber(new String(formData.get("price-product"))).valueOf();
            if (!price) {
                console.log("Price is null");
                document.querySelector("#error-msg").classList.remove("hide");
                document.querySelector("#btn-edit-product").classList.remove("disabled");
                document.querySelector("#btn-edit-product > .spinner-border").classList.add("hide");
                return;
            }
            document.querySelector("#error-msg").classList.add("hide");

            const data = {
                idProduct,
                price
            }
            const result = await fetch("/edit-product", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(resolve => resolve.json());
            if (result.status === "Success") {
                Swal.fire({
                    icon: result.status.toLowerCase(),
                    title: result.status,
                    text: result.message,
                });
            } else {
                Swal.fire({
                    icon: result.status.toLowerCase(),
                    title: result.status,
                    text: result.message,
                });
            }
            const product = products.find(product => product.id_product === idProduct);
            const productIndex = products.findIndex(product => product.id_product === idProduct);
            products = products.filter(product => product.id_product !== idProduct);
            product.price = price;
            products.splice(productIndex, 0, product);
            inputPriceProduct.value = "";
            showData(products);
            document.querySelector("#btn-edit-product").classList.remove("disabled");
            document.querySelector("#btn-edit-product > .spinner-border").classList.add("hide");
            document.querySelector(".offcanvas-header > .btn-close").click();
        });

        paginationButtons.forEach(btn => {
            btn.addEventListener("click",async e => {
                e.preventDefault();
                const page = btn.textContent;
                const products = await fetch("/get-products", {
                    method: "POST",
                    body: JSON.stringify({
                        page: page,
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(resolve => resolve.json());
                console.log(products);
            })
        });
    });

const hideContextMenu = () => {
    menuElt.classList.add("hide");
}
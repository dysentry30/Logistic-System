const productDiv = document.querySelector(".products");
const form = document.querySelector("form");
const inputIdProduct = document.querySelector("#id-product");
// productDiv.style.display = "none";

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const idProduct = formData.get("id-product");
    const data = {
        idProduct,
    }
    inputIdProduct.value = "";
    const result = await fetch("http://localhost:8080/out", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    }).then(reslove => reslove.json());


    if (result.products) {
        let html = ""
        result.products.forEach(product => {
        const date = new Date(product.first_added_at);
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            html += `
        <div class="product">
        <div class="card">
          <div class="text-center">
            <img src="assets/image/${product.image_product}" width="100" height="100" class="img-fluid rounded" alt="${product.image_product}" />
          </div>
          <div class="card-body">
            <p class="card-text">Name Product: <b>${product.name}</b></p>
            <p class="card-text">Quantity: <b>${product.quantity}</b></p>
            <p class="card-text">First Added: <b>${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${date.getHours(``)}:${date.getSeconds()}</b></p>
          </div>
        </div>
      </div>
        `;
        });
        productDiv.innerHTML = html;
    }

    if (result.status === "Failed") {
      Swal.fire({
        icon: 'error',
        title: result.status,
        text: result.message, 
      });
    } else if(result.action === "Delete Product") {
      Swal.fire({
        icon: 'success',
        title: result.action,
        text: result.message,
      });
    }
})
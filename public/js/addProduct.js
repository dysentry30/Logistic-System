const inputIdProduct = document.querySelector("#id-product");
const btnBack = document.querySelector("#btn-back");
const form = document.querySelector("form");
const loading = document.querySelector("#loading");
const btnAddProduct = document.querySelector("#add-product");
const inputImage = document.querySelector("#image");
const previewImageElt = document.querySelector("#image-preview");
const inputPriceElt = document.querySelector("#price");

const urlString = window.location.href;
const url = new URL(urlString);
const idProduct = url.searchParams.get("idProduct");
const prevURL = url.searchParams.get("url");

if(!idProduct) {
    location.href = "/error?errorID=1";
}

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

inputIdProduct.value = idProduct;
btnBack.href = prevURL;
loading.style.display = "none";

inputImage.addEventListener("change", e => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    previewImageElt.src = url;
});

inputPriceElt.addEventListener("keyup", e => {
    const moneyFormatted = numberToMoneyFormat(new Number(e.target.value.toString().trim().replaceAll(".", "")));
    inputPriceElt.value = moneyFormatted;
});


form.addEventListener("submit", async e => {
    e.preventDefault();
    loading.style.display = "block";
    btnAddProduct.classList.add("disabled");
    const formData = new FormData(form);
    // const idProduct = formData.get("id-product");
    // const nameProduct = formData.get("name-product");
    // const price = formData.get("price");
    formData.set("price", moneyFormatToNumber(new String(formData.get("price"))).valueOf());
    // const imageFile = formData.get("image");
    // const product = {
    //     idProduct,
    //     nameProduct,
    //     price,
    //     imageFile,
    // }

    const result = await fetch("http://localhost:8080/add-product", {
        method: "POST",
        body: formData,
        // headers: {
        //     "Content-Type": "application/json",
        // }
    }).then(resolve => resolve.json());
    if(result.status == "Success") {
        Swal.fire({
            icon: 'success',
            title: result.status,
            text: result.message,
          }).then((result) => {
              if(result.isConfirmed) {
                  location.href = "/";
              }
          })
    }else {
        Swal.fire({
            icon: 'error',
            title: result.status,
            text: result.message,
          });
    }
    loading.style.display = "none";
    btnAddProduct.classList.remove("disabled");
})
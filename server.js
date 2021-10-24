const express = require("express");
const mysql = require("mysql");
const path = require("path");
const multer = require("multer");
const fs = require("fs");


const server = express();
const PORT = 8080
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "logistic_system"
})
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "/public/assets/image"));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});

const upload = multer({
    storage: diskStorage
});

server.use(express.json());
server.use(express.static(`${__dirname}/public`));

let prevProductIn = [];
let prevProductOut = [];

connection.connect((err) => {
    if (err) {
        throw err;
    }
});

server.listen(PORT, () => {
    console.log("Server is running");
});

server.get("/", (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

server.get("/add-product", (req, res) => {
    // const idProduct = req.params.idProduct;
    // if (!idProduct) {
    //     return res.status(404).json({
    //         status: "Error",
    //         message: "Make sure you get the id of the products!"
    //     })
    // }
    res.sendFile(`${__dirname}/public/addProduct.html`);
});

server.get("/error", (req, res) => {
    const errorID = req.query.errorID;
    if(errorID == 1) {
        res.json({
            status: "Error",
            message: "Make sure you get the id product"
        });
    }
})

server.get("/out", (req, res) => {
    res.sendFile(`${__dirname}/public/out.html`);
});

server.get("/products", (req, res) => {
    res.sendFile(`${__dirname}/public/products.html`);
});

server.post("/edit-product", (req, res) => {
    const data = req.body;
    connection.query(`UPDATE products SET price = ${data.price} WHERE id_product = ${data.idProduct}`, (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.json({
                status: "Success",
                message: "This Product has been updated",
            });
        } else {
            res.json({
                status: "Error",
                message: "Product update unsuccessful",
            });
        }
    })
})

server.post("/delete-product", (req, res) => {
    const product = req.body;
    connection.query(`DELETE FROM products WHERE id_product = ${product.id_product}`, (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.json({
                status: "Success",
                message: "This Product has been deleted",
            });
        } else {
            res.json({
                status: "Error",
                message: "Product delete unsuccessful",
            });
        }
    });
});

server.post("/get-products", (req, res) => {
    // if(req.body.page) {
    //     connection.query(`SELECT * FROM products LIMIT ${req.body.page}, 2`, (err, rows, field) => {
    //         if (err) throw err;
    //         res.status(200).json(rows);
    //     });
    // }
    connection.query("SELECT * FROM products", (err, rows, field) => {
        if (err) throw err;
        res.status(200).json(rows);
    });
});

server.post("/out", (req, res) => {
    const idProduct = req.body.idProduct;
    connection.query(`SELECT * FROM products WHERE id_product = ${idProduct}`, (err, rows, fields) => {
        if (err) throw err;
        if (rows[0] != null) {
            let query;
            let quantity = rows[0].quantity;
            if (quantity <= 1) {
                query = `DELETE FROM products WHERE id_product = ${idProduct}`;
                fs.unlinkSync(`${__dirname}/public/assets/image/${rows[0].image_product}`);
            } else {
                query = `UPDATE products SET quantity = ${--rows[0].quantity} WHERE id_product = ${idProduct}`;
            }
            connection.query(query, (err, result) => {
                if (err) throw err;
                if (result.affectedRows >= 1) {

                    if (prevProductOut.length > 7) prevProductOut.pop();
                    if (quantity <= 1) {
                        res.json({
                            status: "Success",
                            action: "Delete Product",
                            message: "This product has been deleted",
                            products: prevProductOut,
                        });
                    } else {
                        prevProductOut.unshift(rows[0]);
                        res.json({
                            status: "Success",
                            message: "Quantity has been decreased",
                            products: prevProductOut,
                        });
                    }
                } else {
                    res.json({
                        status: "Failed",
                        message: "Decrease quantity failed!",
                        products: prevProductOut,
                    });
                }
            });
        } else {
            res.json({
                status: "Failed",
                message: "This product does not exist",
                idProduct: idProduct,
                url: req.url,
            });
        }
    });
});

server.post("/add-product", upload.single("image"), (req, res) => {
    const product = req.body;
    const imageFile = req.file;
    connection.query(`INSERT INTO products(id_product, name, price, image_product) VALUES(${product.id_product}, "${product.name_product}", ${product.price}, "${imageFile.originalname}")`, (err, result) => {
        if (err) throw err;
        if (result.affectedRows >= 1) {
            res.json({
                status: "Success",
                message: "This product has been added",
            })
        } else {
            res.json({
                status: "Failed",
                message: "Failed to add this product, try again!!",
            })
        }
    })
});

server.post("/", (req, res) => {
    const idProduct = req.body.idProduct;
    connection.query(`SELECT * FROM products WHERE id_product = ${idProduct}`, (err, rows, fields) => {
        if (err) throw err;
        if (rows[0] != null) {
            const query = `UPDATE products SET quantity = ${++rows[0].quantity} WHERE id_product = ${idProduct}`;
            connection.query(query, (err, result) => {
                if (err) throw err;
                if (result.affectedRows >= 1) {
                    if (prevProductIn.length > 7) prevProductIn.pop();
                    prevProductIn.unshift(rows[0]);
                    res.json({
                        status: "Success",
                        message: "Quantity has been increased",
                        products: prevProductIn,
                    });
                } else {
                    res.json({
                        status: "Failed",
                        message: "Increase quantity failed!",
                        products: prevProductIn,
                    });
                }
            })
        } else {
            res.json({
                status: null,
                message: "This product does not exist",
                idProduct: idProduct,
                url: req.url,
            })
        }
    })
});

// connection.end();
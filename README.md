# Logistic-System

## Table of Contents 

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Contributing](../CONTRIBUTING.md)

## About <a name = "about"></a>

Logistic System is a simple logistics management system web based for your product. It can be used for cashier, print bills, etc related to my project.     

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

1. Make sure you installed npm in your local machine.

    ```bash
    sudo apt update
    sudo apt install npm
    ```
2. Make sure you installed git in your local machine.

    ```bash
    sudo apt install git
    ```
3. This project uses real product barcode with EAN barcode format, make sure you have a barcode scanner.

### Installing

Just copy the instruction below and you will get a copy of the project. Fill free to add some other features.

```bash
git clone https://github.com/dysentry30/Logistic-System.git
```



## Usage <a name = "usage"></a>
This project have 4 pages:

1. Product In \
This page is used for scan the barcode product in to the system. If the barcode not exist in database then it will redirect to other pages called `add-product`. Otherwise, it will add the product quantity
    ```
    https://yourwebsite.com/
    ```

2. Product Out \
This page is used for scan the barcode product out from database. If the barcode not exist then it will see the error message but if the barcode exist then it will decrease product quantity value until less than 1 it will delete the product related to barcode product.
    ```
    https://yourwebsite.com/out
    ```

3. Show Products \
This page is used for showing all products from database. This page have 2 features:

    1. Delete Product\
    This feature is used for deleting selected product.

    2. Edit Product\
    This feature is used for editing product e.g quantity product.

    ```
    https://yourwebsite.com/products
    ```

4. Add Product \
this page is used for adding product and insert it to database.
    ```
    https://yourwebsite.com/add-product
    ```
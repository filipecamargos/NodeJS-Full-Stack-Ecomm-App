const Product = require("../../model/econ-po04/product");
const User = require("../../model/econ-po04/user");

/************************************************************
 * Handle to display my shopping as the first page 
 * with the products
 * ****************************************/
exports.shop = (req, res, next) => {
    //Find my products
    Product.find()
        //rend the page with the products
        .then(products => {
            res.render('pages/po04/po04', {
                path: 'shop',
                data: products,
                activeTA04: true,
                contentCSS: true,
            });
        })
        .catch(err => {
            console.log(err);
        });
}

/*******************************************
 * Handle to add product to the shop cart
 *******************************************/
exports.addItemToCart = (req, res, next) => {
    const itemId = req.body.id;

    Product.findById(itemId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/');
        });
}

/**********************************************
 * Display the Cart
 *********************************************/
exports.cartDisplay = (req, res, next) => {

    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('pages/po04/cart', {
                path: 'cart',
                items: products
            });
        })
        .catch(err => console.log(err));
};

/******************************************** 
 * Remove item from the cart handler
 * *****************************************/
exports.removeItemFromCart = (req, res, next) => {
    const itemId = req.body.id;
    req.user
        .removeFromCart(itemId)
        .then(result => {
            res.redirect('/cart')
        }).catch(err => console.log(err));

};
/*******************************************
 * Handle to add prodcuts
 * *****************************************/
exports.addProduct = (req, res, next) => {
    res.render('pages/po04/add-products', {
        path: 'add-product',
        contentCSS: true,

    });
};

/***************************************************
 * handle the adding products post method to add it
 * *************************************************/
exports.postProduct = (req, res, next) => {
    //Store the values posted
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    //creat a new object to store them
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
    });

    //save it and redirect to the prodcut page
    product
        .save()
        .then(result => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
};

/***************************************************
 * Handle the admin editing or deleting Product
 * *************************************************/
exports.editingProduct = (req, res, next) => {
    //Find my products
    Product.find()
        //rend the page with the products
        .then(products => {
            res.render('pages/po04/edit-products', {
                path: 'edit-products',
                data: products,
                activeTA04: true,
                contentCSS: true,
            });
        })
        .catch(err => {
            console.log(err);
        });

};

/*****************************************
 * Handle the Edition of the Item
 *****************************************/
exports.editItem = (req, res, next) => {
    //Get the corrent Info of the product
    const currentID = req.body.id;
    Product.findById(currentID).then(item => {
        //rend the page where the element can be editted
        res.render('pages/po04/edit-item', {
            path: 'edit-item',
            data: item,
            activeTA04: true,
            contentCSS: true,
        })
    }).catch(err => {
        console.log(err);
    });
};

//Update the item in the database
exports.updatedItem = (req, res, next) => {
    const itemId = req.body.id;

    Product.findById(itemId)
        .then(item => {
            item.title = req.body.title;
            item.price = req.body.price;
            item.description = req.body.description;
            item.imageUrl = req.body.imageUrl;
            return item.save();
        }).then(() => {
            res.redirect("/edit-products")
        })

};

/*****************************************
 * Handle the item deletion
 *****************************************/
exports.deleteItem = (req, res, next) => {
    //Get the items Id
    const itemId = req.body.id;

    //Remove the Item and redirect
    Product.findByIdAndRemove(itemId)
        .then(() => {
            res.redirect('/edit-products');
        }).catch(err => console.log(err))
};
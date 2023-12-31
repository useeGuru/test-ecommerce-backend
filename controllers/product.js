const Product = require('../models/Product');


module.exports.addProduct = async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: 'Product is added successfully.',
      product: savedProduct
    });
  } catch (err) {
    res.status(500).send(err);
  }
};


module.exports.getProduct = async (req, res) => {
  try {
    console.log('product_id', req.params.id);
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.getProducts = async (req, res) => {
  const newQuery = req.query.new;
  const categoryQuery = req.query.category;
  try {
    let products;
    if (newQuery) {
      products = await Product.find({}, { image: 1 }).sort({ createdAt: -1 }).limit(8);
    } else if (categoryQuery) {
      products = await Product.find({
        category: categoryQuery
      }, { image: 1 });
    } else {
      products = await Product.find({}, { image: 1 });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
};
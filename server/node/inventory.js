/**
 * inventory.js
 * Stripe Payments Demo. Created by Romain Huet (@romainhuet).
 *
 * Simple library to store and interact with orders and products.
 * These methods are using the Stripe Orders API, but we tried to abstract them
 * from the main code if you'd like to use your own order management system instead.
 */

'use strict';

const config = require('./config');
const stripe = require('stripe')(config.stripe.secretKey);
stripe.setApiVersion(config.stripe.apiVersion);

// Create an order.
const createOrder = async (currency, items, email, shipping, userId) => {
  // const userId = 'haysstanfordUserID'

  return await stripe.orders.create({
    currency,
    items,
    email,
    shipping,
    metadata: {
      status: 'created',
      userId: userId,
    },
  });
};

// Retrieve an order by ID.
const retrieveOrder = async orderId => {
  return await stripe.orders.retrieve(orderId);
};

// Update an order.
const updateOrder = async (orderId, properties) => {
  return await stripe.orders.update(orderId, properties);
};

// List all products.
const listProducts = async () => {
  const productData = await stripe.products.list({limit: 3, type: 'good'});
  const products = Object.entries(productData.data)
  const activeProducts = []

  for(let [index, product] of products) {
    if(product.active)
      activeProducts.push(product)
  }

  // console.log('ACTIVE PRODUCTS: ', activeProducts)
  return activeProducts
};

// Retrieve a product by ID.
const retrieveProduct = async productId => {
  return await stripe.products.retrieve(productId);
};

// Validate that products exist.
const productsExist = productList => {
  const validProducts = ['clone-insta-course', 'increment', 'shirt', 'pins'];
  return productList.reduce((accumulator, currentValue) => {
    return (
      accumulator &&
      productList.length === 1 &&
      validProducts.includes(currentValue.id)
    );
  }, !!productList.length);
};

exports.orders = {
  create: createOrder,
  retrieve: retrieveOrder,
  update: updateOrder,
};

exports.products = {
  list: listProducts,
  retrieve: retrieveProduct,
  exist: productsExist,
};

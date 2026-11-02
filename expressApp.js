import express from "express";

const app = express();

app.use(express.json());

// SHOPPING CART ARRAY
let cart = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
    category: "Electronics",
  },
  {
    id: 2,
    productName: "Keyboard",
    price: 1200,
    quantity: 1,
    category: "Electronics",
  },
  {
    id: 3,
    productName: "Water Bottle",
    price: 300,
    quantity: 2,
    category: "Accessories",
  },
];

// GET ALL PRODUCTS
app.get("/cart", (req, res) => {
  res.status(200).json({
    count: cart.length,
    products: cart,
  });
});

// GET PRODUCT BY ID
app.get("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  const product = cart.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json({
    product: product,
    totalPrice: product.price * product.quantity,
  });
});

// ADD NEW PRODUCT
app.post("/cart", (req, res) => {
  const { id, productName, price, quantity, category } = req.body;

  if (
    id === undefined ||
    !productName ||
    price === undefined ||
    quantity === undefined ||
    !Number.isFinite(Number(price)) ||
    !Number.isFinite(Number(quantity)) ||
    Number(price) < 0 ||
    Number(quantity) < 0 ||
    cart.some((item) => item.id === Number(id))
  ) {
    return res.status(400).json({
      message: "Invalid product details or duplicate ID",
    });
  }

  const newProduct = {
    id: Number(id),
    productName,
    price: Number(price),
    quantity: Number(quantity),
    category,
  };

  cart.push(newProduct);

  res.status(201).json({
    message: "Product added successfully",
    product: newProduct,
  });
});

// UPDATE PRODUCT
app.put("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  const product = cart.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const { productName, price, quantity, category } = req.body;

  if (
    !productName ||
    price === undefined ||
    quantity === undefined ||
    !Number.isFinite(Number(price)) ||
    !Number.isFinite(Number(quantity)) ||
    Number(price) < 0 ||
    Number(quantity) < 0
  ) {
    return res.status(400).json({
      message: "Invalid product details",
    });
  }

  product.productName = productName;
  product.price = Number(price);
  product.quantity = Number(quantity);
  product.category = category;

  res.status(200).json({
    message: "Product updated successfully",
    product: product,
  });
});

// DELETE PRODUCT
app.delete("/cart/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = cart.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const deletedProduct = cart.splice(index, 1);

  res.status(200).json({
    message: "Product deleted successfully",
    product: deletedProduct[0],
  });
});

// INVALID ROUTE
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// START SERVER
app.listen(4000, () => {
  console.log("Express Server running at http://localhost:4000");
});


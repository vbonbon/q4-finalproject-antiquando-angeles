const express = require('express');
const fs = require('fs');
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up view engine and views directory
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Static files and middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(session({
  secret: 'fluffandstuff_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // For production, set secure: true with HTTPS
}));

// Products
const products = [
  { productId: "1", productName: "Crochet Mochi Bunny", price: 70 },
  { productId: "2", productName: "Crochet Mochi Cat Keychain", price: 70 },
  { productId: "3", productName: "Crochet Cute Square Pouch", price: 120 },
  { productId: "4", productName: "Crochet Pencil Case/Makeup Pouch", price: 150 },
  { productId: "5", productName: "Crochet Tulip Flower (1)", price: 55 },
  { productId: "6", productName: "Crochet Tulip Flower Bouquet (5)", price: 250 },
  { productId: "7", productName: "Crochet Rose Flower (1)", price: 80 },
  { productId: "8", productName: "Crochet Rose Flower Bouquet (5)", price: 400 }
];

// Handlebars helper
hbs.registerHelper('multiply', function (value1, value2) {
  return value1 * value2;
});

// Routes
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

// Register
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const { username, password, email, name } = req.body;
  const dataPath = path.join(__dirname, 'data', 'users.json');
  let users = [];

  if (fs.existsSync(dataPath)) {
    users = JSON.parse(fs.readFileSync(dataPath));
  }

  if (users.find(u => u.username === username)) {
    return res.send("Username already exists.");
  }

  users.push({ username, password, email, name });
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
  res.redirect('/login');
});

// Login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const dataPath = path.join(__dirname, 'data', 'users.json');
  const users = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath)) : [];

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.send("Invalid credentials.");

  req.session.user = user;
  req.session.cart = req.session.cart || [];
  res.redirect('/marketplace');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Marketplace
app.get('/marketplace', (req, res) => {
  const cart = req.session.cart || [];
  res.render('marketplace', { products, cart, user: req.session.user });
});

// Add to cart
app.post('/add-to-cart', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const { productId, quantity } = req.body;
  const selectedProduct = products.find(p => p.productId === productId);
  if (!selectedProduct) return res.status(404).send("Product not found.");

  req.session.cart = req.session.cart || [];
  const cart = req.session.cart;

  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += parseInt(quantity);
  } else {
    cart.push({
      productId,
      productName: selectedProduct.productName,
      price: selectedProduct.price,
      quantity: parseInt(quantity)
    });
  }

  res.redirect('/marketplace');
});

// Shopping Cart
app.get('/shoppingcart', (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render('shoppingcart', { cart, total, user: req.session.user });
});

// Remove from cart
app.post('/remove-from-cart', (req, res) => {
  const { productId } = req.body;
  req.session.cart = (req.session.cart && req.session.cart.filter(item => item.productId !== productId)) || [];
  res.redirect('/shoppingcart');
});

// Update quantity
app.post('/update-quantity', (req, res) => {
  const { productId, quantity } = req.body;
  const cart = req.session.cart || [];

  const item = cart.find(p => p.productId === productId);
  if (item) {
    item.quantity = parseInt(quantity);
  }

  res.redirect('/shoppingcart');
});

// Checkout
app.get('/checkout', (req, res) => {
  const cart = req.session.cart || [];
  if (cart.length === 0) {
    return res.render('shoppingcart', { message: "Your cart is empty.", cart });
  }

  res.render('checkout', { cart });
});

// API endpoints
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/cart', (req, res) => {
  res.json(req.session.cart || []);
});

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


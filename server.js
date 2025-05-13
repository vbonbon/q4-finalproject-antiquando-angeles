// LATEST VER PLSPLSPSL DONT TOUCH OMGGGG (4) — OPTIMIZED & FIXED W/ .data
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

// Paths for data files
const dataDir = path.join(__dirname, '.data');
const userFilePath = path.join(dataDir, 'user.json');
const cartFilePath = path.join(dataDir, 'cart.json');

// Ensure .data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Ensure user.json exists
if (!fs.existsSync(userFilePath)) {
  fs.writeFileSync(userFilePath, '[]', 'utf-8');
}

// View engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Trust proxy for Glitch
app.set('trust proxy', 1);

// Session setup
app.use(session({
  secret: 'fluffandstuff_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 3600000
  }
}));

// Products list
const products = [
  {
    productId: "1",
    productName: "Crochet Mochi Bunny",
    price: 70,
    image: "/images/bunny.jpg",
    description: "A squishy mochi-style bunny friend, soft and huggable!",
    options: ["Cream", "Sakura", "Matcha"]
  },
  {
    productId: "2",
    productName: "Crochet Mochi Cat Keychain",
    price: 70,
    image: "/images/catkeychain.jpg",
    description: "A tiny meow buddy you can carry wherever you go!",
    options: ["Orange Tabby", "Siamese", "Calico", "Orange and White Tabby"]
  },
  {
    productId: "3",
    productName: "Crochet Cute Square Pouch",
    price: 120,
    image: "/images/squarepouch.jpg",
    description: "A soft and cozy pouch (4.5 x 4.5 inches) to keep your tiny treasures!",
    allowComments: true
  },
  {
    productId: "4",
    productName: "Crochet Pencil Case/Makeup Pouch",
    price: 150,
    image: "/images/pencilcase.jpg",
    description: "Perfect for pens or pretties, and themed with love!",
    options: ["Lover", "Folklore"]
  },
  {
    productId: "5",
    productName: "Crochet Tulip Flower (1)",
    price: 55,
    image: "/images/tulip.jpg",
    description: "A single sweet tulip bloom, lovingly handmade!",
    allowComments: true
  },
  {
    productId: "7",
    productName: "Crochet Rose Flower (1)",
    price: 100,
    image: "/images/rose.jpg",
    description: "A beautiful crochet rose you can personalize up to 3 colors!",
    allowComments: true
  }
];

// Handlebars helper
hbs.registerHelper('multiply', (v1, v2) => v1 * v2);

// Helper to read users
function readUsers() {
  try {
    const data = fs.readFileSync(userFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read user.json:', err);
    return [];
  }
}

// ROUTES

app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/home');
  res.redirect('/registration');
});

// Registration
app.get('/registration', (req, res) => {
  res.render('registration');
});

app.post('/registration', async (req, res) => {
  const { username, password, name, email } = req.body;
  const users = readUsers();

  if (users.find(u => u.username === username)) {
    return res.render('registration', { error: 'Username already taken' });
  }

  if (users.find(u => u.email === email)) {
    return res.render('registration', { error: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPassword, name, email };
  users.push(newUser);

  try {
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Failed to write user.json:', err);
    return res.status(500).send('Error saving user.');
  }

  req.session.user = newUser;
  req.session.cart = [];
  req.session.checkoutInfo = {};
  res.redirect('/home');
});

// Login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.email === email);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    req.session.cart = req.session.cart || [];
    req.session.checkoutInfo = req.session.checkoutInfo || {};
    return res.redirect('/home');
  }

  res.render('login', { error: 'Invalid email or password' });
});

// Home
app.get("/home", (req, res) => {
  const user = req.session.user;
  console.log("User at /home:", user);
  if (!user) return res.redirect("/login");
  res.render("home", { username: user.username });
});

// Marketplace
app.get('/marketplace', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const cart = req.session.cart || [];
  res.render('marketplace', { products, cart });
});

// Cart
app.get('/shoppingcart', (req, res) => {
  const cart = req.session.cart || [];
  const isCartEmpty = cart.length === 0

  const cartWithTotal = cart.map(item => ({
    ...item,
    subtotal: item.price * item.quantity
  }));

  const total = cartWithTotal.reduce((acc, item) => acc + item.subtotal, 0);

  res.render('shoppingcart', { cart: cartWithTotal, total });
});

app.post('/add-to-cart', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const { productId, variant, comment, quantity } = req.body;
  const selectedProduct = products.find(p => p.productId === productId);
  if (!selectedProduct) return res.status(404).send("Oh no! Product not found.");

  req.session.cart = req.session.cart || [];
  const cart = req.session.cart || [];

  const existing = cart.find(item => item.productId === productId);

  if (existing) {
  existing.quantity += parseInt(quantity);
  existing.variant = variant || existing.variant;
  existing.comment = comment || existing.comment;
} else {
  cart.push({
    productId,
    productName: selectedProduct.productName,
    price: selectedProduct.price,
    quantity: parseInt(quantity),
    variant: variant || '',
    comment: comment || ''
  });
}

  
  //Save to file
  fs.writeFileSync(cartFilePath, JSON.stringify(cart, null, 2), 'utf-8');

  console.log('COMMENT RECEIVED:', comment);

  res.redirect('/marketplace');
});

app.post("/update-quantity", (req, res) => {
    const { productId, quantity } = req.body;
    const cartPath = path.join(__dirname, '.data', 'cart.json'); // Ensure correct path

    try {
        const cartData = fs.readFileSync(cartPath, "utf-8");
        let cart = JSON.parse(cartData);

        // Find the item by productId and update the quantity
        const item = cart.find(item => item.productId === productId);
        if (item) {
            item.quantity = quantity;
        }

        fs.writeFileSync(cartPath, JSON.stringify(cart, null, 2));
        res.sendStatus(200);
    } catch (err) {
        console.error("Error updating cart:", err);
        res.status(500).send("Internal server error");
    }
});

app.post("/remove-from-cart", (req, res) => {
    const { productId } = req.body;
    const cartPath = path.join(__dirname, ".data", "cart.json");

    try {
        const cartData = fs.readFileSync(cartPath, "utf-8");
        let cart = JSON.parse(cartData);

        // Remove the item
        cart = cart.filter(item => item.productId !== productId);

        // Save updated cart
        fs.writeFileSync(cartPath, JSON.stringify(cart, null, 2));
      
        if (cart.legnth === 0) {
          delete req.session.cart;
        } else {
          req.session.cart = cart;
        }
      
        res.sendStatus(200);
      
    } catch (err) {
        console.error("Error updating cart:", err);
        res.status(500).send("Internal server error");
    }
});


app.get('/views/shoppingcart', (req, res) => {
  res.json(req.session.cart || []);
});

// Checkout
app.get('/checkout', (req, res) => {
  const cart = req.session.cart || [];
  

  if (cart.length === 0) {
    return res.send('<script>alert("Your cart is empty!"); window.location.href="/shoppingcart";</script>'); 
  }

  const cartWithTotal = cart.map(item => ({
    ...item,
    subtotal: item.price * item.quantity
  }));

  const total = cartWithTotal.reduce((acc, item) => acc + item.subtotal, 0);
  const checkoutInfo = req.session.checkoutInfo || null;

  res.render('checkout', { cart: cartWithTotal, total, checkoutInfo });
});


// Checkout - POST
app.post('/checkout', (req, res) => {
  const { name, address, paymentMethod } = req.body;

  // Save checkout info
  req.session.checkoutInfo = { name, address, paymentMethod };

  // Clear the cart
  req.session.cart = [];
  fs.writeFileSync(cartFilePath, JSON.stringify([], null, 2), 'utf-8');

  res.render('checkout', {
    cart: [],
    total: 0,
    checkoutInfo: req.session.checkoutInfo,
    orderPlaced: true,
    isCartEmpty: true
  });
});


app.post('/checkout', (req, res) => {
  const { name, address, paymentMethod } = req.body;
  
  // saves checkout info
  req.session.checkoutInfo = { name, address, paymentMethod };
  
  // clears the server-side cart
  req.session.cart = [];
  fs.writeFileSync(cartFilePath, JSON.stringify([], null, 2), 'utf-8');
  
  res.render('checkout', {
    cart: [],
    total: 0,
    checkoutInfo: req.session.checkoutInfo,
    orderPlaced: true // to toggle the thank-you message
  });
});

app.get('/confirmation', (req, res) => {
  const cart = req.session.cart || [];
  const checkoutInfo = req.session.checkoutInfo || {};
  res.render('confirmation', { checkoutInfo });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

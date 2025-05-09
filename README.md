## Project Update: Fluff & Stuff
**Summary of Updates**

  We plan to add a user login system to the Fluff & Stuff website to make shopping easier and more convenient. With this feature, users can log in to access their shopping cart, and the website will remember their cart even if they leave and come back later. Users can also enter their shipping details, such as their name, address, and preferred payment method, which will stay saved unless they decide to change it. This way, they won't have to re-enter the details every time they check out.

  The login system will prompt users to create an account or log in before adding products to their cart. This makes the experience more personal and organized. Additionally, users will have the option to view and manage their account details.  If users aren't logged in and try to add an item, an error message will ask them to log in first.

  To support these updates, we will add login and registration pages. The marketplace page will also be updated to check if users are logged in before allowing them to add items to their cart. Error messages will display if users attempt to add items without logging in, guiding them to the login page.

**Required Types of Data and Their Purpose**

1. User Account Data - to authenticate users and provide a personalized experience.

Structure:
{
  "username": "text-string",
  "password": "text-string",
  "email": "email-formatted-text-string",
  "name": "text-string",
  "profilePicture": "text-link-to-the-uploaded-img"
}

2. Shopping Cart Data - to store the products added to the user's cart 

Structure:
{
  "userId": "unique-user-id",
  "cart": [
    {
      "productId": "unique-product-id",
      "productName": "text-string",
      "price": "float",
      "quantity": "integer"
    }
  ]
}

3. Shipping Information Data - to store user shipping details to make the checkout process faster.

Structure:
{
  "userId": "unique-user-id",
  "name": "text-string",
  "address": "text-string",
  "paymentMethod": "text-string"
}


**Planned Web Page Updates**
1. Login and Registration Page
   - Users will be able to create an account or log in using their username and password.

2. Marketplace Page
   - Users will need to log in to add items to their cart.
   - Cart data will be saved on the server, and a message will prompt users to log in if they aren't already.


3. Checkout Page
   - Users can confirm their shipping information and complete their purchase.



## Title:

 Fluff & Stuff

**Description:**

  This website shall be used to teach individuals how to create their own stuffed toys through crocheting, as well as a marketplace for customers who wish to purchase premade crocheted stuffed toys. Our goal for this website is to not only share our knowledge of crocheting, but also to give our customers an easier and quicker experience in making/buying their favorite stuffed toy. We hope that those who view our site will achieve a higher appreciation for the art of creating and collecting stuffed figures.

Outline:

Homepage - This is the page that the viewers will first see. This page will provide an introduction to our website and links to the different parts/pages of our site. The components of this page will be the following: 

1. Navigation menu
    -Links to the other pages of our website
2. About Section
3. Contacts

Marketplace - This is the page where we sell premade crocheted stuff toys. Our items and their respective prices will be displayed here. The customers will be able to edit their cart in this page. This will contain the following components: 

1. Product listings (Name & Price)
2. Add to cart function 

Tutorials or Crocheting Guides - This is the page where viewers will be able to watch video tutorials on how to crochet stuff toys. Needed materials and procedures will be posted on this page. This page will contain the following components: 

1. Product names
2. Materials needed
3. Step-by-step instructions

Incorporation of JavaScript:

  JavaScript will be used to create an interactive shopping cart feature, which dynamically updates the cart as users add or remove items, as well as show the total cost. It will also improve navigation by enabling smooth transitions between the Home, Marketplace, and Contact pages, along with dropdown menus. This ensures that users will be able to have a seamless experience as they navigate between the main pages of the website.

Wireframes:

(See attached file for the wireframe)


#### Deployed at : https://hacktivgun.fildabert.com

## Getting Started
Please follow this through before you start and use the server.
1. Run this script in the terminal to install all dependencies
```
npm install
```
2. Create .env file. You could copy paste value in .env, from .env-template.
- SECRET is used to generate jwt tokens
- CLIENT_ID is used for google OAuth signin
- CLOUD_BUCKET your bucket name in GCS (google cloud service)
- GCLOUD_PROJECT your project name in GCS (google cloud service)
- KEYFILE_PATH your credential path file, get it from GCS (google cloud service)

3. Run this in your terminal to start the server
```
npm start
```

# Route
## User
### Register Customer
Register new customer as default login path, not using third party oAuth.
URL : /users/register
Method : Post
Request Header : NONE
Request Body : 
```
{
  username: filbert,
  password; filbert,
  email: filbert@mail.com,
}
```
Success Status Code : 201
Success Response : No Response
Error Status Code : 400, 500
Error Response :
```
{
  message: 'User validation failed: username: filbert is already in our database. Please use other username. email: filbert@mail.com is already in our database. Please use other email'
}
```
### Login Customer
Login for both default login or oAuth google login. The difference is in the request body.
URL : /users/login
Method : Post
Request Header : NONE
Request Body : 
```
{
  user:filbert,
  password; filbert,
  login_type: 'default'
}
```
Success Status Code : 200
Success Response : 
```
{ 
  token: 'jsfiowjoefi29sd9d8fsa0aef890ewf8s9a',
}
```
### Logout Customer
Logout for both default login user and google login user
URL : /users/register
Method : Post
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Body : NONE
Success Status Code : 201
Success Response : 
```
{
  message: 'Successfully log out'
}
```
Error Status Code : 400, 500
Error Response :
```
{
  message: 'Internal Server Error'
}
```

##Product
### Get All Products
Get all listed product that has been inputed by admin of the website
URL : /products/all
Method : GET 
Request Body : NONE
Success Status Code : 200
Success Response : 
```
[
    {
        "_id": "5d17b95edbb0cc1558bc564a",
        "title": "AK-47",
        "description": "AK-47 Description",
        "stock": 10,
        "image": "https://storage.googleapis.com/imagelink",
        "price": 3300,
        "type": "Assault Rifle"
    },
    {...}
]
```
Error Status Code : 400, 500
Error Response :
```
{
  message: 'Internal Server Error'
}
```



### Create Product
Create one new product to be listed on the website. This routing could be accessed only by admin user.
URL : /products/add
Method : POST
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Body :
- title cannot be empty
- description cannot be empty
- image should be file
- stock must be above 0
- price must be above 0
- type cannot be empty
```
{
  name: name of the product
  description: description of the product,
  stock: 10,
  image: file,
  price: 2000
  type: product type
}
```
Success Status Code : 200
Success Response : 
```
{
  "_id": "5d17b95edbb0cc1558bc564a",
  "name": "AK 47",
  "description": "AK 47 description",
  "stock": 0,
  "image": "https://storage.googleapis.com/",
  "price": 250000,
  "type" : "Assault Rifle"
}
```
Error Status Code : 400, 500
Stock should be above 
Error Response :
```
{
  message: 'Internal Server Error'
}
```

### Update Product
Update one existing product data, photo, and stock. This routing could be accessed only by admin user.
URL : /products/edit
Method : PUT
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Body :
- title cannot be empty
- description cannot be empty
- image should be file
- stock must be above 0
- price must be above 0
- type cannot be empty
```
{
  name: name of the product
  description: description of the product,
  stock: 10,
  image: file,
  price: 2000
  type: product type
}
```
Success Status Code : 200
Success Response : 
```
{
  "_id": "5d17b95edbb0cc1558bc564a",
  "name": "AK 47",
  "description": "AK 47 description",
  "stock": 0,
  "image": "https://storage.googleapis.com/",
  "price": 250000,
  "type" : "Assault Rifle"
}
```
Error Status Code : 400, 500 
Error Response :
```
{
  message: 'Internal Server Error'
}
```

### Delete Product
Deleting one product. This routing could be accessed only by admin user.
URL : /products/delete
Method : DELETE
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Body : NONE
Success Status Code : 200
```
{
  message: 'successfully delete product'
}
```
Error Status Code : 400, 500 
Error Response :
```
{
  message: 'Internal Server Error'
}
```

## Cart
### Create or Add Product to Cart
Adding an item into the cart.
URL : /cart/add
Method : POST
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Body :
```
{
  userId: '231283920',
  product: '51981389312',
  quantity: 2,
  status: false,
  checkoutDate: null
}
```
Success Status Code : 200
Success Response : 
```
{
  userId: '231283920',
  product: '51981389312',
  quantity: 2,
  status: false,
  checkoutDate: null
}

```
Error Status Code : 400, 500 
Error Response :
```
{
  message: 'Internal Server Error'
}
```

### Transaction History
Get history of transaction by one user
URL : /cart/transactions
Method : GET
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Params : ?id=userId
Success Status Code : 200
Success Response : 
```
[
  {
  userId: '231283920',
  product: '51981389312',
  quantity: 2,
  status: false,
  checkoutDate: null
}
  {...}
]
```
Error Status Code : 400, 500 
Error Response :
```
{
  message: 'Internal Server Error'
}
```


### Update quantity in cart
Update quantity of the product in the cart by customer.
URL : /cart/updatequantity
Method : PUT
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request body :
```
{
  _id: '1276387129831',
  quantity: 2
}
```
Success Status Code : 200
Success Response : 
```
={
    "message": "item updated"
}
```
Error Status Code : 400, 500 
Error Response :
```
{
  message: 'Internal Server Error'
}
```

### Delete one product in cart
Delete the product in the cart by customer.
URL : /transactions/?id=
Method : DELETE
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request body:
- NONE
```
NONE
```
Success Status Code : 200
Success Response : 
```
{
  message: 'successfully delete transaction'
}
```
Error Status Code : 400, 500 
Error Response :
```
{
  message: 'Internal Server Error'
}
```

### Checkout the cart
Checkout the cart by customer.
URL : /cart/updatestatus
Method : POST
Request Header : 
```
{
  token: 'sd9f90a8f9e0fda0dfas0d9f8eew0f98sd90fa09f'
}
```
Request Body : 
{
    userId: '124353645234123',
    checkoutDate: 'new date()'
}
Success Status Code : 200
Success Response : 
```
{ 
  message: "cart updated"
}
```
Error Status Code : 400, 500 
Error Response :
```
{
  message: 'Internal Server Error'
}
```

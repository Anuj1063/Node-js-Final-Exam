
# Assignment of 25-04-2025

1. Create a MongoDB database with following collections:


 a. Users 

 b. Products

 c. Categories


2. Create following APls: 


 a. User signup with email account verification


 b. User login 

 c. Get user profile 

 d. Edit user profile (with profile picture) 

 e. Add categories with category name 

 f. Add product with product name, product price and category and stock 

 g. List of categories with total number of products and list of products for that category 

 h. List of products 

 i. Edit product information 

 j. Delete product information 


 k. List of products whose stock is less than 100

 L. Send all product lists to user email in table format.
  
 
 Note: Use a MongoDB aggregation query with the pipeline feature. Don't use any populate or any raw JS query for fetching data from MongoDB


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

PORT=1600

MONGO_URI="mongodb+srv://solanki11063:3aSZCfbU4HX3r0oz@anujcluster.zc1yg.mongodb.net/Assignment_25-04-2025"

JWT_SECRET="X7k9#Lz@W2"


EMAIL_PASS=eapa lvzs iiog eoaa

EMAIL_USER=ajyadav107@gmail.com

EMAIL_HOST='smtp.gmail.com'

EMAIL_PORT=587


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```


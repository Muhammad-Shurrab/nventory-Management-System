const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig.development);
// const pool = require("./db");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Home");
});

// //Get All the Data from the Database @Tested

// //Get All the Data from the Database @Tested

//Post A Todo
// app.post("/products/add", async (req, res) => {
//   const { name, description, categories, price } = req.body;
//   const products = await pool
//     .query(
//       "INSERT INTO products (name, description,categories,price) VALUES ($1, $2, $3, $4) RETURNING *", //RETURNING * is used to return the inserted row
//       [name, description, categories, price]
//     )
//     .then((results) => {
//       return results.rows;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   res.status(201).send(`products Added Successfully`);
//   res.end();
// });

//Get Products

app.get("/products", async (req, res) => {
  try {
    const products = await knex("products")
      .select("*")
      // filter for showing only not deleted
      .where({ isDeleted: false })
      .orderBy("id", "asc");
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while fetching the products");
  }
});

// Add Products

app.post("/products/add", async (req, res) => {
  const { name, description, categories, price } = req.body;

  try {
    const products = await knex("products")
      .insert({
        name: name,
        description: description,
        categories: categories,
        price: price,
      })
      .returning("*"); // Use .returning('*') to return the inserted row(s)

    res.status(201).json({
      message: "Product Added Successfully",
      product: products[0], // Assuming you're inserting a single product
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while adding the product");
  }
});

//Post A Todo @Tested

// Update Product

app.patch("/products/:id", async (req, res) => {
  const id = req.params.id;
  const { name, description, categories, price } = req.body;

  try {
    const products = await knex("products")
      .where({ id: id })
      .update({
        name: name,
        description: description,
        categories: categories,
        price: price,
      })
      .returning("*"); // Return the updated row(s)

    console.log("After Updating the Product the result is:", products);

    res.status(200).send(`The product updated successfully with ID=${id}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while updating the product");
  }
});
// app.delete("/products/:id", async (req, res) => {
app.delete("/products/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await knex("products").where({ id: id }).update({
      isDeleted: true, // Set isDeleted to true to mark the record as deleted
    });

    if (result) {
      res.status(200).send(`Product with ID=${id} marked as deleted.`);
    } else {
      res.status(404).send(`Product with ID=${id} not found.`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while deleting the product.");
  }
});

// Products Routes

app.use("/products", require("./routes/products"));

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Your server Running At ${PORT}`);
});

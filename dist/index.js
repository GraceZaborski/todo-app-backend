const express = require("express");
const app = express();
const cors = require("cors");
const client = require("./db");

//middleware
app.use(cors());
app.use(express.json()); //gives us access to our body on the client-side (request.body object)

//ROUTES

//create a todo
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await client.query("INSERT INTO perntodo (description) VALUES($1) RETURNING *", [description]);
        res.json(newTodo.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//get all todos

app.get("/todos", async (req, res) => {
    try {
        const allTodos = await client.query("SELECT * from perntodo")
        res.json(allTodos.rows)
    } catch (error) {
        console.error(error.message)
    }
})

//get a todo

app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const getTodo = await client.query("SELECT * from perntodo where todo_id =$1", [id]);
        res.json(getTodo.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

//update a todo

app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updatedTodo = await client.query("UPDATE perntodo SET description=$1 where todo_id=$2 RETURNING *", [description, id]);
        res.json("To do was updated with " + updatedTodo.rows[0].description)
    } catch (error) {
        console.error(error.message)
    }
})

//delete a todo

app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTodo = await client.query("DELETE FROM perntodo WHERE todo_id = $1 RETURNING *", [id]);
        res.json("This todo was deleted: " + deletedTodo.rows[0].description);
    } catch (error) {
        console.error(error.message);
    }
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log("server started on port 5000");
})
import express from "express";
import { MongoClient } from "mongodb";
import path from "path";

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.resolve()));
app.use(express.urlencoded({ extended: false }));

const dbName = "Todo-list-nodejs";
const dbCollection = "todos";
const dbUrl = "mongodb://localhost:27017";

const client = new MongoClient(dbUrl);

const connection = async () => {
	const connect = await client.connect();
	return await connect.db(dbName);
};

app.get("/", async (req, resp) => {
	const db = await connection();
	const collection = db.collection(dbCollection);
	const todoData = await collection.find().toArray();
	resp.render("list", { todoData });
});

app.get("/add", (req, resp) => {
	resp.render("add");
});

app.get("/update", (req, resp) => {
	resp.render("update");
});

app.post("/update", (req, resp) => {
	resp.redirect("/");
});

app.post("/add", async (req, resp) => {
	const db = await connection();
	const collection = db.collection(dbCollection);
	const result = collection.insertOne(req.body);

	if (result) {
		resp.redirect("/");
	} else {
		resp.redirect("/add");
	}
});

app.listen(3100);

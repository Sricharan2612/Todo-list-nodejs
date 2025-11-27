import express from "express";
import { MongoClient, ObjectId } from "mongodb";
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

app.get("/update/:id", async (req, resp) => {
	const db = await connection();
	const collection = db.collection(dbCollection);
	const result = await collection.findOne({ _id: new ObjectId(req.params.id) });
	console.log(result);
	resp.render("update", { todo: result });
});

app.post("/update/:id", async (req, resp) => {
	const db = await connection();
	const collection = db.collection(dbCollection);
	const filter = { _id: new ObjectId(req.params.id) };
	const result = await collection.updateOne(filter, { $set: req.body });
	if (result) {
		resp.redirect("/");
	} else {
		resp.send("error");
	}
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
app.get("/delete/:id", async (req, resp) => {
	const db = await connection();
	const collection = db.collection(dbCollection);
	const result = collection.deleteOne({ _id: new ObjectId(req.params.id) });

	if (result) {
		resp.redirect("/");
	} else {
		resp.send("error");
	}
});

app.listen(3100);

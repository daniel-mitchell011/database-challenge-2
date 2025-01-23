// Must supply username and password at <username> and <db_password>, respectively.
uri =
  "mongodb+srv://<username>:<db_password>@cluster0.ftuzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);
client.connect();
const myDB = client.db("BookStore");
const books_collection = myDB.collection("books");

const pipeline = [
  { $group: { _id: "$genre", totalBooks: { $sum: "$quantity" } } },
];

const connectToDatabase = async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
  }
};

const main = async () => {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
  } finally {
    await client.close();
  }
};

main();

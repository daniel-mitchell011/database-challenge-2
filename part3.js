const { MongoClient } = require("mongodb");

// Must supply username and password at <username> and <db_password>, respectively.
uri =
  "mongodb+srv://<username>:<db_password>@cluster0.ftuzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);
client.connect();
const myDB = client.db("BookStoreEmbedded");
const books_collection = myDB.collection("books");
const authors_collection = myDB.collection("authors");

// This pipeline works as intended, books are grouped by genre
// and total books in each genre are counted.
const pipeline1 = [{ $group: { _id: "$genre", totalBooks: { $sum: 1 } } }];

const pipeline2 = [
  { $unwind: { path: "$book_reviews" } },
  {
    $group: {
      _id: "$title",
      total: { $avg: "$book_reviews.rating" },
    },
  },
];

const pipeline3 = [
  // {
  //   $limit: 3,
  // },
  { $unwind: "$book_authors" },
  {
    $group: {
      _id: {
        $concat: ["$book_authors.last_name", ", ", "$book_authors.first_name"],
      },
      total_books_written: { $sum: 1 },
    },
  },
  {
    $sort: { total_books_written: -1 },
  },
  { $limit: 3 },
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
    let aggCursor = books_collection.aggregate(pipeline1);
    for await (const doc of aggCursor) {
      console.log(doc);
    }
    console.log();
    aggCursor = books_collection.aggregate(pipeline2);
    for await (const doc of aggCursor) {
      console.log(doc);
    }
    console.log();
    aggCursor = books_collection.aggregate(pipeline3);
    for await (const doc of aggCursor) {
      console.log(doc);
    }
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
  } finally {
    await client.close();
  }
};

main();

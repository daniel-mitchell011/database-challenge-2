const { MongoClient } = require("mongodb");

// Must supply username and password at <username> and <db_password>, respectively.
uri =
  "mongodb+srv://<username>:<db_password>@cluster0.ftuzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);
client.connect();
const myDB = client.db("BookStore");
const books_collection = myDB.collection("books");
const authors_collection = myDB.collection("authors");

// This pipeline works as intended, books are grouped by genre
// and total books in each genre are counted.
const pipeline1 = [{ $group: { _id: "$genre", totalBooks: { $sum: 1 } } }];

const pipeline2 = [
  {
    $lookup: {
      from: "customer_reviews",
      localField: "book_reviews",
      foreignField: "_id",
      as: "rev",
    },
  },
  // This would be easy if I could just get the rating values
  // to populate for $avg...
  {
    $group: {
      _id: "$title",
      avg_rating: { $avg: "$rev.rating" },
    },
  },
];

// This pipeline does not work as intended. For some reason,
// the id gets sorted from least to greatest and ids get rolled
// up despite the limit being set to three.
// Using the sample data I provide in part2.js, only Hector Garcia-Molina
// is populated with _id value of 1.
const pipeline3 = [
  {
    $limit: 3,
  },
  {
    $project: {
      _id: "$first_name",
      first_name: 1,
      last_name: 1,
      totalBooks: { $size: "$authors_books" },
    },
  },
  {
    $group: {
      _id: "$totalBooks",
      firstName: { $first: "$first_name" },
      lastName: { $first: "$last_name" },
    },
  },
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
    aggCursor = authors_collection.aggregate(pipeline3);
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

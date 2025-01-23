const { MongoClient } = require("mongodb");

// Must supply username and password at <username> and <db_password>, respectively.
uri =
  "mongodb+srv://<username>:<db_password>@cluster0.ftuzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);
client.connect();
const myDB = client.db("BookStore");
const books_collection = myDB.collection("books");
const authors_collection = myDB.collection("authors");

const pipeline1 = [{ $group: { _id: "$genre", totalBooks: { $sum: 1 } } }];

const pipeline2 = [
  {
    $lookup: {
      from: "customer_reviews",
      localField: "customer_review_id",
      foreignField: "_id",
      as: "customer_review_details",
    },
  },
  {
    $addFields: {
      customer_review_details: {
        $arrayElemAt: ["$customer_review_details", 1],
      },
    },
  },
  // This would be easy if I could just get the rating values to populate for $avg...
  {
    $group: {
      _id: "$title",
      avg_rating: { $avg: "$customer_review_details.rating" },
    },
  },
];

const pipeline3 = [
  {
    $limit: 3,
  },
  {
    $project: {
      _id: "$first_name",
      totalBooks: { $size: "$authors_books" },
    },
  },
  {
    $set: {
      name: {
        $concat: ["$first_name", ",", "$last_name"],
      },
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

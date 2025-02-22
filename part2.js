// Code based on: https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/insert/

const { MongoClient } = require("mongodb");

// Must supply username and password at <username> and <db_password>, respectively.
uri =
  "mongodb+srv://<username>:<db_password>@cluster0.ftuzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);
client.connect();
const myDB = client.db("BookStoreEmbedded");
const books_collection = myDB.collection("books");

const books = [
  {
    _id: "book1",
    title: "Database Systems: The Complete Book",
    page_count: 1203,
    isbn: "978-0-13-187325-4",
    genre: "Computing Systems",
    book_authors: [
      {
        author_id: "author1",
        first_name: "Hector",
        last_name: "Garcia-Molina",
      },
      {
        author_id: "author2",
        first_name: "Jeffrey",
        last_name: "Ullman",
      },
      {
        author_id: "author3",
        first_name: "Jennifer",
        last_name: "Widom",
      },
    ],
    book_reviews: [
      {
        _id: 1,
        review_content: "In-depth coverage of databases.",
        rating: 4,
      },
    ],
  },
  {
    _id: "book2",
    title: "The Wheel of Time Book 5: The Fires of Heaven",
    page_count: 930,
    isbn: "978-1-250-25194-7",
    genre: "Fantasy",
    book_authors: [
      {
        author_id: "author4",
        first_name: "Robert",
        last_name: "Jordan",
      },
    ],
    book_reviews: [{ _id: 2, review_content: "Rand is cool.", rating: 5 }],
  },
  {
    _id: "book3",
    title: "The Wheel of Time Book 4: The Shadow Rising",
    page_count: 1037,
    isbn: "978-1-250-25192-3",
    genre: "Fantasy",
    book_authors: [
      {
        author_id: "author4",
        first_name: "Robert",
        last_name: "Jordan",
      },
    ],
    book_reviews: [{ _id: 3, review_content: "Spectacular.", rating: 3 }],
  },
  {
    _id: "book4",
    title: "The Wheel of Time Book 3: The Dragon Reborn",
    page_count: 690,
    isbn: "978-1-250-25149-7",
    genre: "Fantasy",
    book_authors: [
      {
        author_id: "author4",
        first_name: "Robert",
        last_name: "Jordan",
      },
    ],
    book_reviews: [{ _id: 4, review_content: "Epic.", rating: 3 }],
  },
  {
    _id: "book5",
    title: "Remembering the Kanji 3",
    page_count: 360,
    isbn: "978-0-8248-3702-0",
    genre: "Japanese Language",
    book_authors: [
      {
        author_id: "author5",
        first_name: "James",
        last_name: "Heisig",
      },
    ],
    book_reviews: [
      { _id: 5, review_content: "Lots of exotic kanji.", rating: 4 },
      {
        _id: 6,
        review_content:
          "Helped me learn the last 800 kanji I needed for Japanese reading proficiency.",
        rating: 5,
      },
    ],
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
    const books_result = await books_collection.insertMany(books);
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
  } finally {
    await client.close();
  }
};

main();

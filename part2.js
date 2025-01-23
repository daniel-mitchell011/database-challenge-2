// Code based on: https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/insert/

const { MongoClient } = require("mongodb");

// Must supply username and password at <username> and <db_password>, respectively.
// uri =
//   "mongodb+srv://<username>:<db_password>@cluster0.ftuzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
uri =
  "mongodb+srv://admin:mitchell@cluster0.ftuzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);
client.connect();
const myDB = client.db("BookStore");
const books_collection = myDB.collection("books");
const authors_collection = myDB.collection("authors");
const reviews_collection = myDB.collection("customer_reviews");

const books = [
  {
    _id: "book1",
    title: "Database Systems: The Complete Book",
    page_count: "1203",
    isbn: "978-0-13-187325-4",
    genre: "Computing Systems",
    book_authors: [
      { author_id: "author1" },
      { author_id: "author2" },
      { author_id: "author3" },
    ],
    book_reviews: [{ customer_review_id: "review1" }],
  },
  {
    _id: "book2",
    title: "The Wheel of Time Book 5: The Fires of Heaven",
    page_count: "930",
    isbn: "978-1-250-25194-7",
    genre: "Fantasy",
    book_authors: [{ author_id: "author4" }],
    book_reviews: [{ customer_review_id: "review2" }],
  },
  {
    _id: "book3",
    title: "The Wheel of Time Book 4: The Shadow Rising",
    page_count: "1037",
    isbn: "978-1-250-25192-3",
    genre: "Fantasy",
    book_authors: [{ author_id: "author4" }],
    book_reviews: [{ customer_review_id: "review3" }],
  },
  {
    _id: "book4",
    title: "The Wheel of Time Book 3: The Dragon Reborn",
    page_count: "690",
    isbn: "978-1-250-25149-7",
    genre: "Fantasy",
    book_authors: [{ author_id: "author4" }],
    book_reviews: [{ customer_review_id: "review4" }],
  },
  {
    _id: "book5",
    title: "Remembering the Kanji 3",
    page_count: "360",
    isbn: "978-0-8248-3702-0",
    genre: "Japanese Language",
    book_authors: [{ author_id: "author5" }],
    book_reviews: [{ customer_review_id: "review5" }],
  },
];

const authors = [
  {
    _id: "author1",
    first_name: "Hector",
    last_name: "Garcia-Molina",
    authors_books: [{ book_id: "book1" }],
  },
  {
    _id: "author2",
    first_name: "Jeffrey",
    last_name: "Ullman",
    authors_books: [{ book_id: "book1" }],
  },
  {
    _id: "author3",
    first_name: "Jennifer",
    last_name: "Widom",
    authors_books: [{ book_id: "book1" }],
  },
  {
    _id: "author4",
    first_name: "Robert",
    last_name: "Jordan",
    authors_books: [
      { book_id: "book2" },
      { book_id: "book3" },
      { book_id: "book4" },
    ],
  },
  {
    _id: "author5",
    first_name: "James",
    last_name: "Heisig",
    authors_books: [{ book_id: "book5" }],
  },
];

const reviews = [
  {
    _id: "review1",
    review_content: "In-depth coverage of databases.",
    rating: 4,
  },
  { _id: "review2", review_content: "Rand is cool.", rating: 5 },
  { _id: "review3", review_content: "Spectacular.", rating: 3 },
  { _id: "review4", review_content: "Epic.", rating: 3 },
  { _id: "review5", review_content: "Lots of exotic kanji.", rating: 4 },
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
    const authors_result = await authors_collection.insertMany(authors);
    const review_result = await reviews_collection.insertMany(reviews);
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
  } finally {
    await client.close();
  }
};

main();

const express=require("express");
const app=express();
const cors=require("cors");
const bodyparser=require("body-parser");
const mysql=require("mysql");
app.use(cors());
app.use(bodyparser.json());

const db=mysql.createConnection({
    host:"brd5rohp616w73oh8mb3-mysql.services.clever-cloud.com",
    user:"uy9zv2alcimdtouo",
    password:"zCGGge3XtE3heDr9Srr0",
    database:"brd5rohp616w73oh8mb3",
})
db.connect((err)=>{
    if(err)
  {
      console.log(`error while connecting to db ${err}`);
  }
  else{
      console.log(`database connected`);
      createtable();
  }
});

const  createtable=()=>{
    const user = `create table IF NOT EXISTS libuser (
        id int auto_increment primary key,
        name varchar(200),
        phonenumber varchar(20),
        email varchar(20),
        intrestedCategory varchar(200),
        isAdmin varchar(20) DEFAULT 'false',
        password varchar(200)
    )`
    
    const books=` create table IF NOT EXISTS libbooks (
        id int auto_increment primary key,
        name varchar(200),
        author varchar(200),
        price varchar(200),
        description varchar(200),
        category varchar(200),
        subject varchar(200),
        publishedDate Date
    )`
    db.query(user,(usererr,result)=>{
        if(usererr)
        {
            console.log(`error while creating user ${usererr}`);
        }
        else{
            console.log(`user table created creating books`);
            db.query(books,(bookerr,bres)=>{
                if(bookerr)
                {
                    console.log(`error while creating books ${books}`);
                }
                else{
                    console.log(`created books table `);
                }
            })
        }
    })
}

app.get("/allbooks",(req,res)=>{
    const selectbooks=`select * from libbooks`;
    db.query(selectbooks,(err,resu)=>{
        if(err){
            return res.status(500).json("error vanthuruchu")
        }
        else{
            return res.status(200).json({"books":resu});
        }
    })
})
app.post("/insertbook",(req,res)=>{
    const insert='insert into libbooks (name ,author,price,description,category,subject,publishedDate) values(?,?,?,?,?,?,?)';
    db.query(insert,(err,resu)=>{
        if(err){
            return res.status(500).json("error vanthuruchu")
        }
        else{
            return res.status(200).json({"msg":"inserted bro"});
        }
    })
})


app.post("/register", (req, res) => {
    const { name, phonenumber, email, intrestedCategory, password } = req.body;
    const insertUser = `INSERT INTO libuser (name, phonenumber, email, intrestedCategory, isAdmin,password) VALUES (?, ?, ?, ?, ?,?)`;
    
    db.query(insertUser, [name, phonenumber, email, intrestedCategory,password, 'false'], (err, result) => {
        if (err) {
            console.log(`Error while registering user: ${err}`);
            return res.status(500).json({ error: "Registration failed" });
        }
        
        return res.status(200).json({ message: "User registered successfully" });
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log(email,password);
    const selectUser = `SELECT * FROM libuser WHERE email = ? AND password = ?`;
    
    db.query(selectUser, [email, password], (err, result) => {
        if (err) {
            console.log(`Error while logging in: ${err}`);
            return res.json({ error: "Login failed" });
        }

        if (result.length === 0) {
            return res.json({ error: "Invalid credentials" });
        }
        return res.status(200).json({ message: "Login successful", user: result[0] });
    });
});



// app.get("/insertmultiplebooks", (req, res) => {
//     const booksData = [
//         {
//             name: "Book 1",
//             author: "Author 1",
//             price: "10.99",
//             description: "Description 1",
//             category: "Category 1",
//             subject: "Subject 1",
//             publishedDate: "2022-01-01"
//         },
//         {
//             name: "Book 2",
//             author: "Author 2",
//             price: "10.99",
//             description: "Description 2",
//             category: "Category 2",
//             subject: "Subject 2",
//             publishedDate: "2022-01-01"
//         },
//         {
//             name: "Book 3",
//             author: "Author 3",
//             price: "10.99",
//             description: "Description 3",
//             category: "Category 3",
//             subject: "Subject 3",
//             publishedDate: "2022-01-01"
//         },
//         {
//             name: "Book 4",
//             author: "Author 3",
//             price: "10.99",
//             description: "Description 3",
//             category: "Category 3",
//             subject: "Subject 3",
//             publishedDate: "2022-01-01"
//         },
//         {
//             name: "Book 5",
//             author: "Author 3",
//             price: "10.99",
//             description: "Description 3",
//             category: "Category 3",
//             subject: "Subject 3",
//             publishedDate: "2022-01-01"
//         },
//         {
//             name: "Book 6",
//             author: "Author 2",
//             price: "10.99",
//             description: "Description 3",
//             category: "Category 1",
//             subject: "Subject 2",
//             publishedDate: "2022-01-01"
//         },
//         {
//             name: "Book 7",
//             author: "Author 1",
//             price: "10.99",
//             description: "Description 3",
//             category: "Category 1",
//             subject: "Subject 2",
//             publishedDate: "2022-01-01"
//         },
//         {
//             name: "Book 8",
//             author: "Author 2",
//             price: "10.99",
//             description: "Description 2",
//             category: "Category 2",
//             subject: "Subject 2",
//             publishedDate: "2022-01-01"
//         },
//     ];

//     const insertBook = `
//     INSERT INTO libbooks (name, author, price, description, category, subject, publishedDate)
//     VALUES ?;
// `;

// const values = booksData.map(book => [
//     book.name,
//     book.author,
//     book.price,
//     book.description,
//     book.category,
//     book.subject,
//     book.publishedDate
// ]);

// db.query(insertBook, [values], (err, result) => {
//     if (err) {
//         console.log(`Error while inserting books: ${err}`);
//         return res.status(500).json({ error: "Insertion failed" });
//     }

//     return res.status(200).json({ message: "Books inserted successfully" });
// });
// });

app.get("/bookcount/:author/:name/:subject/:date", (req, res) => {
    const { author, name, subject, date } = req.params;
    const countAuthor = `SELECT COUNT(*) AS bookCountAuthor FROM libbooks WHERE author = ?`;
    const countTitle = `SELECT COUNT(*) AS bookCountTitle FROM libbooks WHERE name = ?`;
    const countSubject = `SELECT COUNT(*) AS bookCountSubject FROM libbooks WHERE subject = ?`;
    const countDate = `SELECT COUNT(*) AS bookCountDate FROM libbooks WHERE publishedDate = ?`;

    const counts = {};

    db.query(countAuthor, [author], (err, resultAuthor) => {
        if (err) {
            console.log(`Error while counting books: ${err}`);
            return res.status(500).json({ error: "Count failed" });
        }
        counts.author = resultAuthor[0].bookCountAuthor;

        db.query(countTitle, [name], (err, resultTitle) => {
            if (err) {
                console.log(`Error while counting books: ${err}`);
                return res.status(500).json({ error: "Count failed" });
            }
            counts.title = resultTitle[0].bookCountTitle;

            db.query(countSubject, [subject], (err, resultSubject) => {
                if (err) {
                    console.log(`Error while counting books: ${err}`);
                    return res.status(500).json({ error: "Count failed" });
                }
                counts.subject = resultSubject[0].bookCountSubject;

                db.query(countDate, [date], (err, resultDate) => {
                    if (err) {
                        console.log(`Error while counting books: ${err}`);
                        return res.status(500).json({ error: "Count failed" });
                    }
                    counts.date = resultDate[0].bookCountDate;

                    return res.status(200).json(counts);
                });
            });
        });
    });
});



app.listen(5000,()=>{
    console.log(`server is listening on 5000`);
})
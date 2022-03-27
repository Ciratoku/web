const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
let books = require('./lib');
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;
//styles
app.use('/public', express.static('public'));
//pug
app.set("view engine", "pug");
app.set("views", `./views`);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//write to json file
function writeToLib(books)
{
    let booksJSON = JSON.stringify(books);
    let fs = require('fs');
    fs.writeFileSync('./library.json', booksJSON);
}

//add a book
app.post('/', function(req, res, next){
    const body = req.body;
    if(body.author && body.releaseDate && body.title)
    {
        body.id = books.length ? (parseInt(books[books.length - 1].id) + 1).toString() : '0';
        books.push(body);
        writeToLib(books);
        res.end(JSON.stringify(body));
    }
    else
    {
        next();
    }
    console.log(books);
});

//edit a book
app.post('/:id', function(req, res, next){
    const body = req.body;
    if(body.author && body.releaseDate && body.title && body.available && body.borrowingDate && body.returnDate && body.name)
    {
        let Index = books.map((book)=>{
            return parseInt(book.id);
        }).indexOf(parseInt(body.id));
        books[Index] = body;
        writeToLib(books);
        res.render("book", {
            book: books[Index]
        });
    }
    else
    {
        next();
    }
    console.log(books);
});

//borrow a book
app.post('/:id', function(req, res, next){
    const body = req.body;
    if(body.name && body.borrowingDate && body.returnDate && body.available === "true")
    {
        let Index = books.map((book)=>{
            return parseInt(book.id);
        }).indexOf(parseInt(body.id));
        books[Index].name = body.name;
        books[Index].borrowingDate = body.borrowingDate;
        books[Index].returnDate = body.returnDate;
        writeToLib(books);
        res.render("book", {
            book: books[Index]
        });
    }
    else
    {

        next();
    }
    console.log(books);
});

//return a book
app.post('/:id', function(req, res, next){
    const body = req.body;
    if(body.value === "return")
    {
        let Index = books.map((book)=>{
            return parseInt(book.id);
        }).indexOf(parseInt(req.params.id));
        books[Index].name = "";
        books[Index].returnDate = "";
        books[Index].borrowingDate = "";
        writeToLib(books);
        res.render("book", {
            book: books[Index]
        });
    }
    else
    {
        next();
    }
    console.log(books);
});

//wrong data
app.post('/:id', function(req, res){
    let Index = books.map((book)=>{
        return parseInt(book.id);
    }).indexOf(parseInt(req.params.id));
    res.render("book", {
        book: books[Index]
    });
    console.log(books);
});

//delete a book
app.post('/', function(req, res){
    const body = req.body;
    if(body.value)
    {
        let removeIndex = books.map((book)=>{
            return parseInt(book.id);
        }).indexOf(parseInt(body.value));
        books.splice(removeIndex, 1);
        writeToLib(books);
        res.render("books", {
            books: books
        });
    }
    console.log(books);
});

app.use("/", routes);

app.listen(port);
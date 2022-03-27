const express = require('express');
const router = express.Router();
let books = require('../lib');

//filter button
router.get("/filter", (req, res, next) => {
    res.end(JSON.stringify(books));
});

router.get("/", (req, res) => {
    res.render("books", {
        books: books
    });
});

router.get("/:id", (req, res) => {
    let id = req.params.id;
    let book = null;
    for(let item of books)
    {
        if(item.id === id)
        {
            book = item;
        }
    }
    if(book !== null)
    {
        res.render("book", {
            book: book
        });
    }
    else
    {
        res.end("No such book");
    }
});

module.exports = router;
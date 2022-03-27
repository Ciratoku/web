function addBook()
{
    let tableBody = document.getElementById("books-table").tBodies[0];
    let book = {};
    book.id = document.getElementById("id").value;
    book.author = document.getElementById("author").value;
    book.title = document.getElementById("title").value;
    book.releaseDate = document.getElementById("releaseDate").value;
    book.available = document.getElementById("available").value;
    book.borrowingDate = document.getElementById("borrowingDate").value;
    book.returnDate = document.getElementById("returnDate").value;
    book.name = document.getElementById("name").value;
    callAjaxPUT(book, (response) => {
        let book = JSON.parse(response);
        let tr = document.createElement('tr');
        for(const property in book)
        {
            if(property !== "id" && property !== "available" && property !== "name" && property !== "borrowingDate")
            {
                let th = document.createElement('th');
                th.appendChild(document.createTextNode(book[property]));
                tr.appendChild(th);
            }
        }
        //button ?
        let thButtonCard = document.createElement('th');
        let buttonCard = document.createElement('button');
        buttonCard.className = "w3-button w3-grey";
        buttonCard.onclick = function(){window.location.href+=book.id;};
        buttonCard.innerHTML = "?";
        thButtonCard.appendChild(buttonCard);
        tr.appendChild(thButtonCard);
        //button - and form
        let thForm = document.createElement('th');
        let form = document.createElement('form');
        //button -
        let buttonDelete = document.createElement('button');
        buttonDelete.className = "w3-button w3-red";
        buttonDelete.name = "value";
        buttonDelete.type = "submit";
        buttonDelete.value = `${book.id}`;
        buttonDelete.innerHTML = "-";
        form.action = "/";
        form.method = "post";
        form.appendChild(buttonDelete);
        thForm.appendChild(form);
        tr.appendChild(thForm);
        tableBody.appendChild(tr);
    });
}

function callAjaxPUT(book, callback)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            callback(this.responseText);
        }
    };
    xhttp.open("POST", "/", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(book));
}
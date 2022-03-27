function filter(type)
{
    let tableBody = document.getElementById("books-table").tBodies[0];
    callAjaxGET((response) => {
        let books = JSON.parse(response);
        books.sort((book1, book2) => {
            if(type === 'up')
                return Date.parse(book1.returnDate) - Date.parse(book2.returnDate);
            else
                return Date.parse(book2.returnDate) - Date.parse(book1.returnDate);
        })
        tableBody.innerHTML = "";
        for(const book of books)
        {
            let tr = document.createElement('tr');
            for(const property in book)
            {
                if(property !== "id" && property !== "name" && property !== "borrowingDate")
                {
                    let th = document.createElement('th');
                    if(property === "available")
                    {
                        let text = book[property] == "true" ? "Да" : "Нет";
                        th.appendChild(document.createTextNode(text));
                        tr.appendChild(th);
                    }
                    else
                    {
                        th.appendChild(document.createTextNode(book[property]));
                        tr.appendChild(th);
                    }
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
        }
    });
}

function callAjaxGET(callback)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            callback(this.responseText);
        }
    };
    xhttp.open("GET", "/filter", true);
    xhttp.send();
}
$(document).ready(()=>{$("#add-picture-button").on("click",a=>{$("#add-picture-modal.modal").css({display:"block"})}),$("form#data").submit(function(a){a.preventDefault(),$("#author").val()&&$("#title").val()&&$("#file").val()&&$("#price").val()?(a=new FormData(this),$.ajax({url:window.location.pathname+"upload",type:"post",data:a,cache:!1,contentType:!1,processData:!1,success:function(a){a=`
<div class="picture">
<div class="modal-header">
<button id="delete" name="value" value="${(a=JSON.parse(a)).id}" class="close">
&times;
</button>
<p>"${a.title}"</p>
</div>
<img src=${a.src}>
<div>
<p>Автор: ${a.author}</p>
</div>
<div>
<p>${a.price} RUB</p>
</div>
</div>`,$("#pictures").append(a),$("#add-picture-modal").css({display:"none"})}})):alert("No file or no author name or no title or no price")})});
$(function(){$(document).on("click","div#pictures .picture img",o=>{window.location.href=window.location.pathname+$(o.target).siblings(".modal-header").find("#delete").attr("value")}),$("#pictures-button").on("click",o=>{window.location.href="/"}),$("#participants-button").on("click",o=>{window.location.href="/participants",console.log(window.location.href),console.log("")})});
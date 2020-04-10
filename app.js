const express = require("express");
  
const app = express();

require('./app/routes')(app, {});






app.listen(3000, () => {
  console.log('Start server');
});

/*
app.get("/", function(request, response){
      
    response.send("<h1>Главная страница</h1>");
});
app.use("/about", function(request, response){
      
    let id = request.query.id;
    let userName = request.query.name;
    response.send("<h1>Информация</h1><p>id=" + id +"</p><p>name=" + userName + "</p>");
});
 
app.listen(3000); */
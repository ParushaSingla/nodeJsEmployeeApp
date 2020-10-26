const moongose=require('mongoose');
const Role=require('../models/role')

function connectToDB(dbUrl){
    moongose.connect(dbUrl,{ useNewUrlParser: true }).then(()=>{
        console.log("Successfully connect to MongoDB.");
        initial();
    });
    const connection=moongose.connection;
    connection.on("error",()=>{
        console.log("The connection is not made please check");
    })
}
function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "employee"
        }).save(err => {
          if (err) {
            console.log("error", err);
          } 
          console.log("added 'Employee' to roles collection");
        });
  
        new Role({
          name: "manager"
        }).save(err => {
          if (err) {
            console.log("error", err);
          } 
          console.log("added Manager to roles collection");
        });
      }
    });
  }
  

module.exports={
    connectToDB
}
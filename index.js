const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  //origin: "http://localhost:8081"
  origin: true 
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// app.use(function(req, res, next) {
//   res.header(
//     "Access-Control-Allow-Headers",
//     "x-access-token, Origin, Content-Type, Accept"
//   );
//   next();
// });

//Connect to database
const db = require("./app/models");
const Role = db.role;
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
    //initial();
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });


  // function initial() {
  //   Role.estimatedDocumentCount((err, count) => {
  //     if (!err && count === 0) {
  //       new Role({
  //         name: "user"
  //       }).save(err => {
  //         if (err) {
  //           console.log("error", err);
  //         }
  
  //         console.log("added 'user' to roles collection");
  //       });
  
  //       new Role({
  //         name: "moderator"
  //       }).save(err => {
  //         if (err) {
  //           console.log("error", err);
  //         }
  
  //         console.log("added 'moderator' to roles collection");
  //       });
  
  //       new Role({
  //         name: "admin"
  //       }).save(err => {
  //         if (err) {
  //           console.log("error", err);
  //         }
  
  //         console.log("added 'admin' to roles collection");
  //       });
  //     }
  //   });
  // }
  

// simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to application." });
// });

app.get(
  "/",
  function (request, response) {
    response.sendFile(
      __dirname + "/static/welcome-page.html"
    );
  }
);


//Api User
const userRoutes = require("./app/routes/user.routes");
const authRoutes = require("./app/routes/auth.routes");
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

	var express = require('express');
	var app = express();
    var bodyParser  =   require("body-parser");
   // var mongoOp     =   mongoose.model("./model/mongo");
    var router      =   express.Router(); 
    var mongoose    =   require("mongoose");
   
mongoose.connect('mongodb://localhost:27017/Employee').then(() =>  console.log('connection succesful'))
	  .catch((err) => console.error(err));
// create schema
var userSchema  = new mongoose.Schema({
    "name" : String
},{ collection: 'Table' });
// create model if not exists.
module.exports = mongoose.model('Table',userSchema);
   
   var mongoOp     =   mongoose.model("Table",userSchema);
  
	app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({"extended" : false}));

    router.get("/",function(req,res){
      res.json({"error" : false,"message" : "Hello World"});
   });

//route() will allow you to use same path for different HTTP operation.
//So if you have same URL but with different HTTP OP such as POST,GET etc
//Then use route() to remove redundant code.

router.route("/users")
    .get(function(req,res){
        var response = {};
        mongoOp.find({},function(err,data){
        // Mongo command to fetch all data from collection.		
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    }).post(function(req,res){
        
        var response = {};
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        
		if(req.body.name){
        
			mongoOp.create({"name":req.body.name},function(err){
			// save() will run insert() command of MongoDB.
			// it will add new data in collection.
				if(err) {
					response = {"error" : true,"message" : "Error adding data"};
				} else {
					response = {"error" : false,"message" : "Data added"};
				}
				res.json(response);
			});
		}else{
		response = {"error" : false,"message" : "Name can't blank"};
		res.json(response);
		}
    });

	
	var addressSchema  = new mongoose.Schema({
    "address" : String,
	"__v":Number,
	"_id":String
},{ collection: 'Table1' });
	
	var mongoOp1     = module.exports =    mongoose.model("Table1",addressSchema);
	
router.route("/address").post(function(req,res){
        
        var response = {};
        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        
        
        mongoOp1.create({"address":req.body.address,"__v":0,"_id":mongoOp},function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"};
            }
            res.json(response);
        });
    });
	
	
app.use('/',router);

app.listen(27017);
console.log("Listening to PORT 27017");


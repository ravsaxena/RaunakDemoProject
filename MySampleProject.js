	var express = require('express');
	var app = express();
    var bodyParser  =   require("body-parser");
   // var mongoOp     =   mongoose.model("./model/mongo");
    var router      =   express.Router(); 
    var mongoose    =   require("mongoose");
    
		
mongoose.connect('mongodb://localhost:27017/MySampleProject').then(() =>  console.log('connection succesful'))
	  .catch((err) => console.error(err));

	  
	  // create schema
var signUpSchema  = new mongoose.Schema({
    login_id : { type : String , unique : true, required : true},
	user_password:{ type : String },
	_id:{ type : Number , unique : true, required : true }
},{ collection: 'sign_up_table' });

var counterShema = new mongoose.Schema({"_id":String,"sequence_value":Number},{collection: 'counters' });
var counterDb = module.exports=mongoose.model("counters",counterShema);

// create model if not exists.
module.exports = mongoose.model('sign_up_table',signUpSchema);
   
var mongoOp     =   mongoose.model("sign_up_table",signUpSchema);
    
	app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({"extended" : false}));

    router.get("/",function(req,res){
      res.json({"error" : false,"message" : "Hello World"});
   });

//route() will allow you to use same path for different HTTP operation.
//So if you have same URL but with different HTTP OP such as POST,GET etc
//Then use route() to remove redundant code.



router.route("/signUpUser")
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
		//getNextSequence("productid");
		//console.log(global.count);
        var response = {};		
			//console.log(getNextSequence("productid"));
			mongoOp.create({"login_id":req.body.login_id,"user_password":req.body.user_password,"_id":getNextSequence("productid")},function(err){
				if(err) {
					response = {"error" : true,"message" : "Error adding data"+err};
				} else {
					response = {"error" : false,"message" : "Data added"};
				}
				res.json(response);
			});
    });
	
	
	   function  getNextSequence(name) {
		
		var next_val;
		var ret = counterDb.findByIdAndUpdate({_id: 'productid'}, {$inc: { sequence_value: 1} }, function(error, counters)   {
        if(error)
            return console.err(error);
		else
            console.log("counter:    "+counters.sequence_value);
			global.count = counters.sequence_value;
		});
		
		return global.count;
}


	
app.use('/',router);
app.listen(3000,'0.0.0.0',function() {
    console.log('Listening to port:  ' + 3000);
});

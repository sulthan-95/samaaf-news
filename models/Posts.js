var mongoose=require('mongoose');

var PostSchema=new mongoose.Schema({
	title:String,
	link:String,
	upvotes:{type:Number,default:0},
	downvotes:{type:Number,default:0},
	comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comment'}]
});

PostSchema.methods.upvote=function(ob){
	this.upvotes+=1;
	this.save(ob);
};

PostSchema.methods.downvote=function(ob){
	this.downvotes+=1;
	this.save(ob);
};

mongoose.model('Post',PostSchema);	
	

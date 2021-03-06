var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var jwt = require('express-jwt');

var auth = jwt({ secret: 'SECRET', userProperty: 'payload' });

//Pre loading post and comment objects for the request paramater in certain routes..
router.param('post',function(req,res,next,id){
	var query=Post.findById(id);
	
	query.exec(function(err,post){
		if(err){ return next(err); }
		if(!post){ return next(new Error('can\'t find post anywhere')); }
	
	req.post=post;
	return next();
	})
});	

router.param('comment',function(req,res,next,id){
	var query=Comment.findById(id);
	
	query.exec(function(err,comment){
		if(err){ return next(err); }
		if(!comment){ return next(new Error('can\'t find comment..')); }
	req.comment=comment;
	return next();
	})
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/posts',function(req,res,next){
	Post.find(function(err,posts){
		if(err){return next(err);}
		res.json(posts);
	});
});

router.get('/posts/:post',function(req,res){
	req.post.populate('comments',function(err,post){
		if(err){ return next(err); }
		res.json(post);
	});
});

router.get('/posts/:post/comments',auth,function(req,res){
	var post=req.post;
	res.json(post.comments);
});

//PUT upvotes and downvotes for a post and comment

router.put('/posts/:post/upvote',auth,function(req,res,next) {
	req.post.upvote(function(err,post) {
		if(err) { return next(err); }
		res.json(post);
	});
});

router.put('/posts/:post/downvote',auth,function(req,res,next) {
	req.post.downvote(function(err,post) {
		if(err) { return next(err); }
		res.json(post);
	});
});

router.put('/posts/:post/comments/:comment/upvote',auth,function(req,res,next){
	var comment=req.comment;
	comment.upvote(function(err,comment){
		if(err) { return next(err); }
		
		res.json(comment);
	});
});

//Post the comments and posts

router.post('/posts',auth,function(req,res,next){
	var post=new Post(req.body);
	post.author=req.payload.username;
	post.save(function(err,post){
		if(err){ return next(err); }
		
		res.json(post);
	});
});

router.post('/posts/:post/comments',auth,function(req,res,next){
	var comment=new Comment(req.body);
	comment.post=req.post;
	comment.author=req.payload.username;
	comment.save(function(err,comment){
		if(err) { return next(err); }
		req.post.comments.push(comment);
		req.post.save(function(err,post){
			
			if(err){ return next(err); }
			
			res.json(comment);
		});
	});
});

//Login and register pages with JWT authentication routers..
		
module.exports = router;

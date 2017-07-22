var app=angular.module('samaafNews',['ui.router']);
app.factory('posts',[function(){
	//service body
	var service={
		posts:[]
	};
	return service;
}])
app.controller('MainCtrl',[
'$scope',
'posts',
function($scope,posts){
	//controller body
	$scope.posts=posts.posts;
	$scope.addPost=function(){
		if(!$scope.title || $scope.title ===''){return;}
		$scope.posts.push(
		{
			title:$scope.title,
			link:$scope.link,
			upvotes:0,
			downvotes:0,
			comments:[
				{author:'Joe',body:'How you doing!',upvotes:0},
				{author:'Chandler',body:'Oh! my god',upvotes:0}
			]
		});
		$scope.title='';
		$scope.link='';
	};
	$scope.increment=function(post){	
		post.upvotes+=1;
	};
	$scope.decrement=function(post){
		post.downvotes+=1;
	};
}]);

app.controller('PostsCtrl',[
	'$scope',
	'$stateParams',
	'posts',
	function($scope,$stateParams,posts){	 
	 $scope.post=posts.posts[$stateParams.id]; 
	 $scope.increment=function(comment){
		comment.upvotes+=1;
	 };
	 $scope.addComment=function(){
		if($scope.body===''){return;}
		if($scope.author===''){$scope.author='anonymous'}
		$scope.post.comments.push({
			author:$scope.author,
			body:$scope.body,
			upvotes:0
		});
	};
	$scope.body='';
	$scope.author='';
}]);

//A new angular module is configured with its state and routes
app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider,$urlRouterProvider){
		
	    $stateProvider.state('home',{
	         url:'/home',
		 templateUrl:'/home.html',
		 controller:'MainCtrl'
	    });

	    $stateProvider.state('posts', {
  	    	url: '/posts/{id}',
  		templateUrl: '/posts.html',
  		controller: 'PostsCtrl'
	    });

	   $urlRouterProvider.otherwise('home');
}]);
		

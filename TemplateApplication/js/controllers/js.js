angular
.module('mainApp', ['ngMaterial', 'ngAnimate', 'ui.router', 'directivelibrary', 'ngMessages'])
	
	.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/main/tabone');

	$stateProvider
	
	// HOME STATES AND NESTED VIEWS ========================================
   
	 .state('main', {
		url: '/main',
		templateUrl: 'partials/main.html'
	})

	.state('main.one', {
		url: '/tabone',
		templateUrl: 'partials/tabone.html',
		controller: 'ViewCtrl'
	})
	
	.state('add', {
		url: '/add',
		templateUrl: 'partials/add.html',
		controller: 'AddCtrl'
	})

})


.controller('AppCtrl', function ($scope, $mdDialog, $location, $state, $timeout, $q,$http, uiInitilize) {

	this.items = [];

    for(var i=0; i<1000; i++){
      this.items.push({'text': 'item-' + i.toString()});
    }
	
	$scope.items = uiInitilize.insertIndex(this.items);
		
	 //This holds the UI logic for the collapse cards
	 $scope.toggles = {};
	 $scope.toggleOne = function($index)
	 {	
		$scope.toggles = uiInitilize.openOne(this.items, $index);
	 }

	setInterval(function interval(){
		$scope.viewPortHeight = window.innerHeight;
		$scope.viewPortHeight = $scope.viewPortHeight+"px";
	 }, 100);

	
})//END OF AppCtrl

.controller('ViewCtrl', function ($scope, $mdDialog, $window, $mdToast) {
	
	$scope.saveChanges = function(content){
		
		delete content.$index;
		console.log(content);
		
		$mdToast.show({
			template: '<md-toast class="md-toast-success" >Changes saved</md-toast>',
			hideDelay: 2000,
			position: 'bottom right'
		});
	}
			
})//END OF AddCtrl
  
.controller('AddCtrl', function ($scope, $mdDialog, $window, $mdToast) {
	
	$scope.submit = function(){
		if($scope.editForm.$valid == true) 
		{
			console.log($scope.content);
		}else//This is done because the HTML simple validation might work and enter the submit, however the form can still be invalid
		{
			$mdToast.show({
				template: '<md-toast class="md-toast-error" >Please fill all the details</md-toast>',
				hideDelay: 2000,
				position: 'bottom right'
			});
		}

		//$scope.submitted = true; // Disable the submit button until the form is submitted successfully to the database (ng-disabled)
					
		//submit info to database
		
		 /*
		 ---if submit request is successful---
			self.searchText = "";
			$scope.submitted = false; // Make submit button enabled again (ng-disabled)
			$scope.template = ""; // Empty the form
			$scope.editForm.$setUntouched();
			$scope.editForm.$setPristine();
		 */
		
	}
			
	
})//END OF AddCtrl








angular.module('mainApp', ['ngMaterial', 'ngAnimate', 'ui.router', 'directivelibrary', 'ngMessages' ,'uiMicrokernel'])
	
.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/view');

	$stateProvider
	
	// HOME STATES AND NESTED VIEWS ========================================
	
	.state('view', {
		url: '/view',
		templateUrl: 'partials/view.html',
		controller: 'viewCtrl'
	})

})


.controller('AppCtrl', function ($scope, $mdDialog, $location, $state, $timeout, $q,$http, uiInitilize) {
	
	// $scope variables/functions initialized here can be accessed from any child states. This controller is refernced in the body tag
	
})//END OF AppCtrl


  
.controller('viewCtrl', function ($scope, $mdDialog, $mdMedia, $window, notifications,uiInitilize, $auth, $objectstore, $fws, $presence) {
    
	// Check if user is logged in, if not redirect back-into login
    $auth.checkSession();
	
	// Initialize an allCustomers array
    $scope.allCustomers = [];
    
    //Business logic
    function getAllCustomers(){
        $objectstore.getClient("customer").onGetMany(function(data){
            console.log(data);
            $scope.allCustomers = uiInitilize.insertIndex(data);

            
        }).onError(function(err){
            alert ("Error loading all customers");
        }).getAll();
    }
    
    //This holds the UI logic for the collapse cards
	 $scope.toggles = {};
	 $scope.toggleOne = function($index)
	 {	
		$scope.toggles = uiInitilize.openOne($scope.allCustomers, $index);
	 }
    
    //Recalculate the height of the window - This is usefult for the md-virtual-repeat container
	setInterval(function interval(){
		$scope.viewPortHeight = window.innerHeight;
		$scope.viewPortHeight = $scope.viewPortHeight+"px";
	 }, 100);
    
    //UI logic
    function saveCustomer(answer){
        console.log(answer);
        $scope.currentCustomer = answer;
        
        $objectstore.getClient("customer").onComplete(function(){
            sendNotification();
            notifications.toast("Customer Added", "success");
        }).onError(function(err){
            notifications.alertDialog("Error Inserting", "The customer was not added to the database, Try again!");
            $scope.submitted = false;
        }).insert([$scope.currentCustomer], {KeyProperty:"email"});
        
    }

    
    //CEB Logic
    $presence.onOnline(function(){
        $fws.subscribeEvent("DemoAppUpdated");
        $fws.onRecieveEvent("DemoAppUpdated",recieveNotification);        
    });

    function sendNotification(){
        $fws.triggerevent("DemoAppUpdated", $scope.currentCustomer);
    }
    
    function recieveNotification(e,data){
        console.log(data);
        if (!$scope.allCustomers) $scope.allCustomers = [];
        $scope.allCustomers.push(data);
    }
    
	
    $presence.setOnline();
    
    // Get all exisiting records
    getAllCustomers();
    
	// Add a new customer
    $scope.openCustomerInsert = function(ev)
	{
		//open Add Customer Dialog box
		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
		
		 $mdDialog.show({
			  controller: 'addCustomerCtrl',
			  templateUrl: 'partials/addCustomer.html',
			  parent: angular.element(document.body),
			  clickOutsideToClose:true,
			  fullscreen: useFullScreen
		}).then(function(answer) {
			if(answer)
			{	
				// After an object is returned form the Dialog box save the data in the objectstore
				saveCustomer(answer);
			}
		});
		
		 $scope.$watch(function() {
			  return $mdMedia('xs') || $mdMedia('sm');
			}, function(wantsFullScreen) {
			  $scope.customFullscreen = (wantsFullScreen === true);
		});
	}
			
	
})//END OF AddCtrl


//This is the controller for the Add Customer Dialog box
.controller('addCustomerCtrl', function ($scope, $mdDialog, $mdMedia, $window, notifications) {
    
    $scope.cancel = function()
    {
        $mdDialog.cancel();
    }
    
     $scope.submit = function()
    {
        $mdDialog.hide($scope.currentCustomer);
    }
    
})








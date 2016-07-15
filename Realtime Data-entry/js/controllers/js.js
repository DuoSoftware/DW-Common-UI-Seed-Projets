angular
.module('mainApp', ['ngMaterial', 'ngAnimate', 'ui.router', 'directivelibrary', 'ngMessages' ,'uiMicrokernel'])
	
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

	
})//END OF AppCtrl


  
.controller('viewCtrl', function ($scope, $mdDialog, $mdMedia, $window, notifications,uiInitilize, $auth, $objectstore, $fws, $presence) {
    
    $auth.checkSession();
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
        console.log("notification hit");
        $fws.triggerevent("DemoAppUpdated", $scope.currentCustomer);
    }
    
    function recieveNotification(e,data){
        console.log(data);
        if (!$scope.allCustomers) $scope.allCustomers = [];
        $scope.allCustomers.push(data);
    }
    
    $presence.setOnline();
    
    
    getAllCustomers();
    
    $scope.openCustomerInsert = function(ev)
	{
		
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
				console.log(answer);
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

.controller('addCustomerCtrl', function ($scope, $mdDialog, $mdMedia, $window, notifications) {
    
    $scope.cancel = function()
    {
        $mdDialog.cancel();
    }
    
     $scope.submit = function()
    {
        //console.log($scope.currentCustomer);
        $mdDialog.hide($scope.currentCustomer);
    }
    
})








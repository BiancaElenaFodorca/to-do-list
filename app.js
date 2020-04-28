var appModule = angular.module('appModule', []);
appModule.factory('sharedService', function($rootScope) {
  var sharedService = {};
 
  sharedService.tasks = [
   {
     id: 1,
     title: "Make an Angular JS application.",
     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
     status: 'inProgress'
   },
   {
     id: 2,
     title: "Learn more things about MVC concepts.", 
     description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
     status: 'new'
   },
   {
     id: 3,
     title: "Take a break!",
     description: "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text.",
     status: 'new'
   },
   {
     id: 4,
     title: "Check additional resources.",
     description: "Nothing to say.",
     status: 'completed'
   }
   ];
  sharedService.newTask = {};
 
  sharedService.prepTaskForBroadcast = function(title, description) {
    this.newTask = {
      id: Math.floor(Math.random() * 1000),
      title: title,
      description: description,
      status: 'new'
    }
      this.broadcastTasksList();
  }
 
  sharedService.broadcastTasksList = function() {
    $rootScope.$broadcast('handleNewTaskBroadcast');
  }
 
  sharedService.getCompletedTasks = function() {
    var list = sharedService.tasks
    var array = [];
    for(var i=0; i < list.length; i++) {
      if(list[i].status === 'completed') {
        array.push(list[i]);
      }
    }
    return array;
  }
 
  sharedService.removeTask = function(item) {
   angular.forEach(sharedService.tasks, function(obj, index){
     if(obj.id === item.id) {
       sharedService.tasks.splice(index, 1);
     }
   });
  }
 
  sharedService.changeInProgressStatus = function(item) {
   angular.forEach(sharedService.tasks, function(obj, index){ 
     if(obj.id === item.id) {
       obj.status = 'inProgress';
     }
   });
  }
 
  sharedService.changeCompletedStatus = function (item) {
   var self = this;
   angular.forEach(sharedService.tasks, function(obj, index){
     if(obj.id === item.id) {
       sharedService.tasks.splice(index, 1);
       self.newCompletedTask = obj;
       self.broadcastCompletedTaskList();
     }
   });
  }
 
  sharedService.broadcastCompletedTaskList = function() {
   $rootScope.$broadcast('handleCompletedTaskList');
 }
 
  return sharedService;
 });

appModule.controller("listCtrl", function ($scope, sharedService) {
  $scope.tasks = sharedService.tasks;
  
  $scope.$on('handleNewTaskBroadcast', function() {
     $scope.tasks.push(sharedService.newTask);  
  });

  $scope.handleWorkInProgressOperation = function (item) {
     sharedService.changeInProgressStatus(item);
  }

  $scope.handleCompleteOperation = function (item) {
     sharedService.changeCompletedStatus(item);
  }

  $scope.removeItem = function (item) {
    sharedService.removeTask(item);
  }
});

appModule.controller("formCtrl", function ($scope, sharedService) {
  $scope.errortext = "";
  
  $scope.handleClick = function (name, description) {
    if (!name) {
      $scope.errortext = "Please enter a title for your task.";
      return;}   
    sharedService.prepTaskForBroadcast(name, description);
    $scope.title = '';
    $scope.description = '';
  }
});

appModule.controller("completedTasksCtrl", function ($scope, sharedService) {
  $scope.completedTasks = sharedService.getCompletedTasks();

  $scope.$on('handleCompletedTaskList', function() {
    $scope.completedTasks.push(sharedService.newCompletedTask);
  });
});

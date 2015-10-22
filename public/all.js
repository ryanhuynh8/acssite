angular.module("themesApp",["theme","theme.demos","themeApp.controllers"]).config(["$provide","$routeProvider",function(e,t){"use strict";t.when("/",{templateUrl:"views/index.html",resolve:{loadCalendar:["$ocLazyLoad",function(e){return e.load(["bower_components/fullcalendar/fullcalendar.js"])}]}}).when("/:templateFile",{templateUrl:function(e){return"views/"+e.templateFile+".html"}}).when("#",{templateUrl:"views/index.html"}).otherwise({redirectTo:"/"})}]),angular.module("themeApp.controllers",["ui.grid"]),angular.module("themeApp.controllers").config(["$routeProvider",function(e){e.when("/announcements/new",{templateUrl:"views/announcement_new.html"})}]).controller("announcementController",["$scope","$timeout","$http","$location","$bootbox","$window","dataService",function(e,t,a,o,r,s,n){e.list=[],n.getAnnoucementList(function(t,a){e.list=t}),e["delete"]=function(e){r.confirm("Are you sure you want to delete this item?",function(t){t&&l(e)})};var l=function(e){var t={id:e};a.post(n.getApiUrl("/api/announcement/delete"),t).then(function(e){"success"===e.data.message&&s.location.reload()})["catch"](function(e){r.alert(e.data)})}}]).controller("announcementCreateController",["$scope","$timeout","$http","$location","dataService",function(e,t,a,o,r){e.model={},e.model.post_on_date=moment().valueOf(),e.model.expired_date=moment().add(3,"days").valueOf(),e.showAlert=!1,e.alertType="success",e.alertMsg="",e.open1=function(t){t.preventDefault(),t.stopPropagation(),e.opened1=e.opened1?!1:!0},e.open2=function(t){t.preventDefault(),t.stopPropagation(),e.opened2=e.opened2?!1:!0},e.reset=function(){e.model={}};var s=function(){var t=moment(e.model.post_on_date).isBefore(e.model.expired_date),a=moment().isBefore(moment(e.model.post_on_date))||moment().isSame(moment(e.model.post_on_date),"day"),o=""!==e.model.task_description&&void 0!==e.model.task_description;return t&&a&&o?!0:!1};e.submit=function(){s()?a.post(r.getApiUrl("/api/announcement/new"),e.model).then(function(a){if("success"!==a.data.message)throw a.data;e.showAlert=!0,e.alertType="success",e.alertMsg="New announcement added successfully. Redirecting to dashboard now...",t(function(){o.path("/")},2e3)})["catch"](function(t){e.showAlert=!0,e.alertType="danger",e.alertMsg="Error creating a new announcement!",console.log(t),$("#create_button").removeAttr("disabled")}):(e.showAlert=!0,e.alertType="danger",e.alertMsg="Invalid date or empty description.",$("#create_button").removeAttr("disabled"))}}]),angular.module("themeApp.controllers").controller("loginController",["$scope","$timeout","$http","$location","$theme","$cookies","dataService",function(e,t,a,o,r,s,n){r.set("fullscreen",!0),e.$on("$destroy",function(){r.set("fullscreen",!1)}),e.isError=!1,e.login=function(t){var o=angular.element(t.toElement);o.attr("disabled","");var r=n.getApiUrl("/api/auth");a.post(r,{user_name:e.user.user_name,password:e.user.password}).success(function(t){t.message&&("authorized"===t.message?(s.name=t.name,window.location.href="/"):(e.isError=!0,e.errorMsg="Wrong username or password, please try again.",o.removeAttr("disabled")))})["catch"](function(t){e.isError=!0,401===t.status?(e.errorMsg="Wrong username or password, please try again.",o.removeAttr("disabled")):e.errorMsg="Cannot connect to server. Please contact website administrator. ("+t.status+")",console.log(t)})}}]),angular.module("themeApp.controllers").config(["$routeProvider",function(e){e.when("/customer/new",{templateUrl:"views/customer_new.html"}).when("/customers",{templateUrl:"views/customers.html"})}]).controller("customerController",["$scope","$timeout","$http","$location","$bootbox","dataService",function(e,t,a,o,r,s){}]),angular.module("themeApp.controllers").config(["$routeProvider",function(e){e.when("/tasks",{templateUrl:"views/tasks.html"}).when("/tasks/new",{templateUrl:"views/task_new.html"}).when("/tasks/edit",{templateUrl:"views/task_edit.html"}).when("/tasks/:id/view",{templateUrl:"views/task_view.html"}).when("/tasks/archived",{templateUrl:"views/tasks_archived.html"}).when("/tasks/all/archived",{templateUrl:"views/tasks_archived_all.html"})}]).controller("taskAdminController",["$scope","$timeout","$http","$location","$bootbox","dataService",function(e,t,a,o,r,s){e.dataLoaded=!1,e.search_params={};var n=null;e.setLoadMode=function(e){e?(i(),n="archived"):(l(),n="all")},s.getUserList(function(t,a){e.user_list=t}),t(function(){$('[data-toggle="tooltip"]').tooltip({placement:"top"})});var l=function(){e.gridOptions={enableColumnMenus:!1,rowHeight:150,rowTemplate:"views/grid_template/row.task.template.html",enableHorizontalScrollbar:0,columnDefs:[{field:"created_on",displayName:"Posted On",cellFilter:"date : 'medium'",width:200},{field:"poster_fullname",displayName:"Posted By",width:150},{field:"assignee_fullname",displayName:"Assigned To",width:150},{field:"task_description",width:"*",cellTemplate:"views/grid_template/cell.text.template.html"},{name:"button",displayName:"Action",cellTemplate:"views/grid_template/cell.button.template.html",width:200}],data:[]},s.getAllTask(function(t,a){e.gridOptions.data=t,e.dataLoaded=!0,void 0!==a&&s.showDatabaseErrorMessage(r)})},i=function(){e.gridOptions={enableColumnMenus:!1,rowHeight:150,rowTemplate:"views/grid_template/row.task.template.html",enableHorizontalScrollbar:0,columnDefs:[{field:"created_on",displayName:"Posted On",cellFilter:"date : 'medium'",width:200},{field:"poster_fullname",displayName:"Posted By",width:150},{field:"assignee_fullname",displayName:"Assigned To",width:150},{field:"task_description",width:"*",cellTemplate:"views/grid_template/cell.text.template.html"}],data:[]},s.getAllArchivedTask(function(t,a){e.gridOptions.data=t,e.dataLoaded=!0,void 0!==a&&s.showDatabaseErrorMessage(r)})};e.buttonClickHandler=function(e,t,a){if("view"===a){var n='<h4><span style="white-space: pre-line; font-family: Verdana">';n+=t.entity.task_description,n+="</span></h4>",r.dialog({size:"large",title:"<b>Task Detail</b>",message:n,onEscape:!0,buttons:{ok:{label:"OK"}}})}else"edit"===a?(s.set("task_to_edit",t.entity),o.path("/tasks/edit")):"delete"===a&&r.confirm("Are you sure you want to delete this task?",function(e){e&&d(t.entity.id)})};var d=function(t){var o={id:t};a.post(s.getApiUrl("/api/task/delete"),o).then(function(t){"success"===t.data.message&&e.reset()})["catch"](function(e){r.alert(e.data)})};e.quickSearch=function(t){e.dataLoaded=!1,t&&(e.search_params.status=21),s.findTaskWithOptions(e.search_params,function(t,a){e.gridOptions.data=t,e.dataLoaded=!0,e.showResult=!0,e.resultMsg="Found "+t.length+" record(s).",void 0!==a&&s.showDatabaseErrorMessage(r)})},e.reset=function(){e.search_params={},e.showResult=!1,e.dataLoaded=!1,"archived"===n?i():l()}}]).controller("taskController",["$scope","$timeout","$http","$location","$bootbox","dataService",function(e,t,a,o,r,s){e.search_params={},e.showResult=!1,e.dataLoaded=!1,e.is_archived=!1;var n=null;e.setLoadMode=function(e){e?(l(),n="archived"):(i(),n="all")};var l=function(){e.gridOptions={enableColumnMenus:!1,rowHeight:150,rowTemplate:"views/grid_template/row.task.template.html",enableHorizontalScrollbar:0,minRowsToShow:5,columnDefs:[{field:"created_on",displayName:"Posted On",cellFilter:"date : 'medium'",width:200},{field:"poster_fullname",displayName:"Assigned By",width:150},{field:"task_description",width:"*",cellTemplate:"views/grid_template/cell.text.template.html"}],data:[]},s.getArchivedTaskByUser(function(t,a){e.gridOptions.data=t,e.dataLoaded=!0,void 0!==a&&s.showDatabaseErrorMessage(r)})},i=function(){e.gridOptions={enableColumnMenus:!1,enableColumnResizing:!0,rowHeight:150,rowTemplate:"views/grid_template/row.task.template.html",enableHorizontalScrollbar:0,minRowsToShow:5,columnDefs:[{field:"created_on",displayName:"Posted On",cellFilter:"date : 'medium'",width:200},{field:"poster_fullname",displayName:"Assigned By",width:150},{field:"task_description",width:"*",cellTemplate:"views/grid_template/cell.text.template.html"},{name:" button",displayName:"Action",cellTemplate:"views/grid_template/cell.task.button.template.html",width:300}],data:[]},s.getTaskByUser(function(t,a){e.gridOptions.data=t,e.dataLoaded=!0,void 0!==a&&s.showDatabaseErrorMessage(r)})};e.getRowStyle=function(e){return e.entity.readed===!0?{"font-weight":"normal"}:void 0},e.buttonClickHandler=function(t,o,n){var l=angular.element(t.toElement);if("mark_as_read"===n)a.post(s.getApiUrl("/api/task/readed"),o.entity),o.entity.readed=!0,l.attr("disabled","");else if("mark_as_completed"===n)o.entity.task_description="Archiving, please wait...",a.post(s.getApiUrl("/api/task/archive"),o.entity).then(function(t){var a=e.gridOptions.data.indexOf(o.entity);e.gridOptions.data.splice(a,1)});else if("view"===n){var i='<h4><span style="white-space: pre-line;font-family: Verdana">';i+=o.entity.task_description,i+="</span></h4>",r.dialog({size:"large",title:"<b>Task Detail</b>",message:i,onEscape:!0,buttons:{ok:{label:"OK"}}})}else"open"===n&&alert("foo")},s.getUserList(function(t,a){e.user_list=t}),t(function(){$('[data-toggle="tooltip"]').tooltip({placement:"top"})}),e.quickSearch=function(t){e.dataLoaded=!1,t&&(e.search_params.status=21),s.findUserTaskWithOptions(e.search_params,function(t,a){e.gridOptions.data=t,e.dataLoaded=!0,e.showResult=!0,e.resultMsg="Found "+t.length+" record(s).",void 0!==a&&s.showDatabaseErrorMessage(r)})},e.reset=function(){e.search_params={},e.showResult=!1,e.dataLoaded=!1,"archived"===n?l():i()}}]).controller("taskViewController",["$scope","$timeout","$http","$location","$routeParams","dataService",function(e,t,a,o,r,s){var n=r.id;s.getTaskById(n,function(t,a){e.task=t,void 0!==a&&s.showDatabaseErrorMessage($bootbox)})}]).controller("taskEditController",["$scope","$timeout","$http","$location","dataService",function(e,t,a,o,r){e.task=r.get("task_to_edit"),r.set("task_to_edit",null),e.user_list=[],e.dt=e.task.due_date,e.buttonDisabled=!1,r.getUserList(function(t,a){e.user_list=t,e.selected_user=e.task.assign_by}),e.open=function(t){t.preventDefault(),t.stopPropagation(),e.opened=e.opened?!1:!0},e.updateTask=function(){e.buttonDisabled=!0,a.post(r.getApiUrl("/api/task/update"),e.task).then(function(a){if("success"!==a.data.message)throw a.data;e.showAlert=!0,e.alertType="success",e.alertMsg="Task updated successfully. Redirecting to dashboard now...",t(function(){o.path("/")},2e3)})["catch"](function(a){e.showAlert=!0,e.alertType="danger","error_modified"===a.message?(e.alertMsg="Error: someone had just updated the task before you, please reload this page and try to update again. Going back to dashboard now...",t(function(){o.path("/")},5e3)):e.alertMsg="Error creating a new task!",e.buttonDisabled=!1,console.log(a)})}}]).controller("taskCreateController",["$scope","$timeout","$http","$location","dataService",function(e,t,a,o,r){e.task={},e.user_list=[],e.showAlert=!1,e.alertType="success",e.alertMsg="",e.minDate=new Date,r.getUserList(function(t,a){e.user_list=t}),e.open=function(t){t.preventDefault(),t.stopPropagation(),e.opened=e.opened?!1:!0};var s=function(){return moment().isBefore(moment(e.task.due_date))||moment().isSame(moment(e.task.due_date),"day")?!0:!1};e.submit=function(){s()?a.post(r.getApiUrl("/api/task/new"),e.task).then(function(a){if("success"!==a.data.message)throw a.data;e.showAlert=!0,e.alertType="success",e.alertMsg="New task added successfully. Redirecting to dashboard now...",t(function(){o.path("/")},2e3)})["catch"](function(t){e.showAlert=!0,e.alertType="danger",e.alertMsg="Error creating a new task!",$("#create_task_button").removeAttr("disabled"),console.log(t)}):(e.showAlert=!0,e.alertType="danger",e.alertMsg="Due date must be after or equal today",$("#create_task_button").removeAttr("disabled"))},e.reset=function(){e.task={}}}]),angular.module("themeApp.controllers").config(["$routeProvider",function(e){e.when("/user/new",{templateUrl:"views/user_new.html"}).when("/user/edit",{templateUrl:"views/user_new.html"}).when("/users",{templateUrl:"views/users.html"})}]).controller("userController",["$scope","$timeout","$http","$location","$bootbox","dataService",function(e,t,a,o,r,s){function n(e){return!isNaN(parseFloat(e))&&isFinite(e)}e.dataLoaded=!1,e.showError=!1,e.user={},e.errorMsg="",e.user.sex=0,e.user.employee_type=0,e.open1=function(t){t.preventDefault(),t.stopPropagation(),e.opened1=!0},e.open2=function(t){t.preventDefault(),t.stopPropagation(),e.opened2=!0},e.submit=function(){l()&&("edit"===i?a.post(s.getApiUrl("/api/user/update"),e.user).then(function(e){o.path("/users")})["catch"](function(t){e.showAlert=!0,e.errorMsg=t}):a.post(s.getApiUrl("/api/user/new"),e.user).then(function(t){e.showAlert=!1,alert("New user added!"),o.path("/users")})["catch"](function(t){e.showAlert=!0,e.errorMsg=t}))},e.loadGrid=function(){e.gridOptions={enableColumnMenus:!1,rowHeight:45,enableHorizontalScrollbar:0,minRowsToShow:20,columnDefs:[{field:"user_name",displayName:"Username",width:150},{field:"full_name",displayName:"Employee Name",width:"*"},{field:"sex",displayName:"Sex",cellFilter:"sexFilter",width:150},{field:"email",displayName:"Email",width:200},{field:"date_hired",displayName:"Date Hired",cellFilter:"date",width:150},{field:"employee_type",cellFilter:"employeeTypeFilter",displayName:"Employee Type",width:150},{name:"button",displayName:"Action",cellTemplate:"views/grid_template/cell.user.button.template.html",width:300}],data:[]},s.getUserListFullInfo(function(t,a){e.gridOptions.data=t,e.dataLoaded=!0,void 0!==a&&s.showDatabaseErrorMessage(r)})};var l=function(){var t=e.user,a=/\S+@\S+/;return e.showErorr=!1,e.errorMsg="",t.first_name||(e.errorMsg+="Please enter the first name.\n"),t.last_name||(e.errorMsg+="Please enter the last name.\n"),t.address||(e.errorMsg+="Please enter the address.\n"),t.state||(e.errorMsg+="Please enter the state.\n"),t.city||(e.errorMsg+="Please enter the city.\n"),t.zip||(e.errorMsg+="Please enter the zipcode.\n"),t.phone1||(e.errorMsg+="Please enter at least one phone number.\n"),t.email||(e.errorMsg+="Please enter an email.\n"),t.user_name||(e.errorMsg+="Please enter a username.\n"),t.password||(e.errorMsg+="Please enter a password.\n"),n(t.zip)||(e.errorMsg+="Please enter a valid zipcode.\n"),n(t.phone1)||(e.errorMsg+="Please enter a valid first phone number.\n"),n(t.phone2)||""===t.phone2||(e.errorMsg+="Please enter a valid second phone number.\n"),a.test(t.email)||(e.errorMsg+="Please enter a valid email address, ie: abc@def.com.\n"),t.password!==t.confirm_password&&(e.errorMsg+="Passwords do not match.\n"),""!==e.errorMsg&&(e.showError=!0),""!==e.errorMsg?!1:!0};e.buttonClickHandler=function(e,t,a){"edit"===a&&(s.set("user_to_edit",t.entity),s.set("user_load_mode","edit"),o.path("/user/edit"))};var i=s.get("user_load_mode");console.log(i),e.mode=i,"edit"===i&&(e.user=s.get("user_to_edit"))}]);
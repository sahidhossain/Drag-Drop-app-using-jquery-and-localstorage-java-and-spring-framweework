
$(document).ready(function() {
	

	 if(localStorage.getItem("update")=="update")
		 {
			 $("#update-messege").fadeIn('slow');
		     $('#update-messege').delay(1000).fadeOut('slow');
		     $("#update-messege").fadeIn('slow');
		     $('#update-messege').delay(1000).fadeOut('slow');
			 localStorage.clear();
		 }
	 else if(localStorage.getItem("messege")=="delete")
		 {
			 $("#delete-messege").fadeIn('slow');
		     $('#delete-messege').delay(1000).fadeOut('slow');
		     $("#delete-messege").fadeIn('slow');
		     $('#delete-messege').delay(1000).fadeOut('slow');
			 localStorage.clear();
		 }
	 else if(localStorage.getItem("messege")=="success")
	    {
		 	$("#success-messege").fadeIn('slow');
	        $('#success-messege').delay(1000).fadeOut('slow');
	        $("#success-messege").fadeIn('slow');
	        $('#success-messege').delay(1000).fadeOut('slow');
	        localStorage.clear();
	    }
	 
	$("#new_button").click(function() {
		$("#task-list-interface").show();
		$("#task-list-interface").draggable();
	});
    //Refresh the page
	refresh = function() {
		location.reload();
	};
	//Default values for classes and id's
	var defaults = {
		todoTask : "todo-task",
		todoHeader : "task-header",
		todoDate : "task-date",
		todoDescription : "task-description",
		taskId : "task-",
		formId : "todo-form",
		dataAttribute : "data",
		img_edit_Class : "edit-job-icon",
		img_delete_Class : "delete-job-icon",
		deleteDiv : "delete-div"
	}, codes = {
		"1" : "#pending",
		"2" : "#inProgress",
		"3" : "#completed"
	};
	//findTodo , find all the data's and generate the todo list
	findTodo();
	function findTodo() {
		$.ajax({
			type : "GET",
			url : $('#baseUrl').attr('href') + "todo/findTodo",
			success : function(obj) {
				$.each(obj, function(i, todos) {
					generateElement(todos);
				});
			},
			error : function(e) {
				console.log('ERROR: ', e);
			}
		});
	}
	//submit the input values into addTodo method
	$('.submit-btn').unbind('click').bind("click",function(){
		var inputs = $("#" + defaults.formId + " :input"), errorMessage = "Fields can not be empty", title, description, date, tempData;
		if (inputs.length !== 6) {
			alert("Input length error");
			return;
		}
		title = inputs[0].value;
		description = inputs[1].value;
		date = inputs[2].value;
		var dateParse = $.datepicker.parseDate("d MM yy", date);
		if (!title || !description || !date || !dateParse) {
			generateDialog(errorMessage);
			return;
		}
		// tempData = {
		// title : title,
		// date : date,
		// description : description,
		// code:"1"
		// };
		// generateElement(tempData);
		localStorage.setItem("messege","success");
		addTodo();
		refresh(); 
		});

	//Take the values as serializeArray and save it on database
	function addTodo() {
		$.ajax({
		type : "POST",
		url : $('#baseUrl').attr('href') + "todo/saveTodo",
		data : $('#todo-form').serializeArray(),
		success : function(status) {
			if (status == "Done") {
				console.log("Save ok");
				$('#id').val("");
				$('#input-title').val("");
				$('#input-description').val("");
				$('#datepicker').val("");
				$('#code').val("");
			} else {
				console.log("Error from controller");
			}
		},
		error : function(e) {
			console.log("ERROR: ", e);
			}
		});
	}
	//find a todo by id ,it's main purpose is to delete or update or change the div from the card.
	function getTodo(taskId, index) {
		$.ajax({
		type : "Get",
		url : $('#baseUrl').attr('href') + "todo/getTodo/" + taskId,
		success : function(task) {
			$("#id").val(task.id);
			$("#input-title").val(task.title);
			$("#input-description").val(task.description);
			$("#datepicker").val(task.date);
			$("#code").val(index);
			addTodo();
		},
		error : function(e) {
			console.log("ERROR: ", e);
			}
		});
	}
	//change the todo from one card to another card 
	$.each(codes, function(index, value) {
			$(value).droppable({
			drop : function(event, ui) {
			var element = ui.helper, 
			css_id = element.attr("id"),
			id = css_id.replace(defaults.taskId, "");
			getTodo(id, index);
			refresh();
			}
		});
	});
	//after enter update button it send the values to addTodo
	$("#update-task-btn").unbind('click').bind("click",function() {
			var inputs = $("#" + defaults.formId + " :input"),
			errorMessage = "Fields can not be empty",
			title, description, date;
			if (inputs.length !== 6) {
				return;
			}
			title = inputs[0].value;
			description = inputs[1].value;
			date = inputs[2].value;
			var dateParse = $.datepicker.parseDate("d MM yy", date);
			if (!title || !description || !date || !dateParse) {
				generateDialog(errorMessage);
				return;
			}
			addTodo();
			$("#update-task-btn").val("add Task").removeClass("btn-info").attr('onClick','todo.add()');
	});

	// Generate the todo's 
	var generateElement = function(params) {
			var parent = $(codes[params.code]), wrapper;
			if (!parent) {
				return;
			}
			wrapper = $("<div />", {
				"class" : defaults.todoTask,
				"id" : defaults.taskId + params.id,
				"data" : params.id
			}).appendTo(parent);
			$("<div />", {
				"class" : defaults.todoHeader,
				"text" : params.title
			}).appendTo(wrapper);
			$("<div />", {
				"class" : defaults.todoDate,
				"text" : params.date
			}).appendTo(wrapper);
			$("<div />", {
				"class" : defaults.todoDescription,
				"text" : params.description
			}).appendTo(wrapper);
			$("<img />", {
				"class" : defaults.img_edit_Class,
				"id" : params.id,
				"text1" : params.title,
				"text2" : params.date,
				"text3" : params.description,
				"src" : "https://image.flaticon.com/icons/svg/61/61456.svg"
			}).appendTo(wrapper);
			$("<img />", {
				"class" : defaults.img_delete_Class,
				"src" : "https://image.flaticon.com/icons/png/512/126/126468.png",
				"id" : defaults.taskId + params.id
				}).appendTo(wrapper);
			wrapper.draggable({
				start : function() {
					$("#" + defaults.deleteDiv).show();
				},
				stop : function() {
					$("#" + defaults.deleteDiv).hide();
				},
				revert : "invalid",
				revertDuration : 200
			});
		};
		//catch the id's for deleting and updating the data
		$('#pending').mousemove(function() {
			$('div[class="todo-task ui-draggable"]').mouseenter(function() {
			css_id = $(this).attr('id');
			id = css_id.replace(defaults.taskId, "");
			$("." + defaults.img_delete_Class).unbind('click').bind("click",
				function() {
					if (confirm("Are you sure want to delete this todo?")) {
						deleteTodo(id);
						localStorage.setItem("messege","delete");
						refresh();
					}
				});
			$("." + defaults.img_edit_Class).unbind('click').bind("click",
				function() {
						 $("#id").val(id);
						 $("#code").val(1);
						 $("#input-title").val($(this).attr("text1"));
						 $("#input-description").val($(this).attr("text3"));
						 $("#datepicker").val($(this).attr("text2"));
						 $("#add-task-btn").val("Update task").addClass("btn-info").attr('id','update-task-btn-');
						 $("#popup-header").text("Update the task");
						 $("#task-list-interface").show();
						 localStorage.setItem("update","update");
						 $("#modal-close").click(function(){
							 localStorage.clear();
							 refresh();
						 });
				});
			})
		});
		//delete the data from database
		function deleteTodo(taskId) {
			$.ajax({
			type : "POST",
			url : $('#baseUrl').attr('href') + "todo/deleteTodo",
			data : {id : taskId	},
			success : function(status) {
				if (status == "Done") {
					console.log("Delete ok");
				} else {
					console.log("Error to deleting from controller");
				}
			},
			error : function(e) {
				console.log("ERROR: ", e);
			}
			});
		}
		//generate error dialog if you don't submit the form perfectly
		var generateDialog = function(message) {
			$("#task-list-interface").hide();
			var responseId = "response-dialog",
			title = "Warning!", 
			responseDialog = $("#"+ responseId), buttonOptions;
			if (!responseDialog.length) {
				responseDialog = $("<div />", {
					title : title,
					id : responseId
				}).appendTo($("body"));
			}
			responseDialog.html(message);
			buttonOptions = {
					"Go and submit perfectly" : function() {
					responseDialog.dialog("close");
					}
			};
			responseDialog.dialog({
				autoOpen : true,
				width : 400,
				modal : true,
				closeOnEscape : true,
				buttons : buttonOptions
			});
		};
	});
// todo.clear = function() {
// data = {};
// localStorage.setItem("todoData", JSON.stringify(data));
// $("." + defaults.todoTask).remove();
// };
//$(function() {
//$("#new_button, #modal-background, #modal-close").click(function() {
//	$("#task-list-interface, #modal-background").toggleClass("active");
//});
//});

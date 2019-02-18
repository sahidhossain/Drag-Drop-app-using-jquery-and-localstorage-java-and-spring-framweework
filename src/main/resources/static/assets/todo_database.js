
$(document).ready(function() {
	$("#new_button").click(function() {
		$("#task-list-interface").show();
		$("#task-list-interface").draggable();
	});

refresh = function() {
	location.reload();
};

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

findTasks();
function findTasks() {
	$.ajax({
		type : "GET",
		url : $('#baseUrl').attr('href') + "todo/findTodo",
		success : function(obj) {
			// $("#pending").empty();
			// $("#inProgress").empty();
			// $("#completed").empty();
			totalData = obj;
			$.each(obj, function(i, task) {
				generateElement(task);
				// alert(obj[i]);
			});
		},
		error : function(e) {
			console.log('ERROR: ', e);
		}
	});
}

$('.submit-btn').click(function(){
		var inputs = $("#" + defaults.formId + " :input"), errorMessage = "Fields can not be empty", id, title, description, date, tempData;

		if (inputs.length !== 6) {
			alert("Inpt eror");
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
		//		
		// tempData = {
		// title : title,
		// date : date,
		// description : description,
		// code:"1"
		// };
		// generateElement(tempData);

		addTask();
		// Reset Form
		inputs[0].value = "";
		inputs[1].value = "";
		inputs[2].value = "";
		refresh(); 
});


function addTask() {
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
function getTask(taskId, index) {
	$.ajax({
		type : "Get",
		url : $('#baseUrl').attr('href') + "todo/getTask/" + taskId,
		success : function(task) {
			$("#id").val(task.id);
			$("#input-title").val(task.title);
			$("#input-description").val(task.description);
			$("#datepicker").val(task.date);
			$("#code").val(index);
			addTask();
		},
		error : function(e) {
			alert("error");
			console.log("ERROR: ", e);
		}
	});
}
$.each(codes, function(index, value) {
	$(value)
			.droppable(
					{
						drop : function(event, ui) {
							var element = ui.helper, css_id = element
									.attr("id"), id = css_id.replace(
									defaults.taskId, "");
							getTask(id, index);
							refresh();
						}
					});
});

$("#update-task-btn").click(function() {
	var inputs = $("#" + defaults.formId + " :input"), errorMessage = "Fields can not be empty", id, title, description, date, tempData;
	if (inputs.length !== 6) {
		alert("Inpt eror");
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

	addTask();
	// Reset Form
	inputs[0].value = "";
	inputs[1].value = "";
	inputs[2].value = "";
	$("#update-task-btn").val("add Task").removeClass("btn-info").attr('onClick',
			'todo.add()');
});

// Add Task
var generateElement = function(params) {
	var parent = $(codes[params.code]), wrapper;
	// alert(codes[2]);
	// alert(params.code);
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

$('#pending').mousemove(function() {
	$('div[class="todo-task ui-draggable"]').mouseenter(function() {
		taskid = $(this).attr('id');
		id = taskid.replace(defaults.taskId, "");
		$("." + defaults.img_delete_Class).unbind('click').bind("click",
				function() {
					if (confirm("Are you sure want to delete this todo?")) {
						deleteTask(id);
						refresh();
					}
				});
		$("." + defaults.img_edit_Class).unbind('click').bind("click",
				function() {
					if (confirm("Are you sure want to edit this todo?")) {
						$("#id").val(id);
						$("#code").val(1);
						 $("#input-title").val($(this).attr("text1"));
						 $("#input-description").val($(this).attr("text3"));
						 $("#datepicker").val($(this).attr("text2"));
						 $("#add-task-btn").val("Update task").addClass("btn-info").attr(
						 'id', 'update-task-btn-');
						 $("#task-list-interface").show();
					}
				});
	}).mouseleave(function() {
		
	});
});
function deleteTask(taskId) {
	$.ajax({
		type : "POST",
		url : $('#baseUrl').attr('href') + "todo/deleteTodo",
		data : {
			id : taskId
		},
		success : function(status) {
			findTasks();
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



$("#add-task-btn").click(function() {
	$("#task-list-interface").hide();
});

var generateDialog = function(message) {
	var responseId = "response-dialog", title = "Warning!", responseDialog = $("#"
			+ responseId), buttonOptions;

	if (!responseDialog.length) {
		responseDialog = $("<div />", {
			title : title,
			id : responseId
		}).appendTo($("body"));
	}
	responseDialog.html(message);

	buttonOptions = {
		"Ok" : function() {
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

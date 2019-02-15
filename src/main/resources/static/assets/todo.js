$(function() {
	$("#new_button, #modal-background, #modal-close").click(function() {
		$("#task-list-interface, #modal-background").toggleClass("active");
	});
});
$(document).ready(function() {
	$("#new_button").click(function() {
		$("#task-list-interface").show();
		$("#task-list-interface").draggable();
	});
});

var todo = todo || {}, data = JSON.parse(localStorage.getItem("todoData"));
data = data || {};
refresh = function() {
	location.reload();
};
var update_id = 0;
(function(todo, data, $) {
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

	todo.init = function(options) {
		options = options || {};
		options = $.extend({}, defaults, options);
		$.each(data, function(index, params) {
			generateElement(params);
		});

		// Adding drop function to each category of task
		$.each(codes, function(index, value) {
			$(value).droppable(
					{
						drop : function(event, ui) {
							var element = ui.helper,
							css_id = element.attr("id"),
							id = css_id.replace(options.taskId, ""),
							object = data[id];
							// Removing old element
							removeElement(object);
							// Changing object code
							object.code = index;
							// Generating new element
							generateElement(object);
							// Updating Local Storage
							data[id] = object;
							localStorage.setItem("todoData", JSON
									.stringify(data));
							// Hiding Delete Area
							$("#" + defaults.deleteDiv).hide();
							refresh();
						}
					});
		});
		// Adding drop function to delete div
//		$("#" + options.deleteDiv)
//				.droppable(
//						{
//							drop : function(event, ui) {
//								var element = ui.helper, css_id = element
//										.attr("id"), id = css_id.replace(
//										defaults.taskId, ""), object = data[id];
//
//								// Removing old element
//								removeElement(object);
//
//								// Updating local storage
//								delete data[id];
//								localStorage.setItem("todoData", JSON
//										.stringify(data));
//
//								// Hiding Delete Area
//								$("#" + defaults.deleteDiv).hide();
//								refresh();
//							}
//						});
		// Delete by button click
		$("." + defaults.img_delete_Class).click(
				function() {
					if (confirm("Are you sure want to delete this todo?")) {
						css_id = $(this).attr("id"), id = css_id.replace(
								defaults.taskId, ""), object = data[id];
						// Removing old element
						removeElement(object);

						// Updating local storage
						delete data[id];
						localStorage.setItem("todoData", JSON.stringify(data));
						refresh();
					}
				});

		// Edit by button click
		$("." + defaults.img_edit_Class).click(
				function() {
					update_id = $(this).attr("id");
					$("#input-title").val($(this).attr("text1"));
					$("#input-description").val($(this).attr("text3"));
					$("#datepicker").val($(this).attr("text2"));
					$("#add-task-btn").val("update").addClass("btn-info").attr(
							'onClick', 'todo.update()');
					$("#task-list-interface").show();

				});
			};

	todo.update = function() {
		var inputs = $("#" + defaults.formId + " :input"), errorMessage = "Fields can not be empty", id, title, description, date, tempData;
		if (inputs.length !== 4) {
			return;
		}
		title = inputs[0].value;
		description = inputs[1].value;
		date = inputs[2].value;
		if (!title || !description || !date) {
			generateDialog(errorMessage);
			return;
		}
		id = update_id.replace(defaults.taskId, ""), object = data[id];
		// Removing old element
		removeElement(object);
		// Updating local storage
		delete data[id];
		localStorage.setItem("todoData", JSON.stringify(data));
		id = new Date().getTime();
		tempData = {
			id : id,
			code : "1",
			title : title,
			date : date,
			description : description
		};
		// Saving element in local storage
		data[id] = tempData;
		localStorage.setItem("todoData", JSON.stringify(data));
		// Generate Todo Element
		generateElement(tempData);
		// Reset Form
		inputs[0].value = "";
		inputs[1].value = "";
		inputs[2].value = "";
		refresh();
		update_id = 0;
		$("#add-task-btn").val("add Task").removeClass("btn-info").attr(
				'onClick', 'todo.add()');
	}

	// Add Task
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
			"id" : defaults.taskId + params.id,
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
	// Remove task
	var removeElement = function(params) {
		$("#" + defaults.taskId + params.id).remove();
	};
	todo.add = function() {
		var inputs = $("#" + defaults.formId + " :input"), errorMessage = "Fields can not be empty", id, title, description, date, tempData;

		if (inputs.length !== 4) {
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
		id = new Date().getTime();

		tempData = {
			id : id,
			code : "1",
			title : title,
			date : date,
			description : description
		};
		// Saving element in local storage
		data[id] = tempData;
		localStorage.setItem("todoData", JSON.stringify(data));
		// Generate Todo Element
		generateElement(tempData);
		// Reset Form
		inputs[0].value = "";
		inputs[1].value = "";
		inputs[2].value = "";
		refresh();
	};

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

	todo.clear = function() {
		data = {};
		localStorage.setItem("todoData", JSON.stringify(data));
		$("." + defaults.todoTask).remove();
	};

})(todo, data, jQuery);
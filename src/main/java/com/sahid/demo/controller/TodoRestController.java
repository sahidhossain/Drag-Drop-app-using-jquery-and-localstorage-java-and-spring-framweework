package com.sahid.demo.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sahid.demo.model.TodoModel;
import com.sahid.demo.service.TodoService;

@RestController
@RequestMapping("/todo")
public class TodoRestController {

	@Autowired
	TodoService todoservice;


	@PostMapping(value = "/saveTodo")
	public String saveTask(TodoModel todomodel) {
		todoservice.saveTask(todomodel);
		return "Done";
	}

	@GetMapping(value = "/getTodo/{id}")
	public TodoModel getTaskById(@PathVariable Long id) {
		return this.todoservice.getTaskById(id);
	}

	@GetMapping(value = "/findTodo")
	public List<TodoModel> findTasks() {
		return todoservice.findAllTask();
	}

	@PostMapping(value = "/deleteTodo")
	public String deleteTask(Long id) {
		todoservice.deleteTask(id);
		return "Done";
	}

}

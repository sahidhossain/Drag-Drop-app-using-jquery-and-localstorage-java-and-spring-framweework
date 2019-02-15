package com.sahid.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sahid.demo.model.TodoModel;
import com.sahid.demo.repo.TodoRepository;

@Service
public class TodoService {

	@Autowired
	TodoRepository todorepo;

	public TodoModel saveTask(TodoModel tm) {
		todorepo.save(tm);
		return tm;
	}

	public List<TodoModel> findAllTask() {
		return todorepo.findAll();
	}

	public void deleteTask(Long id) {
		todorepo.deleteById(id);
	}

	public TodoModel update(TodoModel tm) {
		return todorepo.save(tm);
	}

	public TodoModel getTaskById(Long id) {
		return todorepo.getOne(id);
	}
}

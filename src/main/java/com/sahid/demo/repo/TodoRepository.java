package com.sahid.demo.repo;

import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.sahid.demo.model.TodoModel;


@Repository
@Transactional
public interface TodoRepository extends JpaRepository<TodoModel, Long> {
	
}

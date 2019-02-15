package com.sahid.demo.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "todolist3")
public class TodoModel implements Serializable {

	private static final long serialVersionUID = -3009157732242241606L;

	@Id
//	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id") // updatable = false, nullable = false
	private Long id;

	@Column(name = "title")
	private String title;

//	@DateTimeFormat(pattern = "dd/MM/yyyy")
//	@Temporal(TemporalType.DATE)
	@Column(name = "date")
	private String date;

	@Column(name = "description")
	private String description;

	@Column(name = "code")
	private String code;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public TodoModel(Long id, String title, String date, String description, String code) {
		super();
		this.id = id;
		this.title = title;
		this.date = date;
		this.description = description;
		this.code = code;
	}

	public TodoModel() {
		super();
	}

}

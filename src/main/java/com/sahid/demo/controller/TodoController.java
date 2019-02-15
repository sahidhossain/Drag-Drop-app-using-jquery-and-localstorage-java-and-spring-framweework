package com.sahid.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TodoController {
	@GetMapping(value = { "/localstorage" })
	public String localstorage(Model model) {
		model.addAttribute("Messege");
		return "index_localstorage";
	}
	
	@GetMapping(value = { "/", "/index" })
	public String database(Model model) {
		model.addAttribute("Messege");
		return "index_database";
	}
}

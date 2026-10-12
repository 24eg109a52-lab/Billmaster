package com.example.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/h")
    public String hello() {
        return "Hello World!";
    }

    @GetMapping("/venu")
    public String demo(){
        return "Hi, How are you?";
    }
}
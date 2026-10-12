package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Student findByEmail(String email);
}

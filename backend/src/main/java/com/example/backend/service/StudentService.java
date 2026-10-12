package com.example.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.backend.config.SecurityConfig.PasswordEncoder;
import com.example.backend.dto.LoginDTO;
import com.example.backend.dto.LoginResponseDTO;
import com.example.backend.dto.RegisterDTO;
import com.example.backend.entity.Student;
import com.example.backend.enums.Role;
import com.example.backend.repository.StudentRepository;

@Service
public class StudentService {
    @Autowired
    private StudentRepository repo;

    @Autowired
    private JwtService service;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Student> getAllStudents() {
        return repo.findAll();
    }

    public Student createStudent(RegisterDTO dto) {
        Student student = new Student();
        student.setName(dto.getName());
        student.setRole(dto.getRole() != null ? Role.valueOf(dto.getRole()) : Role.STUDENT);
        student.setEmail(dto.getEmail());
        student.setPassword(passwordEncoder.encode(dto.getPassword()));
        return repo.save(student);
    }

    public Student getStudentById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Student updateStudent(Long id, Student student) {
        Student existingStudent = repo.findById(id).orElse(null);
        if (existingStudent != null) {
            existingStudent.setName(student.getName());
            existingStudent.setEmail(student.getEmail());
            if (student.getPassword() != null && !student.getPassword().isEmpty()) {
                existingStudent.setPassword(passwordEncoder.encode(student.getPassword()));
            }
            if (student.getRole() != null) {
                existingStudent.setRole(student.getRole());
            }
            return repo.save(existingStudent);
        }
        return null;
    }

    public String deleteStudent(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return "Student deleted successfully";
        }
        return "Student not found";
    }

    public ResponseEntity<?> login(LoginDTO dto) {
        Student existingStu = repo.findByEmail(dto.getEmail());
        if (existingStu == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Email is Wrong");
        }
        boolean passwordMatch = passwordEncoder.matches(dto.getPassword(), existingStu.getPassword());
        if (!passwordMatch) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Password is Wrong");
        }
        String token = service.generateToken(dto.getEmail());
        String roleStr = existingStu.getRole() != null ? existingStu.getRole().name() : "STUDENT";
        LoginResponseDTO response = new LoginResponseDTO(token, existingStu.getId(), existingStu.getEmail(), roleStr);
        return ResponseEntity.ok(response);
    }
}
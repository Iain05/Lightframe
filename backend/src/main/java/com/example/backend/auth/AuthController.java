package com.example.backend.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost"})
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${auth.password}")
    private String adminPassword;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String password = body.get("password");

        if (!adminPassword.equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }

        String token = jwtUtil.generateToken("admin");
        return ResponseEntity.ok(Map.of("token", token));
    }

    // simple check to verify that this route requires authentication
    @GetMapping("/verify")
    public ResponseEntity<?> isAuthenticated() {
        return ResponseEntity.status(HttpStatus.OK).body("Authorized");
    }
}

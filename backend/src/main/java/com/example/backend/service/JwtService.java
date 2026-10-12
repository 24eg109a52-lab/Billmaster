package com.example.backend.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    public String generateToken(String email) {
        String payload = email + ":" + System.currentTimeMillis() + ":" + UUID.randomUUID().toString();
        return Base64.getEncoder().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
    }

    public String extractUsername(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token), StandardCharsets.UTF_8);
            return decoded.split(":")[0];
        } catch (Exception e) {
            return null;
        }
    }
}

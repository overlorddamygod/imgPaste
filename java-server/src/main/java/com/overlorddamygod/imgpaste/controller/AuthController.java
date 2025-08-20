package com.overlorddamygod.imgpaste.controller;

import com.overlorddamygod.imgpaste.dto.ApiResponse;
import com.overlorddamygod.imgpaste.dto.AuthDTOs;
import com.overlorddamygod.imgpaste.service.UserService;
import com.overlorddamygod.imgpaste.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody AuthDTOs.RegisterRequest req) {
        if (userService.findByEmail(req.email).isPresent() || userService.findByUsername(req.username).isPresent())
            return ResponseEntity.badRequest().body(new ApiResponse<>("User already exists"));

        try {
            userService.register(req.username, req.email, req.password);
            return ResponseEntity.ok(new ApiResponse<>("User created successfully."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthDTOs.LoginResponse>> login(@Valid @RequestBody AuthDTOs.LoginRequest req) {
        String email = req.email;
        String password = req.password;

        var userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty())
            return ResponseEntity.badRequest().body(new ApiResponse<>("User does not exist"));

        var user = userOpt.get();
        if (!userService.checkPassword(password, user.getPassword()))
            return ResponseEntity.badRequest().body(new ApiResponse<>("Invalid password"));

        try {
            var claims = new java.util.HashMap<String, Object>();
            claims.put("id", user.getId());
            claims.put("username", user.getUsername());
            claims.put("email", user.getEmail());
            String token = jwtUtil.generateToken(claims);
            return ResponseEntity.ok(new ApiResponse<>("Login successful.", new AuthDTOs.LoginResponse(token)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponse<>("Login failed: " + e.getMessage()));
        }
    }
}

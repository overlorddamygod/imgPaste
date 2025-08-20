package com.overlorddamygod.imgpaste.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String jwtSecret;

    private static final int MIN_KEY_LENGTH = 32; // 256 bits

    private SecretKey getKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < MIN_KEY_LENGTH) {
            // Pad the key to 32 bytes if too short
            byte[] padded = new byte[MIN_KEY_LENGTH];
            System.arraycopy(keyBytes, 0, padded, 0, Math.min(keyBytes.length, MIN_KEY_LENGTH));
            keyBytes = padded;
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private static final long DEFAULT_EXPIRATION_MS = 24L * 60 * 60 * 1000;

    public String generateToken(Map<String, Object> claims) {
        return generateToken(claims, DEFAULT_EXPIRATION_MS);
    }

    public String generateToken(Map<String, Object> claims, long expirationMs) {
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims validateToken(String token) {
        // Accept "Bearer <token>" or just "<token>"
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

package com.overlorddamygod.imgpaste.dto;

import jakarta.validation.constraints.*;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import jakarta.validation.Constraint;
import java.lang.annotation.*;

public class AuthDTOs {
    @PasswordMatches
    public static class RegisterRequest {
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
        public String username;

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        public String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}:;\"'<>,.?/]).{6,}$", message = "Password must contain letters, numbers, and symbols")
        public String password;

        @NotBlank(message = "Confirm password is required")
        public String confirmPassword;
    }

    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        public String email;

        @NotBlank(message = "Password is required")
        public String password;
    }

    public static class LoginResponse {
        private String token;

        public LoginResponse(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }

    // Custom annotation for password match
    @Target({ ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @Constraint(validatedBy = PasswordMatchesValidator.class)
    public @interface PasswordMatches {
        String message() default "Password and Confirm Password must match";

        Class<?>[] groups() default {};

        Class<? extends Payload>[] payload() default {};
    }

    public static class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, RegisterRequest> {
        @Override
        public boolean isValid(RegisterRequest value, ConstraintValidatorContext context) {
            if (value == null)
                return true;
            boolean matches = value.password != null && value.password.equals(value.confirmPassword);
            if (!matches) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("Password and Confirm Password must match")
                        .addPropertyNode("confirmPassword").addConstraintViolation();
            }
            return matches;
        }
    }
}

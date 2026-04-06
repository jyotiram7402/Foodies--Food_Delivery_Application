package org.gfg.foodApplicationMain.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.gfg.foodApplicationMain.Model.User;
import org.gfg.foodApplicationMain.Request.UserRequest;
import org.gfg.foodApplicationMain.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/userOnboarding/{$userType}")
    public User userOnboard(@RequestBody @Valid UserRequest userRequest) throws JsonProcessingException {
        return userService.userOnboard(userRequest);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Map<String, Object> response = new HashMap<>();
        response.put("pk", user.getPk());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());
        response.put("userType", user.getUserType());
        response.put("address", user.getAddress());
        response.put("latitude", user.getLatitude());
        response.put("longitude", user.getLongitude());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

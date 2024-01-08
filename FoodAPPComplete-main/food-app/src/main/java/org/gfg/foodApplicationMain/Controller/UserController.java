package org.gfg.foodApplicationMain.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.gfg.foodApplicationMain.Model.User;
import org.gfg.foodApplicationMain.Request.UserRequest;
import org.gfg.foodApplicationMain.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;
    private UserRequest userRequest;

    @PostMapping("/userOnboarding/{$userType}")
    public User userOnboard(@RequestBody @Valid UserRequest userRequest) throws JsonProcessingException {
        this.userRequest = userRequest;
        return userService.userOnboard(userRequest);
    }
}

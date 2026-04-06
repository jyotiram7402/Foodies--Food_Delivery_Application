package org.gfg.foodApplicationMain.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.gfg.foodApplicationMain.Model.User;
import org.gfg.foodApplicationMain.Service.MerchantService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class MerchantController {

    @Autowired
    private MerchantService merchantService;

    @PostMapping("/restaurant/onBoarding")
    public ResponseEntity<JSONObject> restaurantOnboard(@RequestBody JSONObject object) throws JsonProcessingException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        object.put("email", user.getEmail());
        return merchantService.restaurantOnboard(object);
    }

    @PostMapping("/restaurant/menu")
    public ResponseEntity<JSONObject> menuOnboard(@RequestBody JSONObject menu) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return merchantService.menuOnboard(menu, user.getEmail());
    }

    @GetMapping(value = "/restaurants", produces = "application/json")
    public String getAllRestaurants() {
        return merchantService.getAllRestaurants();
    }

    @GetMapping(value = "/restaurants/{id}", produces = "application/json")
    public String getRestaurantById(@PathVariable Integer id) {
        return merchantService.getRestaurantById(id);
    }

    @GetMapping(value = "/restaurants/{id}/menu", produces = "application/json")
    public String getRestaurantMenu(@PathVariable Integer id) {
        return merchantService.getRestaurantMenu(id);
    }

    @GetMapping(value = "/restaurant/my", produces = "application/json")
    public String getMyRestaurant() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return merchantService.getRestaurantByEmail(user.getEmail());
    }

    @GetMapping(value = "/restaurant/my/menu", produces = "application/json")
    public String getMyMenu() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return merchantService.getMenuByEmail(user.getEmail());
    }
}

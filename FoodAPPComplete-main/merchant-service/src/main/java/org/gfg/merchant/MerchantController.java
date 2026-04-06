package org.gfg.merchant;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/merchant")
public class MerchantController {

    @Autowired
    private MerchantService merchantService;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuRepository menuRepository;

    @PostMapping("/addRestaurantDetails")
    public ResponseEntity<JSONObject> restaurantOnboard(@RequestBody @Valid JSONObject restaurantOnboard) throws JsonProcessingException {
        Restaurant restaurant = merchantService.restaurantOnboard(restaurantOnboard);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("msg", "onboard successful");
        jsonObject.put("restaurantId", restaurant.getPk());
        return new ResponseEntity<>(jsonObject, HttpStatus.ACCEPTED);
    }

    @PostMapping("/addMenu")
    public ResponseEntity<JSONObject> menuItemDetails(@RequestBody @Valid JSONObject menuDetails) throws JsonProcessingException {
        MenuItems menuItems = merchantService.addMenuItemDetails(menuDetails);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("msg", "menu uploaded successfully.");
        jsonObject.put("menuId", menuItems.getItemId());
        return new ResponseEntity<>(jsonObject, HttpStatus.ACCEPTED);
    }

    @GetMapping("/restaurants")
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return new ResponseEntity<>(restaurantRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/restaurants/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Integer id) {
        return restaurantRepository.findById(id)
                .map(r -> new ResponseEntity<>(r, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/restaurants/{id}/menu")
    public ResponseEntity<List<MenuItems>> getMenuForRestaurant(@PathVariable Integer id) {
        List<MenuItems> items = menuRepository.findByRestaurantIdPk(id);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    @GetMapping("/restaurant/byEmail")
    public ResponseEntity<Restaurant> getRestaurantByEmail(@RequestParam String email) {
        Restaurant restaurant = restaurantRepository.findByMerchantEmail(email);
        if (restaurant == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

    @GetMapping("/restaurant/byEmail/menu")
    public ResponseEntity<List<MenuItems>> getMenuByEmail(@RequestParam String email) {
        Restaurant restaurant = restaurantRepository.findByMerchantEmail(email);
        if (restaurant == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<MenuItems> items = menuRepository.findByRestaurantIdPk(restaurant.getPk());
        return new ResponseEntity<>(items, HttpStatus.OK);
    }
}

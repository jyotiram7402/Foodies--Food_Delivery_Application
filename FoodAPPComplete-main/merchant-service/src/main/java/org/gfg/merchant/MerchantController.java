package org.gfg.merchant;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/merchant")
public class MerchantController {

    @Autowired
    private MerchantService merchantService;


    @PostMapping("/addRestaurantDetails")
    public ResponseEntity<JSONObject> restaurantOnboard (@RequestBody @Valid JSONObject restaurantOnboard) throws JsonProcessingException {
        Restaurant restaurant =  merchantService.restaurantOnboard(restaurantOnboard);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("msg", "onboard successful");
        jsonObject.put("restaurantId" , restaurant.getPk());
        return new ResponseEntity<>(jsonObject, HttpStatus.ACCEPTED);

    }
    @PostMapping("/addMenu")
    public ResponseEntity<JSONObject> menuItemDetails (@RequestBody @Valid JSONObject menuDetails) throws JsonProcessingException {

        MenuItems menuItems =  merchantService.addMenuItemDetails(menuDetails);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("msg", "menu uploaded successfully.");
        jsonObject.put("menuId" , menuItems.getItemId());
        return new ResponseEntity<>(jsonObject, HttpStatus.ACCEPTED);

    }


}

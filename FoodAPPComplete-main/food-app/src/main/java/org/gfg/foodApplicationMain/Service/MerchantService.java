package org.gfg.foodApplicationMain.Service;

import org.gfg.foodApplicationMain.Response.RestaurantOnboardResponse;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class MerchantService {

    @Value(value = "${merchant.host}")
    private String merchantHost;
    @Value(value = "${merchant.restaurant.onboard.endpoint}")
    private String merchantRestEndpoint;

    @Value(value = "${merchant.restaurant.menu.endpoint}")
    private String merchantMenuEndpoint;

    @Autowired
    private RestTemplate restTemplate;
    public ResponseEntity<JSONObject> restaurantOnboard(JSONObject object) {
        String url = merchantHost+merchantRestEndpoint;
        return restTemplate.postForEntity(url, object, JSONObject.class);
    }

    public ResponseEntity<JSONObject> menuOnboard(JSONObject menu, String email) {
        menu.put("email" , email);
        String url = merchantHost+merchantMenuEndpoint;
        return restTemplate.postForEntity(url, menu, JSONObject.class);
    }
}

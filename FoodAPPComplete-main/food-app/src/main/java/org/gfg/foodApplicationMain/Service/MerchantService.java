package org.gfg.foodApplicationMain.Service;

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
        String url = merchantHost + merchantRestEndpoint;
        return restTemplate.postForEntity(url, object, JSONObject.class);
    }

    public ResponseEntity<JSONObject> menuOnboard(JSONObject menu, String email) {
        menu.put("email", email);
        String url = merchantHost + merchantMenuEndpoint;
        return restTemplate.postForEntity(url, menu, JSONObject.class);
    }

    public String getAllRestaurants() {
        String url = merchantHost + "/merchant/restaurants";
        return restTemplate.getForObject(url, String.class);
    }

    public String getRestaurantById(Integer id) {
        String url = merchantHost + "/merchant/restaurants/" + id;
        return restTemplate.getForObject(url, String.class);
    }

    public String getRestaurantMenu(Integer id) {
        String url = merchantHost + "/merchant/restaurants/" + id + "/menu";
        return restTemplate.getForObject(url, String.class);
    }

    public String getRestaurantByEmail(String email) {
        String url = merchantHost + "/merchant/restaurant/byEmail?email=" + email;
        return restTemplate.getForObject(url, String.class);
    }

    public String getMenuByEmail(String email) {
        String url = merchantHost + "/merchant/restaurant/byEmail/menu?email=" + email;
        return restTemplate.getForObject(url, String.class);
    }
}

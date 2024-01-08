package org.gfg.merchant;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gfg.utils.CommonService;
import org.gfg.utils.LatLongForAddress;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalTime;

@Service
public class MerchantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Value(value = "${google.api.host}")
    private String googleHost;

    @Value(value = "${google.api.geocodingendpoint}")
    private String geoCodingEndpoint;

    @Value(value = "${google.api.key}")
    private String googleApiKey;

    @Value(value = "${google.response.format}")
    private String googleOutputFormat;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private KafkaTemplate kafkaTemplate;

    @KafkaListener(topics = {"ORDER_CREATED"} ,groupId = "merchant-group")
    public void listenerForOrderCreated(String msg) throws JsonProcessingException {
        JSONObject object = objectMapper.readValue(msg, JSONObject.class);
        String item =(String) object.get("itemName");
        Integer quantity =(Integer) object.get("quantity");
        System.out.println("item :" + item +" and quantity :" +quantity);
        sendAllLatLng((String) object.get("user_latitude"), (String) object.get("user_longitude"), (String) object.get("restName"));
    }
    public Restaurant restaurantOnboard(JSONObject restaurantOnboard) {
        Restaurant restaurant = convertJsonToRestaurant(restaurantOnboard);
        restaurant = restaurantRepository.save(restaurant);
        return restaurant;
    }

    private Restaurant convertJsonToRestaurant(JSONObject json) {
        LatLongForAddress latLongForAddress = CommonService.getLatLongFromAddress(googleHost, geoCodingEndpoint, googleOutputFormat, googleApiKey,(String) json.get("address"),  restTemplate);
        return Restaurant.builder().
                restName((String) json.get("restaurantName")).
                location((String) json.get("address")).
                lat(latLongForAddress.getLatitude()).
                lng(latLongForAddress.getLongitude()).
                startTime(LocalTime.parse((String) json.get("openAt"))).
                endTime(LocalTime.parse((String) json.get("closeAt"))).
                merchantEmail((String) json.get("email")).
                isActive(true).
                build();
    }

    public MenuItems addMenuItemDetails(JSONObject menuDetails) {
        Restaurant restaurant = restaurantRepository.findByMerchantEmail((String) menuDetails.get("email"));
        MenuItems menuItems = convertJsonToMenuItem(menuDetails);
        menuItems.setRestaurantId(restaurant);
        menuItems = menuRepository.save(menuItems);
        return menuItems;
    }
    private MenuItems convertJsonToMenuItem(JSONObject json) {
        return  MenuItems.builder().
                itemName((String) json.get("itemName")).
                MerchantEmail((String) json.get("email")).
                costPerItem((Integer) json.get("costPerItem")).
                isActive(true).
                build();
    }
    public void sendAllLatLng(String user_lat, String user_lng, String restName) throws JsonProcessingException {
        Restaurant restaurant = restaurantRepository.findByRestName(restName);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("user_lat", user_lat);
        jsonObject.put("user_lng", user_lng);
        jsonObject.put("merchant_lat", restaurant.getLat());
        jsonObject.put("merchant_lng", restaurant.getLng());
        jsonObject.put("order_accepted", "true");
        jsonObject.put("approx_time" , "10 min");
        kafkaTemplate.send("ORDER_CREATED_WITH_MERCHANT_DETAILS", objectMapper.writeValueAsString(jsonObject));
    }
}

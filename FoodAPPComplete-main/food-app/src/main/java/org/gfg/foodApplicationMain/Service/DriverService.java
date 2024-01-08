package org.gfg.foodApplicationMain.Service;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DriverService {

    @Value(value = "${driver.host}")
    private String driverHost;
    @Value(value = "${driver.onboard.endpoint}")
    private String driverOnboardEndpoint;

    @Autowired
    private RestTemplate restTemplate;

    public ResponseEntity<JSONObject> driverOnboard(JSONObject object) {
            String url = driverHost+driverOnboardEndpoint;
            return restTemplate.postForEntity(url, object, JSONObject.class);
        }

}

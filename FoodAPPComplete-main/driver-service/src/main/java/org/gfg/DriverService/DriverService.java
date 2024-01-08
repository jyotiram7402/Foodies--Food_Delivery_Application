package org.gfg.DriverService;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gfg.utils.CommonService;
import org.gfg.utils.LatLongForAddress;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalTime;
import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;


@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

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
    private ObjectMapper objectMapper;
    public DriverDetails addDriverDetails(JSONObject driverDetails) {
        DriverDetails driverDetails1 = convertJsonToDriverDetails(driverDetails);
        LatLongForAddress latLongForAddress = CommonService.getLatLongFromAddress(
                googleHost, geoCodingEndpoint, googleOutputFormat, googleApiKey, driverDetails1.getStartAddress(), restTemplate);
        driverDetails1.setStartLat(latLongForAddress.getLatitude());
        driverDetails1.setStartLng(latLongForAddress.getLongitude());
        driverDetails1 = driverRepository.save(driverDetails1);
        return driverDetails1;

    }
    private DriverDetails convertJsonToDriverDetails(JSONObject json) {
        return  DriverDetails.builder().
                driverOnlineFrom(LocalTime.parse((String) json.get("driverOnlineFrom"))).
                driverOnlineTill(LocalTime.parse((String)(json.get("driverOnlineTill")))).
                startAddress((String) json.get("startAddress")).
                email((String) json.get("email")).
                isActive(true).
                build();
    }
    @KafkaListener(topics = {"ORDER_CREATED_WITH_MERCHANT_DETAILS"} ,groupId = "driver-group")
    public void checkForDriver(String msg) throws JsonProcessingException {
        JSONObject object = objectMapper.readValue(msg, JSONObject.class);
        String userLat =(String) object.get("user_lat");
        String userLong = (String) object.get("user_lng");
        String merchantLat =(String) object.get("merchant_lat");
        String merchantLng = (String) object.get("merchant_lng");
        System.out.println("here i am !!");
        DriverDetails driverDetails = assignNearbyDriver(merchantLat, merchantLng);
    }

    private DriverDetails assignNearbyDriver(String merchantLat, String merchantLng) {
        List<DriverDetails> list = driverRepository.findAll();
        SortedMap<Double, Integer> sortedMap = new TreeMap<>();
        for(DriverDetails driver: list){
            String driverLat = driver.getStartLat();
            String driverLng = driver.getStartLng();
            Double km = getDistanceFromLatLonInKm(merchantLat, merchantLng, driverLat, driverLng);
            sortedMap.put(km, driver.getPk());
        }
        return driverRepository.findByPk(sortedMap.get(sortedMap.firstKey()));
    }

    private Double getDistanceFromLatLonInKm(String merchantLat, String merchantLng, String driverLat, String driverLng) {
        Integer R = 6371;
        double dLat = deg2rad(new Double(merchantLat).doubleValue() - new Double(driverLat).doubleValue());
        double dLon = deg2rad(new Double(merchantLng).doubleValue() - new Double(merchantLng).doubleValue());
        Double a =Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(deg2rad(new Double(driverLat).doubleValue())) * Math.cos(deg2rad(new Double(merchantLat).doubleValue())) *
                                Math.sin(dLon/2) * Math.sin(dLon/2)
                ;
        Double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        Double d = R * c; // Distance in km
        return d;
    }

    private Double deg2rad(Double val) {
        return val * (Math.PI/180);
    }
}

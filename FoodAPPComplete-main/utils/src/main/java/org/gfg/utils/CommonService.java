package org.gfg.utils;

import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.LinkedHashMap;

public class CommonService {

    public static LatLongForAddress getLatLongFromAddress(String googleHost, String geoCodingEndpoint,
                                                   String googleOutputFormat,String googleApiKey,
                                                   String address, RestTemplate restTemplate) {
        address = address.replaceAll(" " ,"+");
        String url = googleHost+geoCodingEndpoint+googleOutputFormat+"?key="+googleApiKey+"&address="+address;
        Object o = restTemplate.getForObject(url, Object.class);
        Object o1 = ((LinkedHashMap) o).get("results");
        Object o2 = ((LinkedHashMap) ((ArrayList) o1).get(0)).get("geometry");
        Object location =((LinkedHashMap) o2).get("location");
        String lat =((LinkedHashMap) location).get("lat").toString();
        String lng =((LinkedHashMap) location).get("lng").toString();
        return LatLongForAddress.builder().latitude(lat).longitude(lng).build();
    }
}

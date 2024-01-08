package org.gfg.foodApplicationMain.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gfg.foodApplicationMain.Model.User;
import org.gfg.foodApplicationMain.Repository.UserRepository;
import org.gfg.foodApplicationMain.Request.UserRequest;
import org.gfg.utils.CommonService;
import org.gfg.utils.LatLongForAddress;
import org.gfg.utils.CommonConstants;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private KafkaTemplate kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

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



    public User userOnboard(UserRequest userRequest) throws JsonProcessingException {
        User user = userRequest.toUser();
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        LatLongForAddress latLongForAddress = CommonService.getLatLongFromAddress(
                googleHost, geoCodingEndpoint, googleOutputFormat, googleApiKey, user.getAddress(), restTemplate);
        user.setLatitude(latLongForAddress.getLatitude());
        user.setLongitude(latLongForAddress.getLongitude());
        User userFromDb = userRepository.save(user);
        JSONObject jsonObject= new JSONObject();
        jsonObject.put(CommonConstants.USER_CREATION_NAME, user.getName());
        jsonObject.put(CommonConstants.USER_CREATION_EMAIL,user.getEmail());
        kafkaTemplate.send(CommonConstants.USER_CREATION_TOPIC, objectMapper.writeValueAsString(user));
        return userFromDb;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
       return userRepository.findByEmail(email);
    }
}

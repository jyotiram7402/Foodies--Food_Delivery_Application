package org.gfg.notificationService;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gfg.utils.CommonConstants;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JavaMailSender mailSender;

    @KafkaListener(topics = {CommonConstants.USER_CREATION_TOPIC} ,groupId = "notification-group")
    public void sendNotification(String msg) throws JsonProcessingException {
        JSONObject object = objectMapper.readValue(msg, JSONObject.class);
        String name =(String) object.get(CommonConstants.USER_CREATION_NAME);
        String email =(String) object.get(CommonConstants.USER_CREATION_EMAIL);
        String body = "HELLO ," +name+ "!\n\n"
                +"We want to welcome you on our platform."
                +"Best regards,\n"
                +"Food Delivery Application";
        sendEmail(email, "WELCOME to the platform", body);
        System.out.println("name of the user " +name);
    }

    private void sendEmail(String email, String welcomeToThePlatform, String body) {
        SimpleMailMessage simpleMailMessage= new SimpleMailMessage();
        simpleMailMessage.setFrom("fooddeliveryapp@abc.com");
        simpleMailMessage.setSubject(welcomeToThePlatform);
        simpleMailMessage.setText(body);
        simpleMailMessage.setTo(email);
        mailSender.send(simpleMailMessage);
    }

}

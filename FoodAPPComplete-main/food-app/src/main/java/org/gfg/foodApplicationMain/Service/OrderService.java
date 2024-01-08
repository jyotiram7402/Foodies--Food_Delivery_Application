package org.gfg.foodApplicationMain.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gfg.foodApplicationMain.Model.OrderDetails;
import org.gfg.foodApplicationMain.Model.User;
import org.gfg.foodApplicationMain.Repository.OrderRepository;
import org.gfg.foodApplicationMain.Repository.UserRepository;
import org.gfg.foodApplicationMain.Request.OrderRequest;
import org.gfg.foodApplicationMain.Response.OrderResponse;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KafkaTemplate kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private OrderRepository orderRepository;

    public OrderResponse userOrder(OrderRequest request, String email) throws JsonProcessingException {
      User user =  userRepository.findByEmail(email);
      JSONObject jsonObject = new JSONObject();
      jsonObject.put("user_latitude", user.getLatitude());
      jsonObject.put("user_longitude", user.getLongitude());
      jsonObject.put("itemName", request.getItemName());
      jsonObject.put("quantity", request.getQuantity());
      jsonObject.put("modeOfPayment" ,request.getModeOfPayment());
      jsonObject.put("restName" , request.getRestName());
      kafkaTemplate.send("ORDER_CREATED", objectMapper.writeValueAsString(jsonObject));
      OrderDetails order = request.toOrder();
      order.setUser(user);
      order = orderRepository.save(order);
      return OrderResponse.builder().orderId(order.getPk()).message("order sucessful!!").build();
    }
}

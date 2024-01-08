package org.gfg.foodApplicationMain.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.gfg.foodApplicationMain.Model.User;
import org.gfg.foodApplicationMain.Request.OrderRequest;
import org.gfg.foodApplicationMain.Response.OrderResponse;
import org.gfg.foodApplicationMain.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/order/")
    public ResponseEntity<OrderResponse> userOrder(@RequestBody OrderRequest request) throws JsonProcessingException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        OrderResponse orderRespone = orderService.userOrder(request, user.getEmail());
        return new ResponseEntity<>(orderRespone, HttpStatus.ACCEPTED);
    }
}



package org.gfg.DriverService;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/driver")
public class DriverController {
    @Autowired
    private DriverService driverService;


    @PostMapping("/addDriverDetails")
    public ResponseEntity<JSONObject> addDriverDetails(@RequestBody  JSONObject driverDetails){
        DriverDetails driverDetails1 =  driverService.addDriverDetails(driverDetails);
        JSONObject object = new JSONObject();
        object.put("driverId", driverDetails1.getPk());
        object.put("msg" , "onboarding successful!!");
        return new ResponseEntity<>(object, HttpStatus.ACCEPTED);
    }
}


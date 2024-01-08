package org.gfg.foodApplicationMain.Request;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class RestaurantOnboard {
    private String restaurantName;
    private String openAt;
    private String closeAt;
    private String address;


}

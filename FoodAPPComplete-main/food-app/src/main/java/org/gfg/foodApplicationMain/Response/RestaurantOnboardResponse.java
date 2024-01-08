package org.gfg.foodApplicationMain.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantOnboardResponse {
    private Integer RestId;
    private String restName;

}

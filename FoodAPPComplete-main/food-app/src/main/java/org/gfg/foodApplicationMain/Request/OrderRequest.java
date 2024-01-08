package org.gfg.foodApplicationMain.Request;

import lombok.*;
import org.gfg.foodApplicationMain.Model.OrderDetails;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class OrderRequest {
    private String itemName;
    private Integer quantity;
    private String restName;
    private String modeOfPayment;

    public OrderDetails toOrder() {
        return OrderDetails.builder().
                itemName(this.itemName).
                quantity(this.quantity).
                restName(this.restName).
                modeOfPayment(this.modeOfPayment).build();
    }
}

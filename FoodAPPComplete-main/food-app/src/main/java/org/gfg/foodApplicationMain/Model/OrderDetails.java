package org.gfg.foodApplicationMain.Model;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class OrderDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pk;
    private String itemName;
    private Integer quantity;
    private String restName;
    private String modeOfPayment;
    @CreationTimestamp
    private Date orderCreatedAt;
    @UpdateTimestamp
    private Date updatedAt;
    private Integer userId;

    @ManyToOne
    @JoinColumn
    private User user;


}

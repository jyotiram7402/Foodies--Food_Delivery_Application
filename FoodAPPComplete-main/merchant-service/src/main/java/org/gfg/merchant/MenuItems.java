package org.gfg.merchant;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer itemId;
    @JsonIgnore
    @ManyToOne
    @JoinColumn
    private Restaurant restaurantId;
    private String itemName;
    private Integer costPerItem;
    private boolean isActive;

    private String MerchantEmail;

}

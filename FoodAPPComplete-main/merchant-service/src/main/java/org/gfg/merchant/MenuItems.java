package org.gfg.merchant;

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
    @ManyToOne
    @JoinColumn
    private Restaurant restaurantId;
    private String itemName;
    private Integer costPerItem;
    private boolean isActive;

    private String MerchantEmail;

}

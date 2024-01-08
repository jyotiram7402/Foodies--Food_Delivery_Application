package org.gfg.merchant;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pk;
    private String restName;
    private String location;
    private String lat;
    private String lng;
    private LocalTime startTime;
    private LocalTime endTime;

    private String merchantEmail;
    private boolean isActive;
    @OneToMany(mappedBy = "restaurantId")
    private List<MenuItems> menuItems;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;




}

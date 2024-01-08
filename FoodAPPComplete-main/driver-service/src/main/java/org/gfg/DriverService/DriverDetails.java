package org.gfg.DriverService;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class DriverDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pk;

    private LocalTime driverOnlineFrom;

    private LocalTime driverOnlineTill;

    private String startAddress;

    private String startLat;

    private String startLng;

    private boolean isActive;

    private String email;

}

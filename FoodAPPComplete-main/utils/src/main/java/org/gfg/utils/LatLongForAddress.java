package org.gfg.utils;

import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LatLongForAddress {

    private String latitude;

    private String longitude;
}

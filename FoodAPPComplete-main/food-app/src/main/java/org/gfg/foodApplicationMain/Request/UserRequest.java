package org.gfg.foodApplicationMain.Request;

import lombok.*;
import org.gfg.foodApplicationMain.Model.User;

import javax.validation.constraints.NotBlank;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class UserRequest {

    private String name;

    private String password;
    @NotBlank
    private String email;
    @NotBlank
    private String phone;

    private String userType;

    private String address;

    public User toUser() {
        return  User.builder().
                name(this.name).
                email(this.email).
                password(this.password).
                userType(this.userType).
                address(this.address).
                phone(this.phone).
                build();
    }
}

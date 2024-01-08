package org.gfg.merchant;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {

    public Restaurant findByMerchantEmail(String email);
    public Restaurant findByRestName(String name);

}

package org.gfg.merchant;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuRepository extends JpaRepository<MenuItems, Integer> {
    List<MenuItems> findByRestaurantIdPk(Integer restaurantPk);
}

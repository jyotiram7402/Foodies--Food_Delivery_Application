package org.gfg.foodApplicationMain.Repository;

import org.gfg.foodApplicationMain.Model.OrderDetails;
import org.gfg.foodApplicationMain.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<OrderDetails, Integer> {
    List<OrderDetails> findByUser(User user);
}

package org.gfg.foodApplicationMain.Repository;

import org.gfg.foodApplicationMain.Model.OrderDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderDetails, Integer> {
}

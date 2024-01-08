package org.gfg.foodApplicationMain.Repository;

import org.gfg.foodApplicationMain.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    public User findByEmail(String email);
}

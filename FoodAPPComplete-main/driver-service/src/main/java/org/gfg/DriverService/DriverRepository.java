package org.gfg.DriverService;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverRepository extends JpaRepository<DriverDetails, Integer> {

    public DriverDetails findByPk(Integer pk);
}

package com.sitesurvey.auth.repository;

import com.sitesurvey.auth.entity.Space;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpaceRepository extends JpaRepository<Space, Long> {

    List<Space> findByFloorId(Long floorId);
}

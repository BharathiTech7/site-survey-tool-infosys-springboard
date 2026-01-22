package com.sitesurvey.auth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sitesurvey.auth.entity.Building;

public interface BuildingRepository extends JpaRepository<Building, Long> {

    List<Building> findByPropertyId(Long propertyId);
}

package com.sitesurvey.auth.repository;

import com.sitesurvey.auth.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyRepository extends JpaRepository<Property, Long> {
}

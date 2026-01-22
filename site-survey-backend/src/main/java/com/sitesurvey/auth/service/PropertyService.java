package com.sitesurvey.auth.service;

import com.sitesurvey.auth.entity.Property;
import com.sitesurvey.auth.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }
    
    public Property updateProperty(Long id, Property updatedProperty) {

        Property existingProperty = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        existingProperty.setName(updatedProperty.getName());
        existingProperty.setAddress(updatedProperty.getAddress());
        existingProperty.setType(updatedProperty.getType());

        return propertyRepository.save(existingProperty);
    }
    
    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }


}

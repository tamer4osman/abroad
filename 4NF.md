# Fourth Normal Form (4NF) Database Schema
# Libyan Foreign Ministry Management System

**Document Version:** 1.0  
**Date:** April 15, 2025  
**Status:** Draft  
**Prepared by:** Database Architecture Team

## Introduction

This document defines the Fourth Normal Form (4NF) database schema for the Libyan Foreign Ministry Management System, building upon the Boyce-Codd Normal Form (BCNF) design. The 4NF schema ensures that:

1. All requirements of BCNF are met
2. All non-trivial multi-valued dependencies have been eliminated
3. No relation contains two or more independent multi-valued facts about an entity

Fourth Normal Form addresses problems with multi-valued dependencies where multiple independent attributes may depend on the primary key but are not dependent on each other. This helps in further reducing redundancy and improving data integrity.

## Multi-valued Dependencies and 4NF Violations

In reviewing the BCNF schema, we identified the following potential 4NF violations (multi-valued dependencies) that need to be addressed:

### 1. User Skills and Language Proficiencies

In the current design, a user's skills and language proficiencies are maintained in separate tables. However, these tables might still violate 4NF if we combined multiple attributes about a user (such as skills and certifications) in a single table.

### 2. Citizen Document Types

Citizens may have multiple document types, and each document type may have multiple statuses. Storing these in a single table would violate 4NF if not properly structured.

### 3. Embassy Service Offerings

Each embassy offers multiple service types, and each service has multiple associated fees. This relationship needs careful modeling to avoid 4NF violations.

### 4. User Role Permissions

Users have roles, and roles have permissions. This many-to-many relationship must be properly normalized to ensure 4NF compliance.

## 4NF Refinements

The following adjustments have been made to ensure full 4NF compliance:

### 1. User Qualifications Refinement

To properly separate independent multi-valued facts about users, we've refined the user qualification tables:

#### Current Structure (Potential 4NF Violation):
```
user_qualifications (
    qualification_id INT PRIMARY KEY,
    user_id INT,
    skill_name VARCHAR(100),
    language_name VARCHAR(100),
    certification_name VARCHAR(100)
    -- Multiple independent facts about a user in one table
)
```

#### 4NF Solution:
```
user_skills (
    skill_id INT PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50),
    acquired_date DATE,
    UNIQUE(user_id, skill_name)
)

user_languages (
    language_id INT PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    language_id INT NOT NULL REFERENCES languages(language_id),
    proficiency_level VARCHAR(50) NOT NULL, -- reading, writing, speaking levels
    certified BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(user_id, language_id)
)

user_certifications (
    certification_id INT PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    certification_name VARCHAR(100) NOT NULL,
    issuing_authority VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    certification_file VARCHAR(255),
    UNIQUE(user_id, certification_name, issuing_authority)
)
```

### 2. Citizen Contact Information Refinement

Citizens may have multiple phone numbers, email addresses, and physical addresses, each independent of the others:

#### 4NF Solution:
```
citizen_phone_numbers (
    phone_id INT PRIMARY KEY,
    citizen_id INT NOT NULL REFERENCES citizens(citizen_id),
    phone_number VARCHAR(50) NOT NULL,
    phone_type VARCHAR(20) NOT NULL, -- mobile, home, work
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(citizen_id, phone_number)
)

citizen_email_addresses (
    email_id INT PRIMARY KEY,
    citizen_id INT NOT NULL REFERENCES citizens(citizen_id),
    email_address VARCHAR(100) NOT NULL,
    email_type VARCHAR(20) NOT NULL, -- personal, work
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(citizen_id, email_address)
)

citizen_physical_addresses (
    address_id INT PRIMARY KEY,
    citizen_id INT NOT NULL REFERENCES citizens(citizen_id),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city_id INT NOT NULL REFERENCES cities(city_id),
    region VARCHAR(100),
    country_id INT NOT NULL REFERENCES countries(country_id),
    postal_code VARCHAR(20),
    address_type VARCHAR(20) NOT NULL, -- home, work, temporary
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### 3. Embassy Service Offerings Refinement

#### Current Structure (Potential 4NF Violation):
```
embassy_services (
    embassy_service_id INT PRIMARY KEY,
    embassy_id INT REFERENCES embassies(embassy_id),
    service_type_id INT REFERENCES service_types(service_type_id),
    fee_amount DECIMAL(10,2),
    processing_time VARCHAR(50)
    -- Mixing service offerings with fee information violates 4NF
)
```

#### 4NF Solution:
```
embassy_service_offerings (
    offering_id INT PRIMARY KEY,
    embassy_id INT NOT NULL REFERENCES embassies(embassy_id),
    service_type_id INT NOT NULL REFERENCES service_types(service_type_id),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    availability_notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(embassy_id, service_type_id)
)

embassy_service_processing_times (
    processing_id INT PRIMARY KEY,
    offering_id INT NOT NULL REFERENCES embassy_service_offerings(offering_id),
    processing_type_id INT NOT NULL REFERENCES processing_types(processing_type_id),
    estimated_days INT NOT NULL,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(offering_id, processing_type_id)
)

embassy_service_fees (
    fee_id INT PRIMARY KEY,
    offering_id INT NOT NULL REFERENCES embassy_service_offerings(offering_id),
    fee_type_id INT NOT NULL REFERENCES fee_types(fee_type_id),
    fee_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'LYD',
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### 4. Passport Stamps and Visas Refinement

A passport can have multiple stamps and visas which are independent multi-valued facts:

#### 4NF Solution:
```
passport_stamps (
    stamp_id INT PRIMARY KEY,
    passport_id INT NOT NULL REFERENCES passports(passport_id),
    country_id INT NOT NULL REFERENCES countries(country_id),
    stamp_type VARCHAR(50) NOT NULL, -- entry, exit
    stamp_date DATE NOT NULL,
    port_of_entry VARCHAR(255),
    stamp_image VARCHAR(255),
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)

passport_visas (
    visa_id INT PRIMARY KEY,
    passport_id INT NOT NULL REFERENCES passports(passport_id),
    issuing_country_id INT NOT NULL REFERENCES countries(country_id),
    visa_type VARCHAR(50) NOT NULL,
    visa_number VARCHAR(100) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    number_of_entries VARCHAR(20) NOT NULL, -- single, double, multiple
    visa_image VARCHAR(255),
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

### 5. Document Requirements Refinement

Service types require different document types, and document types have different verification requirements, which are independent multi-valued facts:

#### 4NF Solution:
```
service_document_requirements (
    requirement_id INT PRIMARY KEY,
    service_type_id INT NOT NULL REFERENCES service_types(service_type_id),
    document_type_id INT NOT NULL REFERENCES document_types(document_type_id),
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(service_type_id, document_type_id)
)

document_verification_requirements (
    verification_req_id INT PRIMARY KEY,
    document_type_id INT NOT NULL REFERENCES document_types(document_type_id),
    verification_type_id INT NOT NULL REFERENCES verification_types(verification_type_id),
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    verification_procedure TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(document_type_id, verification_type_id)
)
```

### 6. Application Extra Information Refinement

Applications may require various independent additional information items:

#### 4NF Solution:
```
application_extra_information_types (
    info_type_id INT PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    data_type VARCHAR(50) NOT NULL, -- text, date, number, boolean
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
)

application_type_info_requirements (
    requirement_id INT PRIMARY KEY,
    application_type_id INT NOT NULL REFERENCES application_types(type_id),
    info_type_id INT NOT NULL REFERENCES application_extra_information_types(info_type_id),
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(application_type_id, info_type_id)
)

application_extra_information (
    entry_id INT PRIMARY KEY,
    application_id INT NOT NULL REFERENCES passport_applications(application_id),
    info_type_id INT NOT NULL REFERENCES application_extra_information_types(info_type_id),
    text_value TEXT,
    date_value DATE,
    number_value DECIMAL(18,2),
    boolean_value BOOLEAN,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(application_id, info_type_id)
)
```

### 7. Working Hours Refinement

Working hours involve multi-valued dependencies between embassy, day, service type, and appointment slots:

#### 4NF Solution:
```
embassy_working_hours (
    working_hours_id INT PRIMARY KEY,
    embassy_id INT NOT NULL REFERENCES embassies(embassy_id),
    day_of_week TINYINT NOT NULL, -- 0-6, Sunday-Saturday
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(embassy_id, day_of_week)
)

embassy_service_hours (
    service_hours_id INT PRIMARY KEY,
    embassy_id INT NOT NULL REFERENCES embassies(embassy_id),
    service_type_id INT NOT NULL REFERENCES service_types(service_type_id),
    day_of_week TINYINT NOT NULL, -- 0-6, Sunday-Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_appointments INT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(embassy_id, service_type_id, day_of_week)
)

embassy_appointment_slots (
    slot_id INT PRIMARY KEY,
    embassy_id INT NOT NULL REFERENCES embassies(embassy_id),
    service_type_id INT NOT NULL REFERENCES service_types(service_type_id),
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_appointments INT NOT NULL,
    available_appointments INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(embassy_id, service_type_id, appointment_date, start_time)
)
```

## Additional 4NF Refinements

### 8. Legal Proxy Authorities and Restrictions

A legal proxy can grant multiple independent authorities and have multiple restrictions:

#### 4NF Solution:
```
proxy_authority_types (
    authority_type_id INT PRIMARY KEY,
    authority_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
)

proxy_authorities (
    authority_id INT PRIMARY KEY,
    proxy_id INT NOT NULL REFERENCES proxies(proxy_id),
    authority_type_id INT NOT NULL REFERENCES proxy_authority_types(authority_type_id),
    scope_description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(proxy_id, authority_type_id)
)

proxy_restriction_types (
    restriction_type_id INT PRIMARY KEY,
    restriction_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
)

proxy_restrictions (
    restriction_id INT PRIMARY KEY,
    proxy_id INT NOT NULL REFERENCES proxies(proxy_id),
    restriction_type_id INT NOT NULL REFERENCES proxy_restriction_types(restriction_type_id),
    restriction_details TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(proxy_id, restriction_type_id)
)
```

### 9. Document Attestation Requirements and Stamps

Document attestations require different stamps and verifications which are independent multi-valued facts:

#### 4NF Solution:
```
attestation_stamp_types (
    stamp_type_id INT PRIMARY KEY,
    stamp_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_path VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
)

attestation_stamps (
    stamp_id INT PRIMARY KEY,
    attestation_id INT NOT NULL REFERENCES document_attestations(attestation_id),
    stamp_type_id INT NOT NULL REFERENCES attestation_stamp_types(stamp_type_id),
    applied_by INT NOT NULL REFERENCES users(user_id),
    applied_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    stamp_location VARCHAR(100),
    notes TEXT,
    UNIQUE(attestation_id, stamp_type_id)
)

attestation_verification_types (
    verification_type_id INT PRIMARY KEY,
    verification_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
)

attestation_verifications (
    verification_id INT PRIMARY KEY,
    attestation_id INT NOT NULL REFERENCES document_attestations(attestation_id),
    verification_type_id INT NOT NULL REFERENCES attestation_verification_types(verification_type_id),
    verified_by INT NOT NULL REFERENCES users(user_id),
    verification_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verification_result BOOLEAN NOT NULL,
    notes TEXT,
    UNIQUE(attestation_id, verification_type_id)
)
```

## Complete 4NF Schema

The complete 4NF schema includes all of the tables defined in the BCNF schema, with the refinements listed above to address multi-valued dependencies. The restructuring ensures that no relation contains two or more independent multi-valued facts about an entity.

## Benefits of 4NF Design

The 4NF schema offers several advantages over the BCNF schema:

1. **Elimination of Multi-valued Dependencies**
   - Independent facts about entities are stored in separate relations
   - No redundant combinations of values across independent attributes

2. **Improved Data Integrity**
   - Cleaner separation of concerns between different types of data
   - Reduced risk of update anomalies due to multi-valued dependencies

3. **Simplified Maintenance**
   - Adding a new multi-valued attribute doesn't affect existing attributes
   - Table structure more closely matches the conceptual relationships

4. **More Flexible Data Access**
   - Independent attributes can be queried separately or joined as needed
   - Easier to implement changes to one attribute without affecting others

5. **Better Support for Business Rules**
   - Clear separation of independent business concepts
   - Easier to enforce rules specific to each attribute

## Implementation Considerations

When implementing the 4NF schema, consider the following:

1. **Performance Optimization**
   - The increased number of tables may require more joins in queries
   - Properly indexing foreign keys is essential for performance
   - Consider denormalization strategies for read-heavy operations (as outlined in the denormalization strategy document)

2. **Cascading Operations**
   - Implement appropriate cascading operations (UPDATE, DELETE) on foreign keys
   - Ensure referential integrity across the separated tables

3. **Application Layer Implications**
   - Update data access layer to handle the more granular table structure
   - Consider implementing repository patterns to abstract the complexity

4. **Migration Strategy**
   - Plan a phased migration from BCNF to 4NF
   - Use temporary tables to restructure data during migration
   - Validate data integrity after each migration step

## Conclusion

The Fourth Normal Form (4NF) schema presented in this document builds upon the BCNF schema by eliminating multi-valued dependencies. This further refinement reduces redundancy, improves data integrity, and provides a solid foundation for the Libyan Foreign Ministry Management System.

By separating independent multi-valued facts about entities into distinct relations, the 4NF schema offers greater flexibility, simplified maintenance, and better support for evolving business requirements. While this may introduce additional complexity in the form of more tables and joins, the benefits in terms of data integrity and reduced anomalies outweigh these considerations.

For performance-critical operations where the normalized structure might introduce overhead, selective denormalization strategies (as outlined in the denormalization strategy document) can be applied without compromising the fundamental integrity benefits of the 4NF design.
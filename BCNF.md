# Boyce-Codd Normal Form (BCNF) Database Schema
# Libyan Foreign Ministry Management System

**Document Version:** 1.0  
**Date:** April 15, 2025  
**Status:** Draft  
**Prepared by:** Database Architecture Team

## Introduction

This document defines the Boyce-Codd Normal Form (BCNF) database schema for the Libyan Foreign Ministry Management System, building upon the Third Normal Form (3NF) design. The BCNF schema ensures that:

1. All requirements of Third Normal Form (3NF) are met
2. For every non-trivial functional dependency X → Y, X is a superkey of the relation
3. All redundancy based on functional dependencies is eliminated

## BCNF Refinements

The 3NF schema already meets many BCNF requirements, but the following adjustments have been made to ensure full BCNF compliance:

### 1. Refining User Role Assignments

In 3NF, the `user_roles` table has a potential BCNF violation due to the functional dependency:
- `(user_id, role_id)` → `embassy_id`
- But also possibly `user_id` → `embassy_id` (when users are assigned to a single embassy)

#### BCNF Solution:
```
user_embassies (
    user_embassy_id INT PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    embassy_id INT NOT NULL REFERENCES embassies(embassy_id),
    assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, embassy_id)
)

user_roles (
    user_role_id INT PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    role_id INT NOT NULL REFERENCES roles(role_id),
    assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id)
)
```

### 2. Refining Document Verification

The document verification process showed potential BCNF violations where verification status might be dependent on non-key attributes:

#### BCNF Solution:
```
verification_statuses (
    status_id INT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL
)

document_verifications (
    verification_id INT PRIMARY KEY,
    document_id INT NOT NULL REFERENCES citizen_documents(document_id),
    status_id INT NOT NULL REFERENCES verification_statuses(status_id),
    verified_by INT NULL REFERENCES users(user_id),
    verification_date DATETIME NULL,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### 3. Resolving Multiple Functional Dependencies in Passport Applications

The passport_applications table had multiple potential functional dependencies:

#### BCNF Solution:
```
application_statuses (
    status_id INT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
)

application_types (
    type_id INT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
)

processing_types (
    processing_type_id INT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
)

passport_applications (
    application_id INT PRIMARY KEY,
    citizen_id INT NOT NULL REFERENCES citizens(citizen_id),
    application_type_id INT NOT NULL REFERENCES application_types(type_id),
    application_reason TEXT NULL,
    application_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processing_type_id INT NOT NULL REFERENCES processing_types(processing_type_id),
    embassy_id INT NOT NULL REFERENCES embassies(embassy_id),
    assigned_to INT NULL REFERENCES users(user_id),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

application_status_history (
    history_id INT PRIMARY KEY,
    application_id INT NOT NULL REFERENCES passport_applications(application_id),
    status_id INT NOT NULL REFERENCES application_statuses(status_id),
    status_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by INT NOT NULL REFERENCES users(user_id),
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)

application_approvals (
    approval_id INT PRIMARY KEY,
    application_id INT NOT NULL REFERENCES passport_applications(application_id),
    approved_by INT NOT NULL REFERENCES users(user_id),
    approval_date DATETIME NOT NULL,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)

application_rejections (
    rejection_id INT PRIMARY KEY,
    application_id INT NOT NULL REFERENCES passport_applications(application_id),
    rejected_by INT NOT NULL REFERENCES users(user_id),
    rejection_date DATETIME NOT NULL,
    rejection_reason TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

### 4. Separating Payment Information

The payment information mixed with application status created BCNF violations:

#### BCNF Solution:
```
payment_statuses (
    status_id INT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL
)

payment_methods (
    method_id INT PRIMARY KEY,
    method_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
)

fee_payments (
    payment_id INT PRIMARY KEY,
    service_type_id INT NOT NULL REFERENCES service_types(service_type_id),
    reference_id INT NOT NULL,  -- ID of the application/request
    fee_amount DECIMAL(10,2) NOT NULL,
    payment_status_id INT NOT NULL REFERENCES payment_statuses(status_id),
    payment_method_id INT NULL REFERENCES payment_methods(method_id),
    receipt_number VARCHAR(100) NULL,
    payment_date DATETIME NULL,
    received_by INT NULL REFERENCES users(user_id),
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(service_type_id, reference_id)  -- Each service request has one primary payment record
)
```

### 5. Refining Relationship Tables

Some relationship tables had potential BCNF violations due to functional dependencies between attributes:

#### BCNF Solution for Marriage Witnesses:
```
witness_id_types (
    id_type_id INT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
)

marriage_witnesses (
    witness_id INT PRIMARY KEY,
    marriage_id INT NOT NULL REFERENCES marriage_registrations(marriage_id),
    witness_name VARCHAR(255) NOT NULL,
    id_type_id INT NOT NULL REFERENCES id_types(id_type_id),
    witness_id_number VARCHAR(100) NOT NULL,
    contact_info VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

### 6. Additional Service-Specific Type Tables

To ensure BCNF compliance across all services, we've added specific type tables:

#### BCNF Solution:
```
divorce_types (
    divorce_type_id INT PRIMARY KEY, 
    type_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
)

custody_types (
    custody_type_id INT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE, 
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
)

service_types (
    service_type_id INT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
)

party_roles (
    role_id INT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL
)
```

## Complete BCNF Schema

The following sections present the complete BCNF schema with all adjustments applied.

### Users and Authentication

#### Table: users
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| user_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| username | VARCHAR(50) | NOT NULL, UNIQUE | User login name |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| email | VARCHAR(100) | NOT NULL | User email address |
| first_name | VARCHAR(50) | NOT NULL | User's first name |
| last_name | VARCHAR(50) | NOT NULL | User's last name |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Account status |
| last_login | DATETIME | NULL | Last login timestamp |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: roles
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| role_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| role_name | VARCHAR(50) | NOT NULL, UNIQUE | Name of role |
| description | TEXT | NULL | Role description |

#### Table: user_embassies
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| user_embassy_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| user_id | INT | NOT NULL, FOREIGN KEY (users.user_id) | Reference to user |
| embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Reference to embassy |
| assigned_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Assignment timestamp |
| UNIQUE | (user_id, embassy_id) | | Prevents duplicate assignments |

#### Table: user_roles
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| user_role_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| user_id | INT | NOT NULL, FOREIGN KEY (users.user_id) | Reference to user |
| role_id | INT | NOT NULL, FOREIGN KEY (roles.role_id) | Reference to role |
| assigned_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Assignment timestamp |
| UNIQUE | (user_id, role_id) | | Prevents duplicate assignments |

#### Table: permissions
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| permission_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| permission_name | VARCHAR(50) | NOT NULL, UNIQUE | Permission name |
| description | TEXT | NULL | Permission description |

#### Table: role_permissions
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| role_permission_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| role_id | INT | NOT NULL, FOREIGN KEY (roles.role_id) | Reference to role |
| permission_id | INT | NOT NULL, FOREIGN KEY (permissions.permission_id) | Reference to permission |
| UNIQUE | (role_id, permission_id) | | Prevents duplicate permissions |

#### Table: auth_logs
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| log_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| user_id | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who performed action |
| action | VARCHAR(50) | NOT NULL | Action performed |
| ip_address | VARCHAR(50) | NOT NULL | User's IP address |
| timestamp | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Action timestamp |
| details | TEXT | NULL | Additional details |

### Embassies and Locations

#### Table: countries
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| country_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| country_name_en | VARCHAR(100) | NOT NULL, UNIQUE | English country name |
| country_name_ar | VARCHAR(100) | NOT NULL | Arabic country name |
| iso_code | CHAR(2) | NOT NULL, UNIQUE | ISO country code |
| calling_code | VARCHAR(10) | NULL | International calling code |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: cities
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| city_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| city_name_en | VARCHAR(100) | NOT NULL | English city name |
| city_name_ar | VARCHAR(100) | NULL | Arabic city name |
| country_id | INT | NOT NULL, FOREIGN KEY (countries.country_id) | Reference to country |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |
| UNIQUE | (city_name_en, country_id) | | Prevents duplicate cities |

#### Table: embassies
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| embassy_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(100) | NOT NULL | Embassy name |
| country_id | INT | NOT NULL, FOREIGN KEY (countries.country_id) | Host country |
| city_id | INT | NOT NULL, FOREIGN KEY (cities.city_id) | Host city |
| address | TEXT | NOT NULL | Physical address |
| phone | VARCHAR(50) | NULL | Contact phone |
| email | VARCHAR(100) | NULL | Contact email |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |
| timezone | VARCHAR(50) | NOT NULL | Local timezone |

#### Table: working_hours
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| working_hours_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Reference to embassy |
| day_of_week | TINYINT | NOT NULL | Day (0-6, Sunday-Saturday) |
| open_time | TIME | NOT NULL | Opening time |
| close_time | TIME | NOT NULL | Closing time |
| is_closed | BOOLEAN | NOT NULL, DEFAULT FALSE | Whether closed on this day |
| UNIQUE | (embassy_id, day_of_week) | | One entry per day per embassy |

### Citizens and Civil Registry

#### Table: id_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| id_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: marital_statuses
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| status_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| status_name | VARCHAR(50) | NOT NULL, UNIQUE | Status name |
| description | TEXT | NULL | Description |

#### Table: citizens
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| citizen_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| national_id | VARCHAR(20) | NOT NULL, UNIQUE | Libyan national ID |
| first_name_ar | VARCHAR(100) | NOT NULL | First name in Arabic |
| last_name_ar | VARCHAR(100) | NOT NULL | Last name in Arabic |
| first_name_en | VARCHAR(100) | NOT NULL | First name in English |
| last_name_en | VARCHAR(100) | NOT NULL | Last name in English |
| father_name | VARCHAR(100) | NOT NULL | Father's name |
| mother_name | VARCHAR(100) | NOT NULL | Mother's name |
| gender | CHAR(1) | NOT NULL | Gender (M/F) |
| date_of_birth | DATE | NOT NULL | Date of birth (Gregorian) |
| date_of_birth_hijri | VARCHAR(20) | NULL | Date of birth (Hijri) |
| place_of_birth_city_id | INT | NOT NULL, FOREIGN KEY (cities.city_id) | Place of birth |
| marital_status_id | INT | NOT NULL, FOREIGN KEY (marital_statuses.status_id) | Marital status |
| occupation | VARCHAR(100) | NULL | Occupation |
| is_alive | BOOLEAN | NOT NULL, DEFAULT TRUE | Alive status |
| registration_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Registration date |
| last_updated | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update date |

#### Table: citizen_contact_info
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| contact_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to citizen |
| address_line1 | VARCHAR(255) | NOT NULL | Address line 1 |
| address_line2 | VARCHAR(255) | NULL | Address line 2 |
| city_id | INT | NOT NULL, FOREIGN KEY (cities.city_id) | City reference |
| region | VARCHAR(100) | NULL | State/province/region |
| country_id | INT | NOT NULL, FOREIGN KEY (countries.country_id) | Country reference |
| postal_code | VARCHAR(20) | NULL | Postal/ZIP code |
| email | VARCHAR(100) | NULL | Email address |
| phone | VARCHAR(50) | NOT NULL | Phone number |
| is_current | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether this is current address |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: document_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| document_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: verification_statuses
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| status_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| status_name | VARCHAR(50) | NOT NULL, UNIQUE | Status name |
| description | TEXT | NULL | Description |

#### Table: citizen_documents
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| document_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to citizen |
| document_type_id | INT | NOT NULL, FOREIGN KEY (document_types.document_type_id) | Type of document |
| document_number | VARCHAR(100) | NULL | Document reference number |
| issue_date | DATE | NULL | Issue date |
| expiry_date | DATE | NULL | Expiration date |
| issuing_authority | VARCHAR(255) | NULL | Authority that issued the document |
| document_file_path | VARCHAR(255) | NULL | Path to stored document file |
| uploaded_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who uploaded |
| notes | TEXT | NULL | Additional notes |
| upload_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Upload timestamp |

#### Table: document_verifications
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| verification_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| document_id | INT | NOT NULL, FOREIGN KEY (citizen_documents.document_id) | Reference to document |
| status_id | INT | NOT NULL, FOREIGN KEY (verification_statuses.status_id) | Verification status |
| verified_by | INT | NULL, FOREIGN KEY (users.user_id) | User who verified |
| verification_date | DATETIME | NULL | Date verified |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: relationship_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| relationship_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |

#### Table: family_relationships
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| relationship_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | First person |
| related_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Second person |
| relationship_type_id | INT | NOT NULL, FOREIGN KEY (relationship_types.relationship_type_id) | Type of relationship |
| start_date | DATE | NULL | Start date of relationship |
| end_date | DATE | NULL | End date of relationship |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether relationship is active |
| notes | TEXT | NULL | Additional information |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |
| UNIQUE | (citizen_id, related_citizen_id, relationship_type_id) | | Prevents duplicate relationships of the same type |

### Registration Statuses

#### Table: registration_statuses
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| status_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| status_name | VARCHAR(50) | NOT NULL, UNIQUE | Status name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

### Birth Registration

#### Table: birth_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| birth_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |

#### Table: birth_registrations
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| birth_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| child_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to child |
| father_citizen_id | INT | NULL, FOREIGN KEY (citizens.citizen_id) | Reference to father |
| mother_citizen_id | INT | NULL, FOREIGN KEY (citizens.citizen_id) | Reference to mother |
| date_of_birth | DATE | NOT NULL | Date of birth |
| time_of_birth | TIME | NULL | Time of birth |
| place_of_birth_city_id | INT | NOT NULL, FOREIGN KEY (cities.city_id) | Place of birth city |
| hospital_name | VARCHAR(255) | NULL | Hospital/facility name |
| birth_certificate_number | VARCHAR(100) | NULL | Certificate number |
| birth_certificate_file | VARCHAR(255) | NULL | Path to certificate scan |
| registry_number | VARCHAR(50) | NULL | Official registry number |
| registration_date | DATETIME | NOT NULL | Date of registration |
| registered_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who registered |
| status_id | INT | NOT NULL, FOREIGN KEY (registration_statuses.status_id) | Registration status |
| embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy where registered |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: birth_witnesses
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| witness_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| birth_id | INT | NOT NULL, FOREIGN KEY (birth_registrations.birth_id) | Reference to birth registration |
| witness_name | VARCHAR(255) | NOT NULL | Name of witness |
| id_type_id | INT | NOT NULL, FOREIGN KEY (id_types.id_type_id) | Type of ID provided |
| witness_id_number | VARCHAR(100) | NOT NULL | ID document number |
| relationship_to_child | VARCHAR(100) | NOT NULL | Relationship to child |
| contact_info | VARCHAR(255) | NULL | Contact information |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### Table: birth_medical_info
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| medical_info_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| birth_id | INT | NOT NULL, FOREIGN KEY (birth_registrations.birth_id) | Reference to birth |
| birth_weight | DECIMAL(5,2) | NULL | Birth weight in kg |
| birth_height | DECIMAL(5,2) | NULL | Birth height in cm |
| birth_type_id | INT | NULL, FOREIGN KEY (birth_types.birth_type_id) | Type of birth |
| attending_physician | VARCHAR(255) | NULL | Name of attending physician |
| medical_notes | TEXT | NULL | Additional medical notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Marriage Registration

#### Table: marriage_registrations
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| marriage_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| husband_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to husband |
| wife_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to wife |
| marriage_date | DATE | NOT NULL | Date of marriage (Gregorian) |
| marriage_date_hijri | VARCHAR(20) | NULL | Date of marriage (Hijri) |
| marriage_location_city_id | INT | NOT NULL, FOREIGN KEY (cities.city_id) | Location of marriage |
| certificate_number | VARCHAR(100) | NULL | Marriage certificate number |
| certificate_file | VARCHAR(255) | NULL | Path to certificate scan |
| issuing_authority | VARCHAR(255) | NOT NULL | Authority that issued the certificate |
| registration_date | DATETIME | NOT NULL | Date of registration |
| registered_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who registered |
| status_id | INT | NOT NULL, FOREIGN KEY (registration_statuses.status_id) | Registration status |
| embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy where registered |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: marriage_witnesses
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| witness_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| marriage_id | INT | NOT NULL, FOREIGN KEY (marriage_registrations.marriage_id) | Reference to marriage |
| witness_name | VARCHAR(255) | NOT NULL | Name of witness |
| id_type_id | INT | NOT NULL, FOREIGN KEY (id_types.id_type_id) | Type of ID provided |
| witness_id_number | VARCHAR(100) | NOT NULL | ID document number |
| contact_info | VARCHAR(255) | NULL | Contact information |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### Divorce Registration

#### Table: divorce_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| divorce_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: divorce_registrations
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| divorce_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| marriage_id | INT | NOT NULL, FOREIGN KEY (marriage_registrations.marriage_id) | Reference to marriage |
| divorce_date | DATE | NOT NULL | Date of divorce (Gregorian) |
| divorce_date_hijri | VARCHAR(20) | NULL | Date of divorce (Hijri) |
| divorce_type_id | INT | NOT NULL, FOREIGN KEY (divorce_types.divorce_type_id) | Type of divorce |
| court_name | VARCHAR(255) | NULL | Name of court |
| case_number | VARCHAR(100) | NULL | Court case number |
| decree_number | VARCHAR(100) | NULL | Divorce decree number |
| decree_file | VARCHAR(255) | NULL | Path to decree document |
| registration_date | DATETIME | NOT NULL | Date of registration |
| registered_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who registered |
| status_id | INT | NOT NULL, FOREIGN KEY (registration_statuses.status_id) | Registration status |
| embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy where registered |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: party_roles
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| role_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| role_name | VARCHAR(50) | NOT NULL, UNIQUE | Role name |
| description | TEXT | NULL | Description |

#### Table: divorce_parties
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| party_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| divorce_id | INT | NOT NULL, FOREIGN KEY (divorce_registrations.divorce_id) | Reference to divorce |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to citizen |
| role_id | INT | NOT NULL, FOREIGN KEY (party_roles.role_id) | Role in divorce |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| UNIQUE | (divorce_id, citizen_id, role_id) | | Prevents duplicate roles |

#### Table: custody_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| custody_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: custody_arrangements
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| custody_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| divorce_id | INT | NOT NULL, FOREIGN KEY (divorce_registrations.divorce_id) | Reference to divorce |
| child_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to child |
| custody_type_id | INT | NOT NULL, FOREIGN KEY (custody_types.custody_type_id) | Type of custody |
| custody_notes | TEXT | NULL | Additional custody details |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |
| UNIQUE | (divorce_id, child_citizen_id) | | Prevents duplicate arrangements |

### Death Registration

#### Table: death_registrations
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| death_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to deceased |
| date_of_death | DATE | NOT NULL | Date of death |
| time_of_death | TIME | NULL | Time of death |
| place_of_death_city_id | INT | NOT NULL, FOREIGN KEY (cities.city_id) | Place of death |
| cause_of_death | VARCHAR(255) | NULL | Cause of death |
| death_certificate_number | VARCHAR(100) | NULL | Certificate number |
| death_certificate_file | VARCHAR(255) | NULL | Path to certificate scan |
| issuing_authority | VARCHAR(255) | NOT NULL | Authority that issued the certificate |
| registration_date | DATETIME | NOT NULL | Date of registration |
| registered_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who registered |
| status_id | INT | NOT NULL, FOREIGN KEY (registration_statuses.status_id) | Registration status |
| embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy where registered |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: death_informants
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| informant_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| death_id | INT | NOT NULL, FOREIGN KEY (death_registrations.death_id) | Reference to death registration |
| informant_name | VARCHAR(255) | NOT NULL | Name of informant |
| id_type_id | INT | NOT NULL, FOREIGN KEY (id_types.id_type_id) | Type of ID provided |
| informant_id_number | VARCHAR(100) | NOT NULL | ID document number |
| relationship_to_deceased | VARCHAR(100) | NOT NULL | Relationship to deceased |
| contact_info | VARCHAR(255) | NULL | Contact information |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### Passport Services

#### Table: passport_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| passport_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| validity_years | INT | NOT NULL | Default validity period in years |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: application_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: processing_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| processing_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: application_statuses
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| status_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| status_name | VARCHAR(50) | NOT NULL, UNIQUE | Status name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: passports
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| passport_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to citizen |
| passport_number | VARCHAR(20) | NOT NULL, UNIQUE | Passport number |
| passport_type_id | INT | NOT NULL, FOREIGN KEY (passport_types.passport_type_id) | Type of passport |
| issue_date | DATE | NOT NULL | Issue date |
| expiry_date | DATE | NOT NULL | Expiration date |
| issuing_embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy that issued |
| issued_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who issued |
| status_id | INT | NOT NULL, FOREIGN KEY (application_statuses.status_id) | Status of passport |
| previous_passport_id | INT | NULL, FOREIGN KEY (passports.passport_id) | Reference to previous passport |
| photo_file_path | VARCHAR(255) | NOT NULL | Path to passport photo |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: passport_applications
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| application_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to citizen |
| application_type_id | INT | NOT NULL, FOREIGN KEY (application_types.type_id) | Type of application |
| application_reason | TEXT | NULL | Reason for application |
| application_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date of application |
| processing_type_id | INT | NOT NULL, FOREIGN KEY (processing_types.processing_type_id) | Normal or expedited |
| embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy processing |
| assigned_to | INT | NULL, FOREIGN KEY (users.user_id) | User assigned to process |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: application_status_history
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| history_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| application_id | INT | NOT NULL, FOREIGN KEY (passport_applications.application_id) | Reference to application |
| status_id | INT | NOT NULL, FOREIGN KEY (application_statuses.status_id) | Status reference |
| status_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Status timestamp |
| updated_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who updated |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### Table: application_approvals
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| approval_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| application_id | INT | NOT NULL, FOREIGN KEY (passport_applications.application_id) | Reference to application |
| approved_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who approved |
| approval_date | DATETIME | NOT NULL | Date of approval |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| UNIQUE | (application_id) | | One approval per application |

#### Table: application_rejections
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| rejection_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| application_id | INT | NOT NULL, FOREIGN KEY (passport_applications.application_id) | Reference to application |
| rejected_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who rejected |
| rejection_date | DATETIME | NOT NULL | Date of rejection |
| rejection_reason | TEXT | NOT NULL | Reason if rejected |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| UNIQUE | (application_id) | | One rejection per application |

#### Table: travel_document_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| document_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| validity_days | INT | NOT NULL | Default validity in days |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: travel_documents
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| document_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to citizen |
| document_number | VARCHAR(50) | NOT NULL, UNIQUE | Document number |
| document_type_id | INT | NOT NULL, FOREIGN KEY (travel_document_types.document_type_id) | Type of travel document |
| issue_date | DATE | NOT NULL | Issue date |
| expiry_date | DATE | NOT NULL | Expiration date |
| reason_for_issuance | TEXT | NOT NULL | Reason for emergency document |
| issuing_embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy that issued |
| issued_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who issued |
| status_id | INT | NOT NULL, FOREIGN KEY (application_statuses.status_id) | Status of document |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: passport_children
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| entry_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| passport_id | INT | NOT NULL, FOREIGN KEY (passports.passport_id) | Reference to parent passport |
| child_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to child |
| added_date | DATE | NOT NULL | Date child was added |
| added_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who added child |
| status_id | INT | NOT NULL, FOREIGN KEY (application_statuses.status_id) | Status of child entry |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |
| UNIQUE | (passport_id, child_citizen_id) | | Prevents duplicate entries |

### Payment Systems

#### Table: service_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| service_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| category | VARCHAR(50) | NOT NULL | Service category |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: payment_statuses
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| status_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| status_name | VARCHAR(50) | NOT NULL, UNIQUE | Status name |
| description | TEXT | NULL | Description |

#### Table: payment_methods
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| method_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| method_name | VARCHAR(50) | NOT NULL, UNIQUE | Method name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: fee_structures
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| fee_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| service_type_id | INT | NOT NULL, FOREIGN KEY (service_types.service_type_id) | Type of service |
| fee_name | VARCHAR(255) | NOT NULL | Name of fee |
| fee_amount | DECIMAL(10,2) | NOT NULL | Amount of fee |
| currency | VARCHAR(3) | NOT NULL, DEFAULT 'LYD' | Currency code |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether fee is active |
| effective_from | DATE | NOT NULL | Start date of fee |
| effective_to | DATE | NULL | End date of fee |
| modified_by | INT | NULL, FOREIGN KEY (users.user_id) | Last modified by |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: fee_payments
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| payment_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| service_type_id | INT | NOT NULL, FOREIGN KEY (service_types.service_type_id) | Type of service |
| reference_id | INT | NOT NULL | ID of the application/request |
| fee_amount | DECIMAL(10,2) | NOT NULL | Fee amount |
| payment_status_id | INT | NOT NULL, FOREIGN KEY (payment_statuses.status_id) | Payment status |
| payment_method_id | INT | NULL, FOREIGN KEY (payment_methods.method_id) | Payment method |
| receipt_number | VARCHAR(100) | NULL | Receipt number |
| payment_date | DATETIME | NULL | Payment date |
| received_by | INT | NULL, FOREIGN KEY (users.user_id) | User who received payment |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |
| UNIQUE | (service_type_id, reference_id) | | One primary payment record per service request |

## Key BCNF Transformations

Below is a summary of the key BCNF transformations applied to the schema:

1. **Refined Relationship Between Users and Embassies**
   - Created a dedicated `user_embassies` table to represent the many-to-many relationship
   - Removed `embassy_id` from `user_roles` to eliminate functional dependency issues

2. **Separated Status and Type Information**
   - Created dedicated lookup tables for all status and type information
   - Ensured all reference tables have proper primary keys and unique constraints
   - Replaced string-based type and status fields with foreign keys to reference tables

3. **Normalized Payment Processing**
   - Separated payment information from application tables
   - Created a unified payment structure with references to various service types
   - Applied appropriate constraints to ensure data consistency and integrity

4. **Application Status History**
   - Separated status tracking from application tables
   - Created temporal status history tables to track lifecycle changes
   - Applied suitable constraints to maintain data integrity and history tracking

5. **Normalized Location Data**
   - Created dedicated countries and cities tables
   - Replaced string-based location fields with references to location tables
   - Applied appropriate constraints and indexes to optimize queries

6. **Document Verification Process**
   - Separated verification status and workflow from document storage
   - Created document verification tables with appropriate temporal tracking
   - Applied constraints to ensure proper verification workflow

## Benefits of BCNF Design

The BCNF schema offers several advantages over the 3NF schema:

1. **Elimination of Update Anomalies**
   - All non-trivial functional dependencies are now based on superkeys
   - Changes to reference data need to be made in only one place

2. **Improved Data Consistency**
   - Clear separation of concerns between different entity types
   - Strong referential integrity through foreign key constraints
   - Consistent approach to status tracking and history preservation

3. **Better Query Performance**
   - More focused tables with clear responsibilities
   - Reduced redundancy leading to smaller table sizes
   - More efficient indexing opportunities

4. **Enhanced Maintainability**
   - Clearer separation of concepts makes schema changes easier
   - Consistent patterns for relationships and references
   - Better foundation for application development

5. **Reduced Storage Requirements**
   - Elimination of data duplication
   - More compact representation of relationships
   - Better use of database resources

## Conclusion

The Boyce-Codd Normal Form (BCNF) schema presented in this document provides a highly normalized database design for the Libyan Foreign Ministry Management System. By addressing all functional dependencies and ensuring that each determinant is a superkey, the schema eliminates redundancy and potential update anomalies.

This design builds on the 3NF schema but further refines the structure to address specific functional dependencies that were not fully resolved in 3NF. The result is a robust, maintainable, and efficient database schema that provides a solid foundation for the application.

While this level of normalization may introduce additional joins in some queries, the benefits in terms of data integrity, consistency, and maintainability outweigh these considerations. For performance-critical operations, strategic denormalization can be applied as outlined in the separate denormalization strategy document.
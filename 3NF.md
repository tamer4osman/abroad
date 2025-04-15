# Third Normal Form (3NF) Database Schema
# Libyan Foreign Ministry Management System

**Document Version:** 1.0  
**Date:** April 15, 2025  
**Status:** Draft  
**Prepared by:** Database Architecture Team

## Introduction

This document defines the Third Normal Form (3NF) database schema for the Libyan Foreign Ministry Management System, building upon the First Normal Form (1NF) and Second Normal Form (2NF) designs. The schema ensures that:

1. All requirements of First Normal Form (1NF) are met
2. All requirements of Second Normal Form (2NF) are met
3. All non-key attributes are non-transitively dependent on the primary key, meaning there are no transitive dependencies
4. Any transitive dependencies have been removed by creating separate tables

Third Normal Form addresses the issue of transitive dependencies, which occur when a non-key attribute depends on another non-key attribute instead of depending directly on the primary key. By eliminating these transitive dependencies, we can reduce data redundancy and anomalies further.

## Core Entities and Tables

### Users and Authentication

The users and authentication tables already satisfy 3NF requirements as they use single-column primary keys, have no partial dependencies, and have no transitive dependencies:

#### Table: users
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| user_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each user |
| username | VARCHAR(50) | NOT NULL, UNIQUE | User login name |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| email | VARCHAR(100) | NOT NULL | User email address |
| first_name | VARCHAR(50) | NOT NULL | User's first name |
| last_name | VARCHAR(50) | NOT NULL | User's last name |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Account status |
| last_login | DATETIME | NULL | Last login timestamp |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: roles
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| role_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each role |
| role_name | VARCHAR(50) | NOT NULL, UNIQUE | Name of role |
| description | TEXT | NULL | Role description |

#### Table: user_roles
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| user_role_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for mapping |
| user_id | INT | NOT NULL, FOREIGN KEY (users.user_id) | Reference to user |
| role_id | INT | NOT NULL, FOREIGN KEY (roles.role_id) | Reference to role |
| embassy_id | INT | NULL, FOREIGN KEY (embassies.embassy_id) | Embassy assignment |
| assigned_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Assignment timestamp |

#### Table: permissions
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| permission_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for permission |
| permission_name | VARCHAR(50) | NOT NULL, UNIQUE | Permission name |
| description | TEXT | NULL | Permission description |

#### Table: role_permissions
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| role_permission_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for mapping |
| role_id | INT | NOT NULL, FOREIGN KEY (roles.role_id) | Reference to role |
| permission_id | INT | NOT NULL, FOREIGN KEY (permissions.permission_id) | Reference to permission |

#### Table: auth_logs
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| log_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for log entry |
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
| country_name | VARCHAR(100) | NOT NULL, UNIQUE | Country name |
| country_code | CHAR(2) | NOT NULL, UNIQUE | ISO country code |
| region | VARCHAR(100) | NOT NULL | Geographic region |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: cities
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| city_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| city_name | VARCHAR(100) | NOT NULL | City name |
| country_id | INT | NOT NULL, FOREIGN KEY (countries.country_id) | Reference to country |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: embassies
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| embassy_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| name | VARCHAR(100) | NOT NULL | Embassy/consulate name |
| city_id | INT | NOT NULL, FOREIGN KEY (cities.city_id) | Reference to city |
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

### Citizens and Civil Registry

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
| place_of_birth_id | INT | NULL, FOREIGN KEY (cities.city_id) | Place of birth reference |
| is_alive | BOOLEAN | NOT NULL, DEFAULT TRUE | Alive status |
| registration_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Registration date |
| last_updated | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update date |

#### Table: marital_statuses
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| marital_status_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| status_name | VARCHAR(50) | NOT NULL, UNIQUE | Status name |
| description | TEXT | NULL | Description |

#### Table: citizen_status
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| status_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to citizen |
| marital_status_id | INT | NOT NULL, FOREIGN KEY (marital_statuses.marital_status_id) | Current marital status |
| occupation | VARCHAR(100) | NULL | Current occupation |
| effective_date | DATE | NOT NULL | When status became effective |
| is_current | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether this is current status |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### Table: citizen_contact_info
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| contact_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to citizen |
| address_line1 | VARCHAR(255) | NOT NULL | Address line 1 |
| address_line2 | VARCHAR(255) | NULL | Address line 2 |
| city_id | INT | NOT NULL, FOREIGN KEY (cities.city_id) | Reference to city |
| region | VARCHAR(100) | NULL | State/province/region |
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
| verification_status_id | INT | NOT NULL, FOREIGN KEY (verification_statuses.status_id) | Verification status |
| uploaded_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who uploaded |
| notes | TEXT | NULL | Additional notes |
| upload_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Upload timestamp |

#### Table: relationship_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| relationship_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: family_relationships
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| relationship_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | First person in relationship |
| related_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Second person in relationship |
| relationship_type_id | INT | NOT NULL, FOREIGN KEY (relationship_types.relationship_type_id) | Type of relationship |
| start_date | DATE | NULL | Start date of relationship |
| end_date | DATE | NULL | End date of relationship (if applicable) |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether relationship is currently active |
| notes | TEXT | NULL | Additional information |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Birth Registration

#### Table: registration_statuses
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| status_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| status_name | VARCHAR(50) | NOT NULL, UNIQUE | Status name |
| description | TEXT | NULL | Description |

#### Table: birth_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| birth_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| birth_type_name | VARCHAR(50) | NOT NULL, UNIQUE | Name of birth type (natural, cesarean, etc.) |
| description | TEXT | NULL | Description of birth type |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether this type is active |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: birth_registrations
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| birth_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| child_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to child record |
| father_citizen_id | INT | NULL, FOREIGN KEY (citizens.citizen_id) | Reference to father's record |
| mother_citizen_id | INT | NULL, FOREIGN KEY (citizens.citizen_id) | Reference to mother's record |
| date_of_birth | DATE | NOT NULL | Date of birth |
| time_of_birth | TIME | NULL | Time of birth |
| place_of_birth_id | INT | NOT NULL, FOREIGN KEY (cities.city_id) | Place of birth reference |
| hospital_name | VARCHAR(255) | NULL | Hospital/facility name |
| birth_certificate_number | VARCHAR(100) | NULL | Original certificate number |
| birth_certificate_file | VARCHAR(255) | NULL | Path to certificate scan |
| registry_number | VARCHAR(50) | NULL | Official registry number |
| registration_date | DATETIME | NOT NULL | Date of registration |
| registered_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who registered the birth |
| status_id | INT | NOT NULL, FOREIGN KEY (registration_statuses.status_id) | Registration status |
| embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy where registered |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: id_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| id_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

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
| birth_id | INT | NOT NULL, FOREIGN KEY (birth_registrations.birth_id) | Reference to birth registration |
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
| husband_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to husband's record |
| wife_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to wife's record |
| marriage_date | DATE | NOT NULL | Date of marriage (Gregorian) |
| marriage_date_hijri | VARCHAR(20) | NULL | Date of marriage (Hijri) |
| marriage_location_id | INT | NOT NULL, FOREIGN KEY (cities.city_id) | Location of marriage |
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
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name (e.g., mutual consent, court-ordered) |
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
| role_name | VARCHAR(50) | NOT NULL, UNIQUE | Role name (e.g., petitioner, respondent) |
| description | TEXT | NULL | Description |

#### Table: divorce_parties
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| party_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| divorce_id | INT | NOT NULL, FOREIGN KEY (divorce_registrations.divorce_id) | Reference to divorce |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to citizen |
| role_id | INT | NOT NULL, FOREIGN KEY (party_roles.role_id) | Role in divorce |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### Table: custody_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| custody_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name (e.g., sole, joint, temporary) |
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

### Death Registration

#### Table: death_registrations
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| death_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to deceased |
| date_of_death | DATE | NOT NULL | Date of death |
| time_of_death | TIME | NULL | Time of death |
| place_of_death_id | INT | NOT NULL, FOREIGN KEY (cities.city_id) | Place of death reference |
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
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: passport_statuses
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
| issuing_embassy | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy that issued |
| issued_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who issued |
| status_id | INT | NOT NULL, FOREIGN KEY (passport_statuses.status_id) | Status of passport |
| previous_passport_id | INT | NULL, FOREIGN KEY (passports.passport_id) | Reference to previous passport |
| photo_file_path | VARCHAR(255) | NOT NULL | Path to passport photo |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: application_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| application_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
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

#### Table: passport_applications
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| application_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to citizen |
| application_type_id | INT | NOT NULL, FOREIGN KEY (application_types.application_type_id) | Type of application |
| application_reason | TEXT | NULL | Reason for application |
| application_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date of application |
| processing_type_id | INT | NOT NULL, FOREIGN KEY (processing_types.processing_type_id) | Normal or expedited |
| embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy processing |
| assigned_to | INT | NULL, FOREIGN KEY (users.user_id) | User assigned to process |
| approved_by | INT | NULL, FOREIGN KEY (users.user_id) | User who approved |
| approval_date | DATETIME | NULL | Date of approval |
| rejection_reason | TEXT | NULL | Reason if rejected |
| status_id | INT | NOT NULL, FOREIGN KEY (registration_statuses.status_id) | Application status |
| notes | TEXT | NULL | Additional notes |
| passport_id | INT | NULL, FOREIGN KEY (passports.passport_id) | Resulting passport if approved |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: payment_statuses
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| status_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| status_name | VARCHAR(50) | NOT NULL, UNIQUE | Status name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: currencies
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| currency_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| currency_code | VARCHAR(3) | NOT NULL, UNIQUE | ISO currency code |
| currency_name | VARCHAR(50) | NOT NULL | Currency name |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: fee_payments
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| payment_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| service_type | VARCHAR(50) | NOT NULL | Type of service |
| reference_id | INT | NOT NULL | ID of related application/service |
| fee_amount | DECIMAL(10,2) | NOT NULL | Fee amount |
| currency_id | INT | NOT NULL, FOREIGN KEY (currencies.currency_id) | Currency reference |
| payment_status_id | INT | NOT NULL, FOREIGN KEY (payment_statuses.status_id) | Payment status |
| receipt_number | VARCHAR(100) | NULL | Receipt number |
| payment_date | DATETIME | NULL | Date of payment |
| payment_method | VARCHAR(50) | NOT NULL | Method of payment |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Visa Processing

#### Table: visa_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| visa_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: entry_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| entry_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name (e.g., single, multiple) |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: visa_applications
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| application_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| first_name | VARCHAR(100) | NOT NULL | Applicant first name |
| last_name | VARCHAR(100) | NOT NULL | Applicant last name |
| nationality_country_id | INT | NOT NULL, FOREIGN KEY (countries.country_id) | Applicant nationality |
| passport_number | VARCHAR(50) | NOT NULL | Passport number |
| passport_issue_date | DATE | NOT NULL | Passport issue date |
| passport_expiry_date | DATE | NOT NULL | Passport expiry date |
| date_of_birth | DATE | NOT NULL | Date of birth |
| gender | CHAR(1) | NOT NULL | Gender (M/F) |
| visa_type_id | INT | NOT NULL, FOREIGN KEY (visa_types.visa_type_id) | Type of visa |
| visa_purpose | VARCHAR(255) | NOT NULL | Purpose of travel |
| entry_type_id | INT | NOT NULL, FOREIGN KEY (entry_types.entry_type_id) | Single or multiple entry |
| requested_duration | INT | NOT NULL | Requested stay duration (days) |
| processing_type_id | INT | NOT NULL, FOREIGN KEY (processing_types.processing_type_id) | Normal or expedited |
| application_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date of application |
| status_id | INT | NOT NULL, FOREIGN KEY (registration_statuses.status_id) | Application status |
| embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy processing the application |
| assigned_to | INT | NULL, FOREIGN KEY (users.user_id) | User assigned to process |
| approved_by | INT | NULL, FOREIGN KEY (users.user_id) | User who approved |
| approval_date | DATETIME | NULL | Date of approval |
| rejection_reason | TEXT | NULL | Reason if rejected |
| tracking_number | VARCHAR(50) | NOT NULL | Unique tracking number |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: visa_sponsors
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| sponsor_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| application_id | INT | NOT NULL, FOREIGN KEY (visa_applications.application_id) | Reference to visa application |
| sponsor_name | VARCHAR(255) | NOT NULL | Name of sponsor |
| relationship | VARCHAR(100) | NOT NULL | Relationship to applicant |
| address | TEXT | NOT NULL | Address in Libya |
| phone | VARCHAR(50) | NOT NULL | Phone number |
| email | VARCHAR(100) | NULL | Email address |
| id_type_id | INT | NOT NULL, FOREIGN KEY (id_types.id_type_id) | Type of ID provided |
| id_number | VARCHAR(100) | NOT NULL | ID number |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: visa_documents
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| document_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| application_id | INT | NOT NULL, FOREIGN KEY (visa_applications.application_id) | Reference to visa application |
| document_type_id | INT | NOT NULL, FOREIGN KEY (document_types.document_type_id) | Type of document |
| document_file_path | VARCHAR(255) | NOT NULL | Path to document file |
| verification_status_id | INT | NOT NULL, FOREIGN KEY (verification_statuses.status_id) | Verification status |
| notes | TEXT | NULL | Additional notes |
| uploaded_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Upload timestamp |

#### Table: issued_visas
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| visa_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| application_id | INT | NOT NULL, FOREIGN KEY (visa_applications.application_id) | Reference to visa application |
| visa_number | VARCHAR(50) | NOT NULL, UNIQUE | Visa number |
| issue_date | DATE | NOT NULL | Issue date |
| expiry_date | DATE | NOT NULL | Expiration date |
| entry_type_id | INT | NOT NULL, FOREIGN KEY (entry_types.entry_type_id) | Single or multiple entry |
| duration_of_stay | INT | NOT NULL | Allowed duration of stay (days) |
| issued_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who issued the visa |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Document Attestation

#### Table: attestation_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| attestation_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: attestation_requests
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| request_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| requestor_name | VARCHAR(255) | NOT NULL | Name of requestor |
| id_type_id | INT | NOT NULL, FOREIGN KEY (id_types.id_type_id) | Type of ID provided |
| requestor_id_number | VARCHAR(100) | NOT NULL | ID document number |
| contact_phone | VARCHAR(50) | NOT NULL | Contact phone |
| contact_email | VARCHAR(100) | NULL | Contact email |
| attestation_type_id | INT | NOT NULL, FOREIGN KEY (attestation_types.attestation_type_id) | Local or international |
| document_type_id | INT | NOT NULL, FOREIGN KEY (document_types.document_type_id) | Type of document |
| document_description | TEXT | NOT NULL | Description of document |
| target_country_id | INT | NULL, FOREIGN KEY (countries.country_id) | Target country (for international) |
| is_apostille | BOOLEAN | NOT NULL, DEFAULT FALSE | Requires Apostille certification |
| request_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date of request |
| status_id | INT | NOT NULL, FOREIGN KEY (registration_statuses.status_id) | Request status |
| embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy processing the request |
| assigned_to | INT | NULL, FOREIGN KEY (users.user_id) | User assigned to process |
| tracking_number | VARCHAR(50) | NOT NULL | Unique tracking number |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: attestation_documents
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| document_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| request_id | INT | NOT NULL, FOREIGN KEY (attestation_requests.request_id) | Reference to attestation request |
| original_document_file | VARCHAR(255) | NOT NULL | Path to original document file |
| attested_document_file | VARCHAR(255) | NULL | Path to attested document file |
| verification_status_id | INT | NOT NULL, FOREIGN KEY (verification_statuses.status_id) | Verification status |
| notes | TEXT | NULL | Additional notes |
| uploaded_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Upload timestamp |
| attested_at | DATETIME | NULL | Attestation timestamp |
| attested_by | INT | NULL, FOREIGN KEY (users.user_id) | User who attested document |

#### Table: attestation_steps
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| step_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| request_id | INT | NOT NULL, FOREIGN KEY (attestation_requests.request_id) | Reference to attestation request |
| step_name | VARCHAR(100) | NOT NULL | Name of step |
| step_order | INT | NOT NULL | Order in workflow |
| step_status_id | INT | NOT NULL, FOREIGN KEY (registration_statuses.status_id) | Status of step |
| completed_by | INT | NULL, FOREIGN KEY (users.user_id) | User who completed the step |
| completed_at | DATETIME | NULL | Completion timestamp |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Legal Proxy Module

#### Table: proxy_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| proxy_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: legal_proxies
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| proxy_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| proxy_type_id | INT | NOT NULL, FOREIGN KEY (proxy_types.proxy_type_id) | Type of proxy |
| grantor_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to grantor citizen |
| proxy_holder_name | VARCHAR(255) | NOT NULL | Name of proxy holder |
| id_type_id | INT | NOT NULL, FOREIGN KEY (id_types.id_type_id) | Type of ID provided |
| proxy_holder_id_number | VARCHAR(100) | NOT NULL | ID document number |
| proxy_purpose | TEXT | NOT NULL | Purpose of proxy |
| start_date | DATE | NOT NULL | Start date |
| end_date | DATE | NULL | End date (if applicable) |
| is_revocable | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether proxy can be revoked |
| authority_limitations | TEXT | NULL | Limitations on authority |
| status_id | INT | NOT NULL, FOREIGN KEY (registration_statuses.status_id) | Proxy status |
| verification_status_id | INT | NOT NULL, FOREIGN KEY (verification_statuses.status_id) | Verification status |
| embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy processing the proxy |
| approved_by | INT | NULL, FOREIGN KEY (users.user_id) | User who approved |
| approval_date | DATETIME | NULL | Date of approval |
| tracking_number | VARCHAR(50) | NOT NULL | Unique tracking number |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: proxy_documents
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| document_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| proxy_id | INT | NOT NULL, FOREIGN KEY (legal_proxies.proxy_id) | Reference to legal proxy |
| document_type_id | INT | NOT NULL, FOREIGN KEY (document_types.document_type_id) | Type of document |
| document_file_path | VARCHAR(255) | NOT NULL | Path to document file |
| verification_status_id | INT | NOT NULL, FOREIGN KEY (verification_statuses.status_id) | Verification status |
| notes | TEXT | NULL | Additional notes |
| uploaded_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Upload timestamp |

#### Table: activity_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| activity_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(100) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: proxy_activities
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| activity_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| proxy_id | INT | NOT NULL, FOREIGN KEY (legal_proxies.proxy_id) | Reference to legal proxy |
| activity_type_id | INT | NOT NULL, FOREIGN KEY (activity_types.activity_type_id) | Type of activity |
| activity_date | DATE | NOT NULL | Date of activity |
| activity_description | TEXT | NOT NULL | Description of activity |
| performed_by | VARCHAR(255) | NOT NULL | Person who performed the activity |
| verified_by | INT | NULL, FOREIGN KEY (users.user_id) | User who verified the activity |
| verification_date | DATETIME | NULL | Date of verification |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Notifications and Communications

#### Table: notification_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: notifications
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| notification_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| user_id | INT | NULL, FOREIGN KEY (users.user_id) | Target user (NULL for system-wide) |
| notification_type_id | INT | NOT NULL, FOREIGN KEY (notification_types.type_id) | Type of notification |
| subject | VARCHAR(255) | NOT NULL | Subject/title |
| message | TEXT | NOT NULL | Notification content |
| related_record_type | VARCHAR(50) | NULL | Type of related record |
| related_record_id | INT | NULL | ID of related record |
| is_read | BOOLEAN | NOT NULL, DEFAULT FALSE | Whether notification is read |
| read_at | DATETIME | NULL | When notification was read |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| expires_at | DATETIME | NULL | Expiration timestamp |

#### Table: email_logs
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| email_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| recipient_email | VARCHAR(255) | NOT NULL | Recipient email address |
| subject | VARCHAR(255) | NOT NULL | Email subject |
| message | TEXT | NOT NULL | Email body |
| related_record_type | VARCHAR(50) | NULL | Type of related record |
| related_record_id | INT | NULL | ID of related record |
| status_id | INT | NOT NULL, FOREIGN KEY (verification_statuses.status_id) | Email status |
| error_message | TEXT | NULL | Error message if failed |
| sent_at | DATETIME | NULL | When email was sent |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### System Configuration and Settings

#### Table: system_settings
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| setting_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| setting_key | VARCHAR(100) | NOT NULL, UNIQUE | Setting key |
| setting_value | TEXT | NULL | Setting value |
| setting_description | TEXT | NULL | Description of setting |
| modified_by | INT | NULL, FOREIGN KEY (users.user_id) | Last modified by |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: service_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| service_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(100) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: fee_structures
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| fee_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| service_type_id | INT | NOT NULL, FOREIGN KEY (service_types.service_type_id) | Type of service |
| fee_name | VARCHAR(255) | NOT NULL | Name of fee |
| fee_amount | DECIMAL(10,2) | NOT NULL | Amount of fee |
| currency_id | INT | NOT NULL, FOREIGN KEY (currencies.currency_id) | Currency reference |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether fee is active |
| effective_from | DATE | NOT NULL | Start date of fee |
| effective_to | DATE | NULL | End date of fee (if applicable) |
| modified_by | INT | NULL, FOREIGN KEY (users.user_id) | Last modified by |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Reporting and Analytics

#### Table: report_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| report_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Type name |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: report_templates
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| template_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| template_name | VARCHAR(255) | NOT NULL | Name of report template |
| template_description | TEXT | NULL | Description of report |
| report_type_id | INT | NOT NULL, FOREIGN KEY (report_types.report_type_id) | Type of report |
| template_query | TEXT | NOT NULL | Query or definition for report |
| is_system | BOOLEAN | NOT NULL, DEFAULT FALSE | Whether it's a system report |
| created_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who created the template |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether template is active |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: output_formats
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| format_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| format_name | VARCHAR(20) | NOT NULL, UNIQUE | Format name (PDF, Excel, etc.) |
| description | TEXT | NULL | Description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Status |

#### Table: execution_statuses
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| status_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| status_name | VARCHAR(50) | NOT NULL, UNIQUE | Status name |
| description | TEXT | NULL | Description |

#### Table: report_executions
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| execution_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| template_id | INT | NOT NULL, FOREIGN KEY (report_templates.template_id) | Reference to report template |
| executed_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who executed the report |
| parameters | TEXT | NULL | Parameters used for execution |
| start_date | DATETIME | NOT NULL | Execution start time |
| end_date | DATETIME | NULL | Execution end time |
| status_id | INT | NOT NULL, FOREIGN KEY (execution_statuses.status_id) | Execution status |
| output_format_id | INT | NOT NULL, FOREIGN KEY (output_formats.format_id) | Output format |
| result_file_path | VARCHAR(255) | NULL | Path to result file |
| error_message | TEXT | NULL | Error message if failed |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### Audit and Logging

#### Table: action_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| action_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| action_name | VARCHAR(50) | NOT NULL, UNIQUE | Action name |
| description | TEXT | NULL | Description |

#### Table: record_types
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| record_type_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| type_name | VARCHAR(50) | NOT NULL, UNIQUE | Record type name |
| description | TEXT | NULL | Description |

#### Table: audit_logs
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| log_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| user_id | INT | NULL, FOREIGN KEY (users.user_id) | User who performed action |
| action_type_id | INT | NOT NULL, FOREIGN KEY (action_types.action_type_id) | Action performed |
| record_type_id | INT | NOT NULL, FOREIGN KEY (record_types.record_type_id) | Type of affected record |
| record_id | INT | NULL | ID of affected record |
| old_values | TEXT | NULL | Previous values (JSON) |
| new_values | TEXT | NULL | New values (JSON) |
| ip_address | VARCHAR(50) | NOT NULL | User's IP address |
| user_agent | VARCHAR(255) | NULL | User agent information |
| timestamp | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Action timestamp |
| embassy_id | INT | NULL, FOREIGN KEY (embassies.embassy_id) | Embassy where action occurred |
| additional_info | TEXT | NULL | Additional context information |

#### Table: log_levels
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| level_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| level_name | VARCHAR(20) | NOT NULL, UNIQUE | Level name (INFO, WARNING, ERROR, etc.) |
| description | TEXT | NULL | Description |

#### Table: system_logs
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| log_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| log_level_id | INT | NOT NULL, FOREIGN KEY (log_levels.level_id) | Log level |
| log_message | TEXT | NOT NULL | Log message |
| source | VARCHAR(255) | NOT NULL | Source of log |
| exception | TEXT | NULL | Exception details |
| timestamp | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Log timestamp |
| additional_info | TEXT | NULL | Additional context information |

## Third Normal Form Transformations

To achieve 3NF, the following major transformations were made to the 2NF schema:

1. **Created lookup tables** for all enumerated types that were previously stored as strings:
   - countries, cities (replacing direct country/city string storage)
   - marital_statuses (replacing marital_status string in citizens)
   - document_types (replacing document_type string in documents tables)
   - id_types (replacing id_type strings in various tables)
   - verification_statuses (replacing verification_status strings)
   - registration_statuses (replacing status strings)
   - passport_types, passport_statuses (replacing passport type/status strings)
   - application_types, processing_types (replacing application type/processing strings)
   - payment_statuses, currencies (replacing payment status/currency strings)
   - visa_types, entry_types (replacing visa type/entry type strings)
   - attestation_types (replacing attestation type strings)
   - proxy_types (replacing proxy type strings)
   - activity_types (replacing activity type strings)
   - birth_types, custody_types, divorce_types (replacing respective type strings)
   - party_roles, relationship_types (replacing role/relationship strings)
   - notification_types, service_types (replacing respective type strings)
   - report_types, output_formats, execution_statuses (replacing respective strings)
   - action_types, record_types, log_levels (replacing respective string values)

2. **Normalized location data**:
   - Created countries and cities tables
   - Replaced direct country/city string storage with references to these tables
   - Normalized place of birth, place of death, marriage location fields

3. **Payment handling normalization**:
   - Created separate fee_payments table to manage payment information across services
   - Normalized currencies and payment statuses

4. **Status normalization**:
   - Created consistent status lookup tables
   - Replaced string status fields with foreign keys to appropriate status tables

5. **Separated metadata from operational data**:
   - Created separate tables for configuration data
   - Moved metadata to lookup tables with proper relationships

## Benefits of 3NF

1. **Eliminated transitive dependencies** by creating lookup tables for all enumerated types
2. **Reduced redundancy** by using reference tables for commonly repeated values
3. **Improved data integrity** through consistent validation of reference data
4. **Enhanced maintainability** by centralizing changes to reference data
5. **Better internationalization support** by isolating translatable text
6. **More efficient storage** by replacing repeated text strings with integer IDs
7. **Improved query performance** as joins can be optimized on integer keys
8. **Simplified business logic** through consistent representation of common concepts

## Implementation Considerations

1. **Foreign Key Constraints**: Add appropriate ON DELETE and ON UPDATE actions to foreign key constraints
2. **Indexes**: Create indexes on all foreign key columns and frequently searched fields
3. **Views**: Create views that join related tables to simplify common queries
4. **Data Migration**: When implementing, plan a careful migration from 2NF to 3NF
5. **Application Impact**: Update application code to handle the more normalized structure
6. **Performance Tuning**: Monitor query performance and add indexes as needed

## Conclusion

The Third Normal Form schema eliminates transitive dependencies while maintaining data integrity. This design ensures that the database is optimized for the Libyan Foreign Ministry Management System's needs while following database design best practices. The resulting schema is more maintainable, scalable, and free from update anomalies that could affect data consistency.

By creating dedicated lookup tables for reference data and ensuring all non-key attributes are dependent only on the primary key, we've created a robust foundation for the system. This design allows for efficient data operations while maintaining the integrity constraints necessary for the sensitive nature of consular and civil registry operations.
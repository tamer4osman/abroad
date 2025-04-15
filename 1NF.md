# First Normal Form (1NF) Database Schema
# Libyan Foreign Ministry Management System

**Document Version:** 1.0  
**Date:** April 15, 2025  
**Status:** Draft  
**Prepared by:** Database Architecture Team

## Introduction

This document defines the First Normal Form (1NF) database schema for the Libyan Foreign Ministry Management System. The schema is designed to ensure that:

1. Each table has a primary key
2. Each column contains atomic (indivisible) values
3. No repeating groups or arrays exist
4. Each record is unique

## Core Entities and Tables

### Users and Authentication

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
| role_name | VARCHAR(50) | NOT NULL, UNIQUE | Name of role (e.g., Admin, Staff, Official) |
| description | TEXT | NULL | Role description |

#### Table: user_roles
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| user_role_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for user-role mapping |
| user_id | INT | NOT NULL, FOREIGN KEY (users.user_id) | Reference to user |
| role_id | INT | NOT NULL, FOREIGN KEY (roles.role_id) | Reference to role |
| embassy_id | INT | NULL, FOREIGN KEY (embassies.embassy_id) | Embassy assignment for user |
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
| role_permission_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for role-permission mapping |
| role_id | INT | NOT NULL, FOREIGN KEY (roles.role_id) | Reference to role |
| permission_id | INT | NOT NULL, FOREIGN KEY (permissions.permission_id) | Reference to permission |

#### Table: auth_logs
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| log_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for log entry |
| user_id | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who performed action |
| action | VARCHAR(50) | NOT NULL | Action performed (login, logout, failed_login) |
| ip_address | VARCHAR(50) | NOT NULL | User's IP address |
| timestamp | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Action timestamp |
| details | TEXT | NULL | Additional details |

### Embassies and Locations

#### Table: embassies
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| embassy_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for embassy/consulate |
| name | VARCHAR(100) | NOT NULL | Embassy/consulate name |
| country | VARCHAR(100) | NOT NULL | Host country |
| city | VARCHAR(100) | NOT NULL | Host city |
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
| place_of_birth | VARCHAR(100) | NOT NULL | Place of birth |
| marital_status | VARCHAR(20) | NOT NULL | Marital status |
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
| city | VARCHAR(100) | NOT NULL | City |
| region | VARCHAR(100) | NULL | State/province/region |
| country | VARCHAR(100) | NOT NULL | Country of residence |
| postal_code | VARCHAR(20) | NULL | Postal/ZIP code |
| email | VARCHAR(100) | NULL | Email address |
| phone | VARCHAR(50) | NOT NULL | Phone number |
| is_current | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether this is current address |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: citizen_documents
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| document_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to citizen |
| document_type | VARCHAR(50) | NOT NULL | Type of document |
| document_number | VARCHAR(100) | NULL | Document reference number |
| issue_date | DATE | NULL | Issue date |
| expiry_date | DATE | NULL | Expiration date |
| issuing_authority | VARCHAR(255) | NULL | Authority that issued the document |
| document_file_path | VARCHAR(255) | NULL | Path to stored document file |
| verification_status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Verification status |
| uploaded_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who uploaded the document |
| notes | TEXT | NULL | Additional notes |
| upload_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Upload timestamp |

#### Table: family_relationships
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| relationship_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | First person in relationship |
| related_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Second person in relationship |
| relationship_type | VARCHAR(50) | NOT NULL | Type of relationship (spouse, parent, child, etc.) |
| start_date | DATE | NULL | Start date of relationship |
| end_date | DATE | NULL | End date of relationship (if applicable) |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether relationship is currently active |
| notes | TEXT | NULL | Additional information |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Birth Registration

#### Table: birth_registrations
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| birth_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| child_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to child citizen record |
| father_citizen_id | INT | NULL, FOREIGN KEY (citizens.citizen_id) | Reference to father's citizen record |
| mother_citizen_id | INT | NULL, FOREIGN KEY (citizens.citizen_id) | Reference to mother's citizen record |
| date_of_birth | DATE | NOT NULL | Date of birth |
| time_of_birth | TIME | NULL | Time of birth |
| place_of_birth | VARCHAR(255) | NOT NULL | Place of birth |
| hospital_name | VARCHAR(255) | NULL | Hospital/facility name |
| birth_certificate_number | VARCHAR(100) | NULL | Original certificate number |
| birth_certificate_file | VARCHAR(255) | NULL | Path to birth certificate scan |
| registry_number | VARCHAR(50) | NULL | Official registry number |
| registration_date | DATETIME | NOT NULL | Date of registration |
| registered_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who registered the birth |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Registration status |
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
| witness_id_type | VARCHAR(50) | NOT NULL | Type of ID provided |
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
| birth_type | VARCHAR(50) | NULL | Type of birth (e.g., natural, cesarean) |
| attending_physician | VARCHAR(255) | NULL | Name of attending physician |
| medical_notes | TEXT | NULL | Additional medical notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Marriage Registration

#### Table: marriage_registrations
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| marriage_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| husband_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to husband's citizen record |
| wife_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to wife's citizen record |
| marriage_date | DATE | NOT NULL | Date of marriage (Gregorian) |
| marriage_date_hijri | VARCHAR(20) | NULL | Date of marriage (Hijri) |
| marriage_location | VARCHAR(255) | NOT NULL | Location of marriage |
| certificate_number | VARCHAR(100) | NULL | Marriage certificate number |
| certificate_file | VARCHAR(255) | NULL | Path to certificate scan |
| issuing_authority | VARCHAR(255) | NOT NULL | Authority that issued the certificate |
| registration_date | DATETIME | NOT NULL | Date of registration |
| registered_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who registered the marriage |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Registration status |
| embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy where registered |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: marriage_witnesses
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| witness_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| marriage_id | INT | NOT NULL, FOREIGN KEY (marriage_registrations.marriage_id) | Reference to marriage registration |
| witness_name | VARCHAR(255) | NOT NULL | Name of witness |
| witness_id_type | VARCHAR(50) | NOT NULL | Type of ID provided |
| witness_id_number | VARCHAR(100) | NOT NULL | ID document number |
| contact_info | VARCHAR(255) | NULL | Contact information |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### Divorce Registration

#### Table: divorce_registrations
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| divorce_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| marriage_id | INT | NOT NULL, FOREIGN KEY (marriage_registrations.marriage_id) | Reference to marriage |
| husband_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to husband's citizen record |
| wife_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to wife's citizen record |
| divorce_date | DATE | NOT NULL | Date of divorce (Gregorian) |
| divorce_date_hijri | VARCHAR(20) | NULL | Date of divorce (Hijri) |
| divorce_type | VARCHAR(50) | NOT NULL | Type of divorce |
| court_name | VARCHAR(255) | NULL | Name of court |
| case_number | VARCHAR(100) | NULL | Court case number |
| decree_number | VARCHAR(100) | NULL | Divorce decree number |
| decree_file | VARCHAR(255) | NULL | Path to decree document |
| registration_date | DATETIME | NOT NULL | Date of registration |
| registered_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who registered the divorce |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Registration status |
| embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy where registered |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: custody_arrangements
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| custody_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| divorce_id | INT | NOT NULL, FOREIGN KEY (divorce_registrations.divorce_id) | Reference to divorce registration |
| child_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to child citizen record |
| custody_holder | VARCHAR(50) | NOT NULL | Type of custody (father, mother, shared, other) |
| custody_notes | TEXT | NULL | Additional custody details |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Death Registration

#### Table: death_registrations
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| death_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to deceased citizen record |
| date_of_death | DATE | NOT NULL | Date of death |
| time_of_death | TIME | NULL | Time of death |
| place_of_death | VARCHAR(255) | NOT NULL | Place of death |
| cause_of_death | VARCHAR(255) | NULL | Cause of death |
| death_certificate_number | VARCHAR(100) | NULL | Certificate number |
| death_certificate_file | VARCHAR(255) | NULL | Path to certificate scan |
| issuing_authority | VARCHAR(255) | NOT NULL | Authority that issued the certificate |
| registration_date | DATETIME | NOT NULL | Date of registration |
| registered_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who registered the death |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Registration status |
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
| informant_id_type | VARCHAR(50) | NOT NULL | Type of ID provided |
| informant_id_number | VARCHAR(100) | NOT NULL | ID document number |
| relationship_to_deceased | VARCHAR(100) | NOT NULL | Relationship to deceased |
| contact_info | VARCHAR(255) | NULL | Contact information |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### Passport Services

#### Table: passports
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| passport_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to citizen |
| passport_number | VARCHAR(20) | NOT NULL, UNIQUE | Passport number |
| passport_type | VARCHAR(50) | NOT NULL | Type of passport |
| issue_date | DATE | NOT NULL | Issue date |
| expiry_date | DATE | NOT NULL | Expiration date |
| issuing_embassy | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy that issued the passport |
| issued_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who issued the passport |
| status | VARCHAR(50) | NOT NULL | Status of passport |
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
| application_type | VARCHAR(50) | NOT NULL | Type (new, renewal, replacement) |
| application_reason | TEXT | NULL | Reason for application |
| application_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date of application |
| processing_type | VARCHAR(50) | NOT NULL, DEFAULT 'NORMAL' | Normal or expedited |
| fee_amount | DECIMAL(10,2) | NOT NULL | Fee amount |
| fee_payment_status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Payment status |
| fee_receipt_number | VARCHAR(100) | NULL | Receipt number |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Application status |
| embassy_id | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy processing the application |
| assigned_to | INT | NULL, FOREIGN KEY (users.user_id) | User assigned to process |
| approved_by | INT | NULL, FOREIGN KEY (users.user_id) | User who approved |
| approval_date | DATETIME | NULL | Date of approval |
| rejection_reason | TEXT | NULL | Reason if rejected |
| notes | TEXT | NULL | Additional notes |
| passport_id | INT | NULL, FOREIGN KEY (passports.passport_id) | Resulting passport if approved |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: travel_documents
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| document_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to citizen |
| document_number | VARCHAR(50) | NOT NULL, UNIQUE | Document number |
| document_type | VARCHAR(50) | NOT NULL | Type of travel document |
| issue_date | DATE | NOT NULL | Issue date |
| expiry_date | DATE | NOT NULL | Expiration date |
| reason_for_issuance | TEXT | NOT NULL | Reason for emergency document |
| issuing_embassy | INT | NOT NULL, FOREIGN KEY (embassies.embassy_id) | Embassy that issued the document |
| issued_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who issued the document |
| status | VARCHAR(50) | NOT NULL | Status of document |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: passport_children
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| entry_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| passport_id | INT | NOT NULL, FOREIGN KEY (passports.passport_id) | Reference to parent passport |
| child_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to child citizen record |
| added_date | DATE | NOT NULL | Date child was added |
| added_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who added child |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'ACTIVE' | Status of child entry |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Visa Processing

#### Table: visa_applications
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| application_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| first_name | VARCHAR(100) | NOT NULL | Applicant first name |
| last_name | VARCHAR(100) | NOT NULL | Applicant last name |
| nationality | VARCHAR(100) | NOT NULL | Applicant nationality |
| passport_number | VARCHAR(50) | NOT NULL | Passport number |
| passport_issue_date | DATE | NOT NULL | Passport issue date |
| passport_expiry_date | DATE | NOT NULL | Passport expiry date |
| date_of_birth | DATE | NOT NULL | Date of birth |
| gender | CHAR(1) | NOT NULL | Gender (M/F) |
| visa_type | VARCHAR(50) | NOT NULL | Type of visa |
| visa_purpose | VARCHAR(255) | NOT NULL | Purpose of travel |
| entry_type | VARCHAR(50) | NOT NULL | Single or multiple entry |
| requested_duration | INT | NOT NULL | Requested stay duration (days) |
| processing_type | VARCHAR(50) | NOT NULL, DEFAULT 'NORMAL' | Normal or expedited |
| application_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date of application |
| fee_amount | DECIMAL(10,2) | NOT NULL | Fee amount |
| fee_payment_status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Payment status |
| fee_receipt_number | VARCHAR(100) | NULL | Receipt number |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Application status |
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
| id_type | VARCHAR(50) | NOT NULL | Type of ID provided |
| id_number | VARCHAR(100) | NOT NULL | ID number |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: visa_documents
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| document_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| application_id | INT | NOT NULL, FOREIGN KEY (visa_applications.application_id) | Reference to visa application |
| document_type | VARCHAR(100) | NOT NULL | Type of document |
| document_file_path | VARCHAR(255) | NOT NULL | Path to document file |
| verification_status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Verification status |
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
| entry_type | VARCHAR(50) | NOT NULL | Single or multiple entry |
| duration_of_stay | INT | NOT NULL | Allowed duration of stay (days) |
| issued_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who issued the visa |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Document Attestation

#### Table: attestation_requests
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| request_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| requestor_name | VARCHAR(255) | NOT NULL | Name of requestor |
| requestor_id_type | VARCHAR(50) | NOT NULL | Type of ID provided |
| requestor_id_number | VARCHAR(100) | NOT NULL | ID document number |
| contact_phone | VARCHAR(50) | NOT NULL | Contact phone |
| contact_email | VARCHAR(100) | NULL | Contact email |
| attestation_type | VARCHAR(50) | NOT NULL | Local or international |
| document_type | VARCHAR(100) | NOT NULL | Type of document |
| document_description | TEXT | NOT NULL | Description of document |
| target_country | VARCHAR(100) | NULL | Target country (for international) |
| is_apostille | BOOLEAN | NOT NULL, DEFAULT FALSE | Requires Apostille certification |
| request_date | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date of request |
| fee_amount | DECIMAL(10,2) | NOT NULL | Fee amount |
| fee_payment_status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Payment status |
| fee_receipt_number | VARCHAR(100) | NULL | Receipt number |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Request status |
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
| verification_status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Verification status |
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
| step_status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Status of step |
| completed_by | INT | NULL, FOREIGN KEY (users.user_id) | User who completed the step |
| completed_at | DATETIME | NULL | Completion timestamp |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Legal Proxy Module

#### Table: legal_proxies
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| proxy_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| proxy_type | VARCHAR(50) | NOT NULL | Type (court, bank, divorce, real estate, inheritance, document, general) |
| grantor_citizen_id | INT | NOT NULL, FOREIGN KEY (citizens.citizen_id) | Reference to grantor citizen |
| proxy_holder_name | VARCHAR(255) | NOT NULL | Name of proxy holder |
| proxy_holder_id_type | VARCHAR(50) | NOT NULL | Type of ID provided |
| proxy_holder_id_number | VARCHAR(100) | NOT NULL | ID document number |
| proxy_purpose | TEXT | NOT NULL | Purpose of proxy |
| start_date | DATE | NOT NULL | Start date |
| end_date | DATE | NULL | End date (if applicable) |
| is_revocable | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether proxy can be revoked |
| authority_limitations | TEXT | NULL | Limitations on authority |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Proxy status |
| verification_status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Verification status |
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
| document_type | VARCHAR(100) | NOT NULL | Type of document |
| document_file_path | VARCHAR(255) | NOT NULL | Path to document file |
| verification_status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Verification status |
| notes | TEXT | NULL | Additional notes |
| uploaded_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Upload timestamp |

#### Table: proxy_activities
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| activity_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| proxy_id | INT | NOT NULL, FOREIGN KEY (legal_proxies.proxy_id) | Reference to legal proxy |
| activity_type | VARCHAR(100) | NOT NULL | Type of activity |
| activity_date | DATE | NOT NULL | Date of activity |
| activity_description | TEXT | NOT NULL | Description of activity |
| performed_by | VARCHAR(255) | NOT NULL | Person who performed the activity |
| verified_by | INT | NULL, FOREIGN KEY (users.user_id) | User who verified the activity |
| verification_date | DATETIME | NULL | Date of verification |
| notes | TEXT | NULL | Additional notes |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Notifications and Communications

#### Table: notifications
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| notification_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| user_id | INT | NULL, FOREIGN KEY (users.user_id) | Target user (NULL for system-wide) |
| notification_type | VARCHAR(50) | NOT NULL | Type of notification |
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
| status | VARCHAR(50) | NOT NULL, DEFAULT 'PENDING' | Email status |
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

#### Table: fee_structures
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| fee_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| service_type | VARCHAR(100) | NOT NULL | Type of service |
| fee_name | VARCHAR(255) | NOT NULL | Name of fee |
| fee_amount | DECIMAL(10,2) | NOT NULL | Amount of fee |
| currency | VARCHAR(3) | NOT NULL, DEFAULT 'LYD' | Currency code |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether fee is active |
| effective_from | DATE | NOT NULL | Start date of fee |
| effective_to | DATE | NULL | End date of fee (if applicable) |
| modified_by | INT | NULL, FOREIGN KEY (users.user_id) | Last modified by |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

### Reporting and Analytics

#### Table: report_templates
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| template_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| template_name | VARCHAR(255) | NOT NULL | Name of report template |
| template_description | TEXT | NULL | Description of report |
| report_type | VARCHAR(50) | NOT NULL | Type of report |
| template_query | TEXT | NOT NULL | Query or definition for report |
| is_system | BOOLEAN | NOT NULL, DEFAULT FALSE | Whether it's a system report |
| created_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who created the template |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether template is active |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

#### Table: report_executions
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| execution_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| template_id | INT | NOT NULL, FOREIGN KEY (report_templates.template_id) | Reference to report template |
| executed_by | INT | NOT NULL, FOREIGN KEY (users.user_id) | User who executed the report |
| parameters | TEXT | NULL | Parameters used for execution |
| start_date | DATETIME | NOT NULL | Execution start time |
| end_date | DATETIME | NULL | Execution end time |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'RUNNING' | Execution status |
| output_format | VARCHAR(20) | NOT NULL, DEFAULT 'PDF' | Output format |
| result_file_path | VARCHAR(255) | NULL | Path to result file |
| error_message | TEXT | NULL | Error message if failed |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### Audit and Logging

#### Table: audit_logs
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| log_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| user_id | INT | NULL, FOREIGN KEY (users.user_id) | User who performed action |
| action | VARCHAR(50) | NOT NULL | Action performed |
| record_type | VARCHAR(50) | NOT NULL | Type of affected record |
| record_id | INT | NULL | ID of affected record |
| old_values | TEXT | NULL | Previous values (JSON) |
| new_values | TEXT | NULL | New values (JSON) |
| ip_address | VARCHAR(50) | NOT NULL | User's IP address |
| user_agent | VARCHAR(255) | NULL | User agent information |
| timestamp | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Action timestamp |
| embassy_id | INT | NULL, FOREIGN KEY (embassies.embassy_id) | Embassy where action occurred |
| additional_info | TEXT | NULL | Additional context information |

#### Table: system_logs
| Column Name | Data Type | Constraints | Description |
|-------------|-----------|------------|-------------|
| log_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| log_level | VARCHAR(20) | NOT NULL | Log level (INFO, WARNING, ERROR, etc.) |
| log_message | TEXT | NOT NULL | Log message |
| source | VARCHAR(255) | NOT NULL | Source of log |
| exception | TEXT | NULL | Exception details |
| timestamp | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Log timestamp |
| additional_info | TEXT | NULL | Additional context information |

## Indexes and Constraints

### Indexes
- Index on `users(email)` for fast user lookups
- Index on `citizens(national_id)` for fast citizen lookups
- Index on `passports(passport_number)` for fast passport lookups
- Index on `visa_applications(tracking_number)` for fast visa tracking
- Index on `attestation_requests(tracking_number)` for fast attestation tracking
- Index on `legal_proxies(tracking_number)` for fast proxy tracking
- Composite index on `marriage_registrations(husband_citizen_id, wife_citizen_id)` for relationship lookups
- Composite index on `family_relationships(citizen_id, related_citizen_id)` for family lookups
- Composite index on `audit_logs(record_type, record_id)` for record audit lookups
- Index on `audit_logs(user_id)` for user activity tracking
- Index on `audit_logs(timestamp)` for time-based audit queries

### Constraints
- Foreign key constraints as specified in the table definitions
- Unique constraints on identification numbers, document numbers, etc.
- Check constraints on status fields, gender, and other enumerated values
- Default values for status fields, timestamps, and boolean flags

## Notes

1. All tables include `created_at` timestamps for tracking creation time.
2. Most tables include `updated_at` timestamps that automatically update on record modification.
3. Status fields are used throughout to track workflow states.
4. Document file paths store locations of uploaded files rather than the files themselves.
5. Tracking numbers are generated for user-facing processes to allow easy status checking.
6. The schema supports both Arabic and English names where appropriate.
7. Support for both Gregorian and Hijri calendar dates is included where culturally relevant.
8. Audit logging is comprehensive to ensure all actions are tracked.
9. The schema follows 1NF principles with:
   - No repeating groups
   - Atomic values in all columns
   - Unique primary keys for all tables
   - No composite attributes

This database schema provides the foundation for the Libyan Foreign Ministry Management System, allowing for efficient storage and retrieval of all relevant data while maintaining data integrity and supporting the required business processes.
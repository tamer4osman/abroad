# MinIO Storage Deployment Guide

## Overview

The Libyan Foreign Ministry Management System uses MinIO as a self-hosted S3-compatible object storage service for document management. This guide explains how MinIO is deployed via GitHub Actions and how to configure the backend application to use it.

## MinIO Deployment Architecture

MinIO is deployed as a containerized service using Docker. The deployment is automated through GitHub Actions, which:

1. Sets up MinIO server based on the target environment (development, staging, or production)
2. Creates the necessary buckets for different document types
3. Configures appropriate access policies and permissions
4. Creates application-specific users with limited permissions
5. Generates environment configuration files

## Deployment Environments

The workflow supports three environments:

- **Development**: Used for local development and testing
- **Staging**: Used for pre-production testing
- **Production**: Used for the live system

## Bucket Structure

The following buckets are created for each environment:

- `libyan-foreign-ministry-[env]` - Main bucket for general documents
- `libyan-foreign-ministry-[env]-passports` - Passport-related documents
- `libyan-foreign-ministry-[env]-visas` - Visa-related documents
- `libyan-foreign-ministry-[env]-proxies` - Proxy-related documents
- `libyan-foreign-ministry-[env]-attestations` - Attestation-related documents

## Security Configuration

- All buckets have **private** access policy by default
- Document access is managed through pre-signed URLs
- A dedicated application user is created with specific permissions
- Production environments use TLS encryption for data in transit
- All stored data is encrypted at rest

## Backend Integration

The `documentController.ts` in the backend service communicates with MinIO using the AWS SDK for JavaScript. To configure the backend:

1. Use the generated `.env.minio.[environment]` file as a template
2. Set the following environment variables:
   ```
   MINIO_ENDPOINT=<hostname or IP>
   MINIO_PORT=<port>
   MINIO_ACCESS_KEY=<application user>
   MINIO_SECRET_KEY=<application password>
   MINIO_BUCKET=<bucket name>
   MINIO_USE_SSL=<true|false>
   ```

## Document Management

Documents are stored with structured keys in the format:
```
[document-type]/[related-record-id]/[unique-uuid][file-extension]
```

For example:
```
passports/12345/550e8400-e29b-41d4-a716-446655440000.pdf
```

## Access Management

- The backend generates pre-signed URLs for document download
- URLs are valid for 15 minutes by default
- Uploads are handled through a Multer middleware with memory storage
- File size is limited to 20MB per document

## High Availability (Production)

For production environments:
1. MinIO should be deployed in a distributed mode for high availability
2. Regular backups should be configured
3. Load balancing should be implemented
4. Proper monitoring and alerting should be set up

## Monitoring

In production environments, consider setting up:
1. Prometheus for metrics collection
2. Grafana for visualization
3. Alerting for storage capacity and error rates

## Troubleshooting

Common issues:
1. **Connection failures**: Check network connectivity and firewall settings
2. **Authentication errors**: Verify access keys and secrets
3. **Permission denied**: Check the policy assigned to the application user
4. **Bucket not found**: Ensure the bucket exists and is spelled correctly

## Local Development

For local development, you can run MinIO using Docker:

```bash
docker run -p 9000:9000 -p 9001:9001 \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  -v ./minio-data:/data \
  minio/minio server /data --console-address ":9001"
```

Then configure your backend `.env` file:
```
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=libyan-foreign-ministry-development
MINIO_USE_SSL=false
```
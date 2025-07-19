import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get version from package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.resolve(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const apiVersion = packageJson.version || '1.0.0';

// Function to create versioned API docs
const createVersionedDocs = (version: string) => {
  // Extract major version for URL paths
  const majorVersion = version.split('.')[0];
  
  return {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Abroad API Documentation',
        version: version,
        description: `Documentation for the Abroad backend API services (v${version})`,
        contact: {
          name: 'API Support',
          email: 'support@abroad-app.com'
        },
        license: {
          name: 'Private',
          url: 'https://abroad-app.com/terms'
        },
        termsOfService: 'https://abroad-app.com/terms',
        'x-api-lifecycle': {
          status: version.includes('beta') ? 'beta' : 'stable',
          deprecationDate: null,
          sunset: false
        }
      },
      servers: [
        {
          url: `http://localhost:4000/api/v${majorVersion}`,
          description: `Development server (v${majorVersion})`
        },
        {
          url: `https://api.abroad-app.com/v${majorVersion}`,
          description: `Production server (v${majorVersion})`
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter your JWT token in the format: Bearer {token}'
          }
        },
        schemas: {
          AuthResponse: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
                description: 'JWT token for API authentication'
              },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  username: { type: 'string' },
                  role: { type: 'string' },
                  name: { type: 'string' }
                }
              },
              expiresIn: {
                type: 'string',
                description: 'Token expiration period'
              }
            }
          },
          Error: {
            type: 'object',
            properties: {
              error: {
                type: 'string',
                description: 'Error message'
              },
              details: {
                type: 'object',
                description: 'Additional error details (optional)'
              }
            }
          },
          VersionInfo: {
            type: 'object',
            properties: {
              version: {
                type: 'string',
                description: 'Current API version'
              },
              released: {
                type: 'string',
                format: 'date',
                description: 'Release date of this version'
              },
              supportUntil: {
                type: 'string',
                format: 'date',
                description: 'End of support date for this version'
              },
              latest: {
                type: 'boolean',
                description: 'Whether this is the latest API version'
              },
              changelog: {
                type: 'string',
                description: 'URL to the changelog for this version'
              }
            }
          }
        }
      },
      security: [{
        bearerAuth: []
      }],
      tags: [
        {
          name: 'Getting Started',
          description: 'Guide to using the Abroad API'
        },
        {
          name: 'Version',
          description: 'API version information'
        },
        {
          name: 'Authentication',
          description: 'API authentication endpoints'
        },
        {
          name: 'Citizens',
          description: 'Endpoints for managing citizen information'
        },
        {
          name: 'Passports',
          description: 'Endpoints for passport application and management'
        },
        {
          name: 'Visas',
          description: 'Endpoints for visa applications and processing'
        },
        {
          name: 'Documents',
          description: 'Endpoints for document management and verification'
        },
        {
          name: 'Proxies',
          description: 'Endpoints for proxy services'
        },
        {
          name: 'Attestations',
          description: 'Endpoints for document attestation services'
        }
      ],
      paths: {
        '/version': {
          get: {
            tags: ['Version'],
            summary: 'Get API version information',
            description: 'Returns information about the current API version and supported versions',
            security: [], // No authentication required for this endpoint
            responses: {
              '200': {
                description: 'Version information',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/VersionInfo'
                    },
                    example: {
                      version: version,
                      released: '2025-04-01',
                      supportUntil: '2027-04-01',
                      latest: true,
                      changelog: 'https://abroad-app.com/api/changelog'
                    }
                  }
                }
              }
            }
          }
        },
        '/api/auth/login': {
          post: {
            tags: ['Authentication'],
            summary: 'Login to the API',
            description: 'Authenticate and receive a JWT token for API access',
            security: [], // No authentication required for login
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                      username: {
                        type: 'string',
                        example: 'admin'
                      },
                      password: {
                        type: 'string',
                        format: 'password',
                        example: 'password123'
                      }
                    }
                  }
                }
              }
            },
            responses: {
              '200': {
                description: 'Successful authentication',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/AuthResponse'
                    },
                    example: {
                      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                      user: {
                        id: 1,
                        username: 'admin',
                        role: 'ADMIN',
                        name: 'Administrator'
                      },
                      expiresIn: '24h'
                    }
                  }
                }
              },
              '401': {
                description: 'Authentication failed',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error'
                    },
                    example: {
                      error: 'Invalid username or password'
                    }
                  }
                }
              }
            }
          }
        },
        '/api/auth/refresh-token': {
          post: {
            tags: ['Authentication'],
            summary: 'Refresh authentication token',
            description: 'Get a new JWT token using an existing valid token',
            security: [{
              bearerAuth: []
            }],
            responses: {
              '200': {
                description: 'Token refreshed successfully',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/AuthResponse'
                    }
                  }
                }
              },
              '401': {
                description: 'Invalid or expired token',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    // Path to the API docs
    apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts']
  };
};

// Initialize swagger-jsdoc with versioned options
const specs = swaggerJsdoc(createVersionedDocs(apiVersion));

// Function to set up Swagger in an Express app
export const setupSwagger = (app: Express): void => {
  // Serve swagger docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: `Abroad API Documentation v${apiVersion}`,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      tagsSorter: 'alpha'
    }
  }));

  // Serve swagger spec as JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};
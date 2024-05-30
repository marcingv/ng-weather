# NgWeather

This is a project developed as a part of "Angular Level 3 certification" from Angular Training.

## Development server

To run the project locally use one the following commands:

```bash
npm run start

# OR using Docker:
docker compose up
```

The application is available at the URL: `http://localhost:4200/`.

## Running unit tests & lint

You can run unit tests and linting using following commands:

```bash
npm run test # run unit tests
npm run lint # run lint checks
```

## Building for production

To build & publish production Docker images run following commands:

```bash
# Build & tag Docker image
npm run docker-prod-build

# Publish image to DockerHub:
npm run docker-prod-publish
```

### Running production image locally

Production image can be run locally using following command:

```bash
docker compose -f docker-compose.prod.yml up
```

The application is available at the URL: `http://localhost:4000/`.

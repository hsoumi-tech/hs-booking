# hs-booking

## create your local db

docker run --name {db-name} -p {db port}:27017 mongo:4.0

## .env

```
#################################################################################
### GENERAL
#################################################################################
PROJECT_NAME
PROJECT_VERSION

JWT_SECRET

#################################################################################
### API
#################################################################################
API_HOST
API_PORT


#################################################################################
### Database
#################################################################################
# DB_PROTOCOL
DB_HOST
DB_PORT
DB_NAME
# DB_USER
# DB_PASSWORD
# DB_QUERY

#################################################################################
### EMAIl RELAY
#################################################################################

SENDGRID
HS_BOOKING_EMAIL

#################################################################################
### ADMIN MODERATOR
#################################################################################

ROOT_MODERATOR_NAME
ROOT_MODERATOR_PASSWORD
```

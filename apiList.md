## List out All API in the Projects

### Auth
/register
/login
/logout
/forgotpassword

## Profile Routes
GET -> /profile/view
PATCH -> /profile/edit
PATCH -> /Profile // Forget Passoword

## Connection Request Route

- POST /request/send/:status/:requested

- POST /request/review/:status/:rquestId // accepted
- POST /request/review/:status/:rquestId // rejected

## userRouter

- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the Profiles of the other users on the Platform

Stautus: ignored, interested, accepeted. rejected.


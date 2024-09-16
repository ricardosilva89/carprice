Routes

# POST /auth/signup 
- created a new user
- body -> email, pass

# POST /auth/signin
- sign in a existing user
- body -> email, pass

# GET /reports
- get estimate for the car value
- qs -> mak, year, model, mileage, lat, long

# POST /reports
- repost how much a vehicle solf for
- body -> mak, year, model, mileage, lat, long

# PATCH /reports
- approve or reject report submitted by the user
- body -> approved


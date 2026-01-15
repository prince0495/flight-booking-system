# Flight Booking System

Successfully completed the assignment for Flight Booking System

**Production URL: "Will be available soon (a lot of linting issues, had to manually fix all builds. npm run build giving no errors but still on vercel it does so manually have to check it
Temporary URL: https://streamable.com/ral607
Access this temporary url to see the glimpse of this project

---

## About the Project

This project let the admins control all flights information across the globe, and let their friendly users to interact with the flights, and intuitively book flights and get tickets offline.

---

## Features

- Admin: Create airports, airlines, aircrafts, and schedule flights
- User: Filtering based flight booking
- User: Tickets history with download button to download pdf of ticket offline
- Authentication

---

## Tech Stack

Nextjs, shadcn, zod, jsonwebtoken, postgresql, prisma orm, tailwindcss

## Run Directly in Docker with these commands

Clone the repository
```
git clone https://github.com/prince0495/flight-booking-system
cd .\flight-booking-system 
```
Run this command to build docker image locally
```
docker build -t flyaway .
```
Start Docker
```
docker run -p 3000:3000 -e DATABASE_URL="postgresql://neondb_owner:npg_ulGit3WX4HUr@ep-mute-night-a1759ngj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" flyaway
```
It will start at http://localhost:3000

### Please First Login as Admin - To control data dynamically
Credentials:
```
email=admin@mail.com
password=12345678
```
After this create any account to interact with data to book flights

## Running the Project Locally if you want you avoid docker

npm install

Create .env in root folder and copy paste this 
```
DATABASE_URL="postgresql://neondb_owner:npg_ulGit3WX4HUr@ep-mute-night-a1759ngj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

npm run dev

## Project will start on http://localhost:3000

It's completed in 24 hours so don't forget to give me feedbacks.

# TDDD27_2024_LiUtils

## Features

### Application basics

* Email/password login
* User login LiU (Microsoft SSO)

### Master course planning

* See all courses
  * Course Info
  * Evaliuate
  * Exam Statistics
* Plan courses to study
* Verify fulfilment Master's requirement
* Share with friends

### Schedule utils

*  Get ICS from for example, course code only `example.com/schedule/course/tddd27.ics`
*  Get merged ICS, for example `example.com/schedule/course/tddd97+tddd27.ics`
*  Get ICS for saved master profile
*  Write scripts to intercept and modify ICS

### Room utils

*  Find all empty rooms
*  Statically generated sites for each room
*  Good SEO for rooms
*  Mazemap Embed
*  Schedule for specific room

## Architecture

### Frontend `Next.js`
* Hybrid framework
  * Has own small backend
* JavaScript/TypeScript based
* Able to pre-generate frontend
  * Needed for SEO
* Hosted on vercel
  * \+ Free
  * \- Stateless


### Big Backend `Express.js`
* Rest API
* Stateful
* Connection to db
* Hosted at home
  * \+ Free
  * \- Unreliable

### Database `PostgreSQL`
* Relational database
* Good json support
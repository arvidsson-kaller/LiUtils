# TDDD27_2024_LiUtils

## Disclaimer
We will do a lot of scraping of public data from LiU and associated resources.
To avoid introducing any significant load on LiU resources, we will do a lot of caching of this data.

## Features

### Application basics

* Email/password login
* User login LiU (Microsoft SSO)

### Master course planning
The idea is to help with planning which Master's courses to attend, heavy user interaction.
* See all courses
  * Course Info
  * Evaliuate
  * Exam Statistics
* Plan courses to study
* Verify fulfillment of Master's requirement
* Share plan
  * Make plan available through link
  * Make plan public on site
  * Use other plans as template (copy/duplicate)

### Schedule utils
Extract data from timeedit, provide functions which timeedit do not have.
* Timeedit scrambles data in URL, UI actions needed to get the scrambled ICS link.
*  Get ICS from course code by only entering it in link
  *  https://te.liutils.se/course/tddd27.ics ✅
*  Get merged ICS, for example `te.liutils.se/course/tddd97+tddd27.ics`
*  Get ICS link for saved master plan
* Find empty rooms from timeedit schedules

### Room utils
Since `old.liu.se/karta` is removed and rooms are no indexed in search engines, we plan to reintroduce the functionality.
*  Statically generated sites for each room 
  * https://www.liutils.se/room/A31 ✅
*  Good SEO for every room
*  Mazemap Embed
*  Schedule for specific room

## Architecture

### Frontend `Next.js`
`Next.js` is a frontend/hybrid framework based on React.
* TypeScript based
* Can perform stateless "backend" tasks
* Static generation for frontend
  * Needed for SEO
* Authentication with `NextAuth.js`
  * Very secure, uses best practices
* Hosted on vercel
  * \+ Free
  * \- Stateless


### Backend `Node.js`
For the more complex backend tasks, statefulness and more resources are required.
* Typescript based
* Rest API with `Swagger/OpenAPI` 
  * `tsoa` generates `Express.js` endpoints
  * OpenAPI compliant documentation is generated
* Hosted at home
  * \+ Free
  * \- Unreliable

### Database `PostgreSQL`
* Relational database
* Good json support when needed
* Interface `node-postgres`
  * Not an ORM, more control
* Migrations with `node-pg-migrate`
* Typescript types generated from tables with `kanel`

## Common library
Package with common code for projects. Mostly for the scripting to extract data from e.g. timeedit.
* Typescript based
* Can be used by both Frontend and Backend
* No network code provided, portable.
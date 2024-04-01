# PostgreSql
We use `node-pq-migration` for handling migrations.  
We use `kanel` to generate typescript types based off database.

Create a `.env` file with the following
```env
DATABASE_URL=postgres://default:************@ep-dark-sun-a2zdc9bs.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require
```
Replace `************` with password
## Database migration
Full documentation https://salsita.github.io/node-pg-migrate/#/migrations  
`npm run migrate create my_migration` will create a new migration file  
`npm run migrate up` will apply migration to database  
`npm run migrate down` will remove migration from database  
## Generate types
`npm run types`
Full documentation https://kristiandupont.github.io/kanel/ 

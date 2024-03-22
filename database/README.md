# PostgreSql

## Database migration
`npm run migrate create my_migration` will create a new migration file  
`npm run migrade up` will apply migration to database  
`npm run migrate down` will remove migration from database  

## Connection
Create a `.env` file with the following
```env
DATABASE_URL=postgres://default:************@ep-dark-sun-a2zdc9bs.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require
```
Replace `************` with password
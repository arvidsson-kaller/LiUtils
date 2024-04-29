cd common
npm ci
npm run build
cd ..

cd backend
npm run update-common
npm run db-types
npm ci
npm run build
cd ..

cd frontend
npm ci
npm run openapi-ts
npm run update-common
cd ..
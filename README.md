# Setup

## Node

  1.- Install node and npm.
  2.- Run ```npm install```

## Database

  1. Install PostgreSQL.
  2. Create user: ```sudo -u postgres createuser -dls rsterdb```
  3. Create database: ```sudo -u postgres createdb rsterdb_dev -U rsterdb```
  4. Run migrations ```sequelize db:migrate```
  
  Drop database: ```grunt db:drop```
  Seed database: ```grunt db:seed```


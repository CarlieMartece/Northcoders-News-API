# Noooka's News API

View At: https://nookas-news.herokuapp.com/api/

Tired of the usual, boring news? Try Nooka's news, a brand new and totally orginal news app.
Filled with:
Articles! On the fascinating subjects of coding, cooking and (sorry) football.
Comments! In latin in case you fancy accidentally summoning a demon in your office or living room.
Users! Who are definitely real.

## Set-Up: First steps

1. Fork repository, then clone by typing "git clone http-address" into terminal.
2. Install dependencies:
npm install jest
npm install dotenv
npm install express
npm install pg
npm install pg-format
npm install supertest
npm install husky
3. Seed local database:
npm run setup-dbs

## Set-Up: Create Environment Variables

After cloning this repo, to run project locally:

1. Create .env.test in main folder
2. Create .env.development in main folder
3. In .env.test add PGDATABASE=nc_news_test
4. In .env.development add PGDATABASE=nc_news
5. Make sure .env.* is added to .gitignore

## To Run Tests

To run app tests, type "npm test __tests__/app.test.js" into terminal
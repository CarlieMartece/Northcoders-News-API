<a name="readme-top"></a>

<br />
<div align="center">
    <a href="https://github.com/CarlieMartece/Northcoders-News-API">
    <img src="./logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Nooka's News</h3>

  <p align="center">
    Very Important Articles
    <br />
    <a href="https://github.com/CarlieMartece/Northcoders-News-API"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/CarlieMartece/Northcoders-News-API">View Demo</a>
    ·
    <a href="https://github.com/CarlieMartece/Northcoders-News-API/issues">Report Bug</a>
    ·
    <a href="https://github.com/CarlieMartece/Northcoders-News-API/issues">Request Feature</a>
  </p>
</div>

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://nookasnews.netlify.app/)

This is the back-end repo for Nooka's News.<br />

The front-end repo for this app can be found <a href="https://github.com/CarlieMartece/nc-news">here</a><br />

This app lets you share articles about:<br />
* Coding! Our favourite subject
* Cooking! Because who doesn't love food?
* Football (Sorry about this)

All with bonus comments in latin in case you fancy accidentally summoning a demon in your office or living room.

The main user features so far are:

* Browse articles by topic
* Sort articles by Date, Title, Topic, Author and Votes
* UpVote or DownVote and article
* View or hide and article's comments
* Add comments to an article
* Delete your comments from an article


## Getting Started

To get a local copy up and running follow these simple example steps.


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/CarlieMartece/Northcoders-News-API.git
   ```
2. cd into repo
   ```sh
   cd Northcoders-News-API
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Seed local database:
    ```sh
    npm run setup-dbs
    ```

## Set-Up: Create Environment Variables

After cloning this repo, to run project locally:

1. Create .env.test in main folder
2. Create .env.development in main folder
3. In .env.test add PGDATABASE=nc_news_test
4. In .env.development add PGDATABASE=nc_news
5. Make sure .env.* is added to .gitignore

## Making Changes

1. Create a new branch
   ```sh
   git checkout -b <new_branch_name>
   ```
2. Add new code. Suggested additions are:

* Express routers
* GET /api/users/:username
* PATCH /api/comments/:comment_id
* POST /api/articles
* GET /api/articles (pagination)
* GET /api/articles/:article_id/comments (pagination)
* POST /api/topics
* DELETE /api/articles/:article_id

<br />

3. Upload new branch
   ```sh
   git push origin <branch_name>
   ```

4. Create pull request and check for potential merge conflicts.
<br />

## To Run Tests

To run app tests, type "npm test __tests__/app.test.js" into terminal

## Acknowledgments

* This app was made possible by the awesome team at Northcoders!


<p align="right">(<a href="#readme-top">back to top</a>)</p>


[product-screenshot]: ./screenshot.png
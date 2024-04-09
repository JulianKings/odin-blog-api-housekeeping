# Odin Blog Api

[The API Project](https://github.com/JulianKings/odin-blog-api) along with [its frontend project](https://github.com/JulianKings/odin-blog-api-frontend) and [this project](https://github.com/JulianKings/odin-blog-api-housekeeping) were made for The Odin Project as one of the final projects. Thanks to it I've practiced a lot with REST APIs and JWT, along with Passport.js and basic REACT and node. I also decided to use babel so I could work with ES6 on my API because I felt more comfortable developing all three projects on the same standard.

## Key Features

 - Visitors are able to enjoy the site and register so they can comment on every post, like posts and save their favorite posts for later. They're also able to review their own comments.
 - There is also a newsletter service ready for deployment if needed, since it was part of the concept I had for the blog.
 - Articles are sorted by **release date** and **popularity** (most likes) separately, and there is also a section where you can see all the articles available, I decided to avoid pagination so the project didn't take ages but I'm confident it wouldn't be that hard to implement.
 - There is also a "*featured article*" that can be selected and is permanently pinned on the front page.
 - Users are split in **three** roles:
 -- User (basic visitor that can like, comment and save posts)
 -- Author (user that can access the housekeeping and publish/edit/delete his own articles, but they're not published on the website until an administrator approves them)
 -- Administrator (can appoint new authors, remove comments, ban users, approve articles and almost anything useful you could think) 
 - There is a housekeeping to manage the site, where users with enough permissions can see some light statistics of the site, add/edit/remove categories and articles, and manage the users of the site. This is also where the administrator can select the featured article.

## Quick look

You can see a test deployment of the site [here](https://odin-blog-frontend.netlify.app/), and a test deployment of the housekeeping [here](https://odin-blog-housekeeping.netlify.app/).

**There is a test user who has author privileges**, its credentials are:

 - **Username**: Thor
 - **Password**: 123456

## Deployment

The site uses **two** environment variables:
**MONGODB_URI**: for the url of your mongodb connection string
**JWT_SECURE_KEY**: the key to protect your JWT credentials so they can't be reverse-engineered

You can set up a basic working site by creating a dummy article and setting it to featured, the settings collection only needs a document with any id as its object id and a field "featured_article" with the id of your dummy article, and the housekeeping will do the rest. You will have to create a user and make it an administrator manually.

I will eventually add a dummy script to create the basic skeleton of the site if needed.
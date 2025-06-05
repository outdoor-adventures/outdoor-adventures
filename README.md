# Outdoor Adventures

## Description
Outdoor Adventures is a community based app centered on getting families out into nature and discovering the world around them. In a world often centered around technology, starting a journey of connecting with the outdoors can be overwhelming, especially for those who don't yet have expereince doing so. Outdoor Adventures brings together exciting activites such as hiking, camping, paddling, and many more. All can be found on one site, easily accesable for soon to be adventurers of all experience levels. Once adventures are found, they can be added by the community for all to enjoy.

## Built With:
This version uses React, Zustand, Express, Passport, and PostgreSQL. (A full list of dependencies can be found in `package.json`.) This program was built using VS Code, but will be compatable with other platforms.

## Prerequisites

Before you get started, make sure you have the following software installed on your computer:

- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org)
- [Nodemon](https://nodemon.io)
- Postico
- Google Maps API (See full API Instructions)


## Create Database and User Table

Create a new database named "outdoor-adventures", then create a `user` table using the query found in `database.sql` as well as the other tables available in the `database.sql`.

## Initial Setup Instructions

- Fork this repository.
- Copy the SSH link in your new repository.
- In your terminal type: git clone {paste SSH link}.
- In your terminal, navigate to the project's folder.
- Open VS Code (or the editor of your choice), then open the folder.
- In this repo's **root directory**, run `npm install`.
- Create an `.env` file in the **root directory**, then include the example `.env` file. You will need to include your own Google Maps API Key.
- Run `npm run server` to start the server.
- Run `npm run client` to start the client.
- Navigate to `localhost:5173`.

## Lay of the Land

### The Home Page

To start, users are greeted by the Outdoor Adventures' home page. Right away they have the opportunity to find their next adventure, join the newsletter for community updates, or add their own adventure.

![The Beginning of the Home Page](READMEPhotos/HomePage1.png)

A quick scroll on the home page will also give a tutorial on how to use Outdoor Adventures with an interactive map.

![Tutorial on the Home Page](READMEPhotos/HomePage2.png)

### Browse Adventures Page

Once a user is ready to find their next adventure, they can navigate to the "Browse Adventures" page. At the top of the page's contents, users can input their location, select and adventure category, and filter by ability level and price. Once the "Find Adventures" button is clicked, the right-hand column will populate adventures within a 20 mile radius for users to select from. The map will also populate with pinpoints.

![Browse Adventures Page](READMEPhotos/BrowseAdventures.png)

### Login Page

If a user would like to save their adventures or add their own, they will first need to login. Don't have a login? No problem, they can also register for an account!

![Login Page](READMEPhotos/Login.png)

### User Page

Once a user is logged in an ready to go, they can check out their user page. This will show a list of all the adventures they submitted (with a status on whether or not it has been accepted or is pending review) to the site as well as adventures they favorited for the future.

![User Page](READMEPhotos/UserPage.png)

### Add Adventure Form

When logged in, users can add their own adventures for the whole community to enjoy. The Add Adventure Form allows them to upload a photo, include a link and title, describe their adventure, and choose the appropriate categories from the drop down menues.

![Add Adventure Form](READMEPhotos/AddAdventure.png)

### Admin Page

With so many exciting adventures being added, an admin can make sure Outdoor Adventures stays on target. From the admin's page they can view all the submitted adventures. They have the ability to accept, edit, or decline any new adventures. If a submission is accepted, it will be available for all to enjoy on Outdoor Adventures.

![Admin Page](READMEPhotos/AdminPage.png)


## Google Maps API Key Setup

1. Login or Create an account in the Google Cloud Console -> **[Click Here](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://console.cloud.google.com/&ved=2ahUKEwiPyb-LhdmNAxXNMNAFHW0JB_cQFnoECAsQAQ&usg=AOvVaw1GxwHR1WZnDu0xsR-djCrv)**.

- Once you are logged in, go to the navigation menu in the top left of the website.

<img src="/public/images/instructional-images/nav-top-left.png">

- Click on ***APIs & Services*** tab.

<img src="/public/images/instructional-images/api-service-nav.png">

- Now that you are in the APIs and Services tab, click on the ***Credentials*** tab on the left,
then click the ***+Create Credentials*** button and select the API key option in the dropdown.

<img src="/public/images/instructional-images/credentials.png">

## Now you have a key, so lets restrict it

- :warning: **Important:** Restricting a key is a crucial step, without restriction, others that access your key, 
can use your key.

- Shown below is a new key. The :warning: symbol next to the key name means it is unrestricted.
To restrict it, click on the key name. In this photo, the key name is shown as "API key 3".

<img src="/public/images/instructional-images/new-key.png">

- Once you are in the Key Restrictions menu, under **Application restrictions**, select **Websites** as the restriction type, now below, click the **+Add** button and add your websites domain. The domain will be something like **https://ExampleSite.com** if you are using any subdomains you may need to read up on how to include them in your restrictions.

<img src="/public/images/instructional-images/restrictions.png">

- Optionally, in the Second to last circle on the image above, 
you can also add restriction by APIs. in this project we use 
**Maps JavaScript API**, **Geocoding API**, and the **Places API**.
so feel free to add those in if you would like.

- Click the save button to save your restrictions. the original :warning: symbol next to the name should now be a green circle with a check mark.

## Enable all required APIs

<img src="/public/images/instructional-images/enabl-apis.png">

- Click **Enabled APIs & Services** Tab, then click the **+ Enable APIs and Services** button and go through and enable the following: **Maps JavaScript API**, **Geocoding API** and lastly, **Places API**.

## All Done! 
- Once all of the steps have been followed, Your API Key can be found in the Credentials tab once the "show key" button has been clicked.



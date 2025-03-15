MERN Stack Contest Tracker

Overview

The MERN Stack Contest Tracker is a web application that scrapes programming contests from CPHelper using Puppeteer. It then fetches solutions from the "TLE" YouTube channel using the YouTube Data v3 API. If solutions are found, the contest details are stored in a MongoDB database. The frontend is built using React, Tailwind CSS, and ShadCN.

Features

Web Scraping: Extracts contest data from CPHelper using Puppeteer.

YouTube API Integration: Fetches solutions from the "TLE" YouTube channel.

MongoDB Storage: Stores contest details in a database.

Modern UI: Built with React, Tailwind CSS, and ShadCN for a sleek and responsive design.

Tech Stack

Frontend

React.js

Tailwind CSS

ShadCN

Backend

Node.js

Express.js

MongoDB

Puppeteer (for web scraping)

YouTube Data v3 API (for fetching solutions)

Project Flow

Scrape Contests: Puppeteer scrapes upcoming contests from CPHelper.

Find Solutions: The YouTube Data v3 API searches for solutions on the "TLE" channel.

Store in Database: If solutions are found, the contest details are saved in MongoDB.

Display on UI: The frontend fetches and displays contest details in a user-friendly format.

Setup Instructions

Prerequisites

Node.js & npm

MongoDB

API key for YouTube Data v3

Backend Setup

cd backend
npm install

Create a .env file and add:

MONGO_URI=your_mongodb_connection_string
YOUTUBE_API_KEY=your_youtube_api_key

Start the server:

npm start

Frontend Setup

cd frontend
npm install
npm run dev

Future Enhancements

Add user authentication

Implement notifications for upcoming contests

Improve search and filtering options

Contributions

Feel free to fork the repository and submit pull requests for improvements!

License

This project is open-source under the MIT License.


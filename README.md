# The Security Questionnaire
This document details the inner workings of the security questionnaire project. It includes the goals as well as current issues pertaining to the file structure and design of the project. Please take the time to carefully read the entirety of this document to better understand the decisions made throughout development.

## How to Get Started

1. Fork or download this repo onto your file system. 
1. Navigate to the web directory on your preferred command line.
1. Ensure you have Node.js installed and install yarn via the command: `npm install -g yarn`
1. Install the required dependencies: `yarn install`
1. Open Docker Desktop and build your image: `docker build -t your-image-tag`
1. On Docker Desktop, verify that the three containers: webapp, pgadmin, and database are running.
1. Connect to the website via localhost:5000

Currently, the project does not rely on the database so for faster developer purposes, running the command `yarn dev` can be done for faster updates.

## File Structure
The project follows the Qwik format. The main content of the project is within the web folder. However, it is important to mention what lies outside the web folder first:
- Articles
    - This is a relic from the original project. To understand the format of 'Articles' on the webpage, they remain for future reference.
- [LICENSE](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/LICENSE)
    - This is the updated MIT license with the added Eclipse Foundation attribution.
### The Web Folder
The web folder contains the bulk of the project. 

## Project Structure
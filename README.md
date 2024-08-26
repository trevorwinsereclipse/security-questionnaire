# The Security Questionnaire
This document details the inner workings of the security questionnaire project. It includes the goals as well as current issues pertaining to the file structure and design of the project. Please take the time to carefully read the entirety of this document to better understand the decisions made throughout development.

## How to Get Started

1. Fork or download this repo onto your file system. 
1. Navigate to the web directory on your preferred command line.
1. Ensure you have Node.js installed and install yarn via the command: `npm install -g yarn`
1. Install the required dependencies: `yarn install`
1. Open Docker Desktop and build your image: `docker build -t your-image-tag`
1. On Docker Desktop, verify that the three containers: webapp, pgadmin, and database are running. If they are not then `docker compose up -d` should do the trick.
1. Connect to the website via localhost:5000

Currently, the project does not rely on the database so for faster developer purposes, running the command `yarn dev` can be done for faster updates.

## File Structure
This sections details the folders and files to the project as well as their overall purpose.

- [/articles](https://github.com/trevorwinsereclipse/security-questionnaire/tree/main/articles)
    - This is a relic from the original project. To understand the format of 'Articles' on the webpage, they remain for future reference.
- [LICENSE](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/LICENSE)
    - This is the updated MIT license with the added Eclipse Foundation attribution.

---

### /web
The web folder contains the bulk of the project. 

- [/node_modules](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/node_modules)
    - The project dependencies are stored in here.
- [/public](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/public)
    - This folder contains remnants from the old project such as the banner and favicon images, and manifest.json.
    - Most notably, the current [checklist](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/public/personal-security-checklist.yml) is in this folder. The format for adding a new section or statement is straightforward from the format of the file.

---

#### /src
The src folder contains the Qwik code for the project. Most of the page content can be found here.
- [/components](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/src/components)
    - The components folder contains reusable content oftentimes used as a custom element. One example is [icon.tsx](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/src/components/core/icon.tsx) that can be used with the `<Icon>` element. Think of it as an implementation of `<iframe>` for Qwik projects.
- [/data](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/src/data)
    - The data folder works in tandem with the aforementioned /articles to link together the md files to the frontend.
- [/hooks](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/src/hooks)
    - The hooks folder has the [useLocalStorage.ts](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/src/hooks/useLocalStorage.ts) file which acts as the primary method of storage for data on the frontend. An important note is that variables from local storage can only be accessed during runtime i.e. on window load.
- /[media](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/src/media)
    - A useful location to store images.
- [/routes](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/src/routes)
    - The routes folder is where all of the frontend webcontent is returned. Please see the convention for folders within the routes folder [here](https://qwik.dev/docs/routing/).
- [/server](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/src/server)
    - The server folder stores the connection and schemas for the database. It is merely demo code and should not be included in the final product.
- [/store](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/src/store)
    - This folder is from the original project and works with the useLocalStorage.ts mentioned prior. It also serves as an access point for the checklist that is stored locally in the public folder.
- [/styles](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/src/styles)
    - The styles folder has the predefined css that is used for a consistent style across the website.
- [/types](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/src/types)
    - The types folder defines custom classes such as Section and Checklist.

---

- [/tmp](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/src/tmp)
    - The tmp folder should not be used for any development purposes.

---

## Changes

### Dependencies

Initially, the project relied on the **Vercel** web hosting service and had integration to support that. Now, the project is run via a docker container so that it can in the future be deployed anywhere.

Another dependency that was added recently was the Drizzle ORM Kit for easier database storage and access. The Drizzle ORM Kit is not the only choice and if difficulties with their lack of documentation or limited functionality arise then other options should be considered.

PostgreSQL was decided for the database to work in tandem with ORM's such as Drizzle. However, the decision to store data in this way may change based on the current architecture.

### Frontend

The current project is noticeably different from the original [Digital Defense](https://digital-defense.io/) website. 

The sections were simplified to correspond to the Eclipse Foundation's security best practices: 

1. **Accounts**
1. **Machine**
1. **Environment**

### Backend

The database has not been defined and implemented fully but a basis for the schema can be viewed in the server folder mentioned above.

### Additions

1. Frequency Answering
    - Users can now answer questions with Always, Sometimes, Never, and Ignore.
    - Ignore was in the original implementation and 
1. Progress Score
    - A new score that portrays the frequency the user accomplishes security practices.
    - A full point is awarded if they answer Always.
    - A half point is awarded if they answer Sometimes.
    - No point is awarded if they answer Never or Ignore.
    - Each section has an independent score.
    - It is displayed in tandem with the completion percentage on the home page and the section page.

---

### Removals

1. Levels
    - The original website had three levels: Essential, Optional, and Advanced.
    - The practices included in the current project are all essential, but a lot of the levels functionality was kept in but is not shown
1. Filters
    - The original website had a filter for completion and level.
    - The filter code is still present in [web/src/components/psc/checklist-table.tsx](https://github.com/trevorwinsereclipse/security-questionnaire/blob/main/web/src/components/psc/checklist-table.tsx)
1. Sorting
    - The original website allowed users to sort section rows by completion, advice, and level.
    - Now users may only sort by advice, otherwise known as topic. As the number of topics and statements decreased, the need for sorting seemed less apparent.
1. Articles
    - Articles are an artifact from the original website that acted as a place for information that does not fit the scope of the website.

## Intricacies
The project has a lot of little things that may inhibit development that I believe would be useful to know. This sections goes over those parts.

- **useLocalStorage** - Initially, the project was built for personal security progress tracking. Thus, all of the data was stored locally. Accessing these variables can only be done on or after window load.

- **Digital Defense** - The original project had a similar purpose, however their care for relics such as the articles section are not necessary for this project as all information provided should be in accordance with the Eclipse Foundation's current best security practices. If something is outdated, it should be properly updated or deprecated.
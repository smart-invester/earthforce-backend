
# Earth-Force Natural Events Tracker

#   1. Earth-Force Team (Contributors): 
        * Nick Roberto
        * Kyle Devine
        * Angela Venger
        * Eli Zevin
        * Rosalie Lee
        * Will Piro

#   2. Description 
    Earth-Force Natural Events Tracker allows you to find current and historical natural weather related events, track and save those events, and connect with resources that help with disaster relief.

#   3. Problem Domain
    Everyone on the planet is impacted by natural weather events. In many cases, these events can become natural disasters and have a significant impact on human and environmental health. And yet, despite these impacts, these events happen with such frequency it becomes difficult to remember or distinguish them over time. In an effort to help individuals connect with these periods of severe weather, we wanted to build an application that helps people stay monitor these events globally. 

#   4. Version
    1.0.0

#   5. Built With:
    *React
    *NodJS
    *Heroku
    *SQL 
    *Google-React-Maps V.2.2
    *NASA Earth Observatory Natural Events Tracker (EONET) API
    faIcons by Fort Awesome V.5.12.1
    Video-React V.0.14.01

#   6. Defined Endpoints
    Two defined get routes including a single api fetch to display natural events by category and second get route pull the favorites from our database. Our post route allows users to insert their tracked events into the SQL database that, that seeded information includes the user_id, title (of the natural event), and the original date of the natural event.

#   7. Data Base Schemas
    Favorites Table
    The table rows sort by serial id (database location), title of natural event, user_id. 
    User Table
    Serial id
    User Name
    Password

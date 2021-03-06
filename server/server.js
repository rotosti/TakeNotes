//file system node module
const fs = require('fs');
// express js module
const express = require('express');
// path module
const path = require('path');

// express application requirements
const application = express();
// grab port from environment or 
const PORT = process.env.PORT || 5000;

// express set up
application.use(express.static(path.join(__dirname, '../public')));
application.use(express.urlencoded({extended:true}));
application.use(express.json());

// creates new unique id on creation of a note
function generateUniqueID(data) {
    let existingIDs = [];
    // for loop to gather existing IDs
    for (let k = 0; k < data.length; k++) {
        existingIDs.push(data[k].id) 
    }
    // creates new unique id
    let uniqueID = Math.floor(Math.random() * (10000 - 1) + 1);
    // verifies if unique id is actually unique, if not, remakes the id
    while (existingIDs.includes(uniqueID)) {
        uniqueID = Math.floor(Math.random() * (10000 - 1) + 1);
    }
    // returns random id
    return uniqueID;
}
// notes route, sends back the notes.html
application.get('/notes', (request, response) => {
    response.sendFile(path.join(__dirname, '../public/notes.html'));
});
// api notes route, sends the db.json file
application.get('/api/notes', (request, response) => {
    response.sendFile(path.join(__dirname, '../db/db.json'));
});
// api notes post route, adds the added text to to the database 
application.post('/api/notes', (request, response) => {
    // gets the note data from the
    const userNoteData = request.body;
    // takes the information from the database file
    let dbData = fs.readFileSync(path.join(__dirname, '../db/db.json'));
    // parses the information in the database file to make array of objects
    let parsedDBData = JSON.parse(dbData);
    // creates new unique id and adds the data member to the object
    userNoteData.id = generateUniqueID(parsedDBData);
    // pushes the object with id to the object array
    parsedDBData.push(userNoteData);
    // writes to with new updated 
    fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(parsedDBData), (e) => {
        if (e) {
            console.log('Something happened on save', e);
        }
    })
    // sends back a response saying processing ended
    response.end()
})
// delete route to delete from the database
application.delete('/api/notes/:id', (request, response) => {
    // takes the id out of the delete route request
    const returnID = request.params.id;
    // takes the database file and reads it
    let dbData = fs.readFileSync(path.join(__dirname, '../db/db.json'));
    // parses the data into a array of objects
    let parsedDBData = JSON.parse(dbData);
    // loop which matches the id the database to remove it
    for (let i = 0; i < parsedDBData.length; i++) {
        // if the id of the object being iterated over matches the id of the delete
        if (parsedDBData[i].id == returnID) {
            // removes the item from the database
            parsedDBData.splice(i, 1);
        }
    };
    // writes the array of objects to the database file
    fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(parsedDBData), (e) => {
        if (e) {
            console.log('Something happened on save', e);
        }
    })
    // returns a response back to the request
    response.end();
})
// wild card route, returns index.html to any route request that doesn't match above
application.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, '../public/index.html'));
});

// starts listening on port and activates the server
application.listen(PORT, () => console.log(`Listning PORT: ${PORT}`));

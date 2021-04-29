//file system node module
const fs = require('fs');
//express js
const express = require('express');
const path = require('path');

const application = express();
const PORT = process.env.PORT || 5000;

application.use(express.static(path.join(__dirname, '../public')));
application.use(express.urlencoded({extended:true}));
application.use(express.json());

application.get('/notes', (request, response) => {
    response.sendFile(path.join(__dirname, '../public/notes.html'));
});

application.get('/api/notes', (request, response) => {
    response.sendFile(path.join(__dirname, '../db/db.json'));
});

application.post('/api/notes', (request, response) => {
    const userNoteData = request.body;
    console.log(userNoteData);

    let dbData = fs.readFileSync(path.join(__dirname, '../db/db.json'));
    let parsedDBData = JSON.parse(dbData);
    // console.log(parsedDBData,'before push')
    parsedDBData.push(userNoteData);
    // console.log(parsedDBData, 'after push');

    fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(parsedDBData), (e) => {
        if (e) {
            console.log('Something happened on save', e);
        }
    })
})

application.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, '../public/index.html'));
});

application.listen(PORT, () => console.log(`Listning PORT: ${PORT}`));

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'build')));

// Endpoint to save wishes
app.post('/api/saveWish', (req, res) => {
    const { name, message } = req.body;
    const filePath = path.join(__dirname, 'wishes.txt');
    const wishEntry = `Name: ${name}, Message: ${message}\n`;

    if (fs.existsSync(filePath)) {
        fs.appendFile(filePath, wishEntry, (err) => {
            if (err) {
                console.error('Error appending to file:', err);
                res.status(500).send('Error appending to text file');
                return;
            }
            console.log('Appended to existing file');
            res.send('Wishes appended successfully!');
        });
    } else {
        fs.writeFile(filePath, wishEntry, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                res.status(500).send('Error writing to text file');
                return;
            }
            console.log('Created new file and wrote data');
            res.send('Wishes saved successfully!');
        });
    }
});

// Endpoint to retrieve wishes
app.get('/api/getWishes', (req, res) => {
    const filePath = path.join(__dirname, 'wishes.txt');
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                res.status(500).send('Error reading text file');
                return;
            }
            console.log('Retrieved wishes from file');
            res.send(data);
        });
    } else {
        res.send('No wishes found');
    }
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

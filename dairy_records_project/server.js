const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path'); 
const cors = require('cors');

const app = express(); // Initialize Express app
const port = 3000;

app.use(express.json());


// Use CORS middleware
app.use(cors());



// MySQL connection configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dairy_records'
});

// Connect to MySQL
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index2.html for the root path
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signUp.html'));
});

// Serve index2.html for the root path
app.get('/manage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'managing.html'));
});

// Serve index.html for the /admin path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homePage.html'));
});

// Serve index.html for the /admin path
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// path for 'farmers.html
app.get('/farmer', (req, res) => {
    res.sendFile(path.join(__dirname,  'public',  'farmers.html'));});

// path for all farmers.html
app.get('/all_famers', (req, res) => {
    res.sendFile(path.join(__dirname,  'public',  'all_farmers.html'));});

// path for 'get_farmer.html'
app.get('/get_farmer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'get_farmer.html'));
});
// Route to serve the UI file for updating a farmer
app.get('/update-farmer/:id', (req, res) => {
    const farmerId = req.params.id;
    // Use the farmerId to perform any necessary operations
    // For example, you can fetch the farmer data from the database using the ID
    res.sendFile(path.join(__dirname, 'public', 'update-farmer.html'));
});

// Route to serve the UI file for deleting a farmer
app.get('/delete_farmer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'delete_farmer.html'));
});

// Route to serve the UI file for adding a new feed record
app.get('/add-feed', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add-feed.html'));
});

// Route to serve the UI file for displaying feed records
app.get('/view-feeds', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'feeds.html'));
});
// Route to serve the UI file for displaying feed details
app.get('/view-feed-details', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'feed-details.html'));
});

// Route to serve UI file for updating a feed record
app.get('/update_feed', (req, res) => {
    res.sendFile(path.join(__dirname,  'public', 'update_feed.html')); // Adjust the path if necessary
});

// Define a route to serve the UI file
app.get('/delete-feed-ui', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'delete_feed_ui.html'));
});

//path for creating health record
app.get('/new_health_record', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'createhealthrecord.html'));
});

//path for geting health records
app.get('/all_health_record', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'all_health_record.html'));
});

//path for getting individual health record
app.get('/all_health_record', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'individual_health_record.html'));
});

//path for updating individual health record
app.get('/update_individual_health_record', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'update_individual_health.html'));
});

//path for updating individual health record
app.get('/delete_health_record', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'delete_health_record.html'));
});
 //path for updating individual health record
app.get('/milk', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'milk_record.html'));
});
 //path for updating individual health record
 app.get('/breeding', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'breeding_record.html'));
});
  
 //path for updating individual health record
 app.get('/update_delete_feeds', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'update_delete_feeds.html'));
});
  
// Serve other files as requested
app.use(express.static(path.join(__dirname, 'public')));

// Create a farmer
app.post('/farmers', (req, res) => {
    const { username, password, name, address, contact_number } = req.body; // Fixed key name
    const sql = `INSERT INTO farmers (username, password, name, address, contact_number) VALUES (?, ?, ?, ?, ?)`;
    connection.query(sql, [username, password, name, address, contact_number], (err, result) => { // Fixed parameter name
        if (err) {
            console.error('Error adding farmer:', err);
            res.status(500).send('An error occurred while adding the farmer');
        } else {
            console.log('New farmer added:', result.insertId);
            res.status(201).send(`Farmer added with ID: ${result.insertId}`);
        }
    });
});


// Get all farmers
app.get('/farmers', (req, res) => {
    const sql = `SELECT * FROM farmers`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Get a specific farmer by ID
app.get('/farmers/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM farmers WHERE id = ?`;
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.status(404).send('Farmer not found');
        } else {
            res.json(result[0]);
        }
    });
});

// Update a farmer by id
// Route to handle updating a farmer
app.put('/farmers/:id', (req, res) => {
    const id = req.params.id;
    const { username, password, name, address, contact_number } = req.body;
    const sql = `UPDATE farmers SET username=?, password=?, name=?, address=?, contact_number=? WHERE id=?`;
    connection.query(sql, [username, password, name, address, contact_number, id], (err, result) => {
        if (err) {
            console.error('Error updating farmer:', err);
            res.status(500).json({ error: 'Error updating farmer' });
        } else {
            console.log('Farmer updated:', result.affectedRows);
            res.send('Farmer updated successfully');
        }
    });
});

// Delete a farmer
app.delete('/farmers/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM farmers WHERE id = ?`;
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        console.log('Farmer deleted:', result.affectedRows);
        res.send('Farmer deleted successfully');
    });
});

// CRUD operations for feeds table
// Similar CRUD endpoints can be added for other tables (health, milk_production, breeding)

// Create a feed record
app.post('/feeds', (req, res) => {
    const { farmer_id, date, type, quantity } = req.body;
    const sql = `INSERT INTO feeds (farmer_id, date, type, quantity) VALUES (?, ?, ?, ?)`;
    connection.query(sql, [farmer_id, date, type, quantity], (err, result) => {
        if (err) throw err;
        console.log('New feed record added:', result.insertId);
        res.status(201).send(`Feed record added with ID: ${result.insertId}`);
    });
});

// Get all feed records
app.get('/feeds', (req, res) => {
    const sql = `SELECT * FROM feeds`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Get a specific feed record by ID
app.get('/feeds/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM feeds WHERE id = ?`;
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.status(404).send('Feed record not found');
        } else {
            res.json(result[0]);
        }
    });
});

// Update a feed record
app.put('/feeds/:id', (req, res) => {
    const id = req.params.id;
    const { farmer_id, date, type, quantity } = req.body;
    const sql = `UPDATE feeds SET farmer_id=?, date=?, type=?, quantity=? WHERE id=?`;
    connection.query(sql, [farmer_id, date, type, quantity, id], (err, result) => {
        if (err) throw err;
        console.log('Feed record updated:', result.affectedRows);
        res.send('Feed record updated successfully');
    });
});

// Delete a feed record
app.delete('/feeds/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM feeds WHERE id = ?`;
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        console.log('Feed record deleted:', result.affectedRows);
        res.send('Feed record deleted successfully');
    });
});

// Similar CRUD endpoints for health, milk_production, breeding tables can be added here// CRUD operations for health table

// Create a health record
app.post('/health', (req, res) => {
    const { farmer_id, date, issue, treatment } = req.body;
    const sql = `INSERT INTO health (farmer_id, date, issue, treatment) VALUES (?, ?, ?, ?)`;
    connection.query(sql, [farmer_id, date, issue, treatment], (err, result) => {
        if (err) throw err;
        console.log('New health record added:', result.insertId);
        res.status(201).send(`Health record added with ID: ${result.insertId}`);
    });
});

// Get all health records
app.get('/health', (req, res) => {
    const sql = `SELECT * FROM health`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Get a specific health record by ID
app.get('/health/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM health WHERE id = ?`;
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.status(404).send('Health record not found');
        } else {
            res.json(result[0]);
        }
    });
});

// Update a health record
app.put('/health/:id', (req, res) => {
    const id = req.params.id;
    const { farmer_id, date, issue, treatment } = req.body;
    const sql = `UPDATE health SET farmer_id=?, date=?, issue=?, treatment=? WHERE id=?`;
    connection.query(sql, [farmer_id, date, issue, treatment, id], (err, result) => {
        if (err) throw err;
        console.log('Health record updated:', result.affectedRows);
        res.send('Health record updated successfully');
    });
});

// Delete a health record
app.delete('/health/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM health WHERE id = ?`;
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        console.log('Health record deleted:', result.affectedRows);
        res.send('Health record deleted successfully');
    });
});

// CRUD operations for milk_production table
// Similar CRUD endpoints can be added for other tables (breeding)

// Create a milk production record
app.post('/milk_production', (req, res) => {
    const { farmer_id, date, quantity } = req.body;
    const sql = `INSERT INTO milk_production (farmer_id, date, quantity) VALUES (?, ?, ?)`;
    connection.query(sql, [farmer_id, date, quantity], (err, result) => {
        if (err) throw err;
        console.log('New milk production record added:', result.insertId);
        res.status(201).send(`Milk production record added with ID: ${result.insertId}`);
    });
});

// Get all milk production records
app.get('/milk_production', (req, res) => {
    const sql = `SELECT * FROM milk_production`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Get a specific milk production record by ID
app.get('/milk_production/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM milk_production WHERE id = ?`;
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.status(404).send('Milk production record not found');
        } else {
            res.json(result[0]);
        }
    });
});

// Update a milk production record
app.put('/milk_production/:id', (req, res) => {
    const id = req.params.id;
    const { farmer_id, date, quantity } = req.body;
    const sql = `UPDATE milk_production SET farmer_id=?, date=?, quantity=? WHERE id=?`;
    connection.query(sql, [farmer_id, date, quantity, id], (err, result) => {
        if (err) throw err;
        console.log('Milk production record updated:', result.affectedRows);
        res.send('Milk production record updated successfully');
    });
});

// Delete a milk production record
app.delete('/milk_production/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM milk_production WHERE id = ?`;
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        console.log('Milk production record deleted:', result.affectedRows);
        res.send('Milk production record deleted successfully');
    });
});

// CRUD operations for breeding table

// Create a breeding record
app.post('/breeding', (req, res) => {
    const { farmer_id, date, breed, number_of_offspring } = req.body;
    const sql = `INSERT INTO breeding (farmer_id, date, breed, number_of_offspring) VALUES (?, ?, ?, ?)`;
    connection.query(sql, [farmer_id, date, breed, number_of_offspring], (err, result) => {
        if (err) throw err;
        console.log('New breeding record added:', result.insertId);
        res.status(201).send(`Breeding record added with ID: ${result.insertId}`);
    });
});

// Get all breeding records
app.get('/breeding', (req, res) => {
    const sql = `SELECT * FROM breeding`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Get a specific breeding record by ID
app.get('/breeding/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM breeding WHERE id = ?`;
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.status(404).send('Breeding record not found');
        } else {
            res.json(result[0]);
        }
    });
});

// Update a breeding record
app.put('/breeding/:id', (req, res) => {
    const id = req.params.id;
    const { farmer_id, date, breed, number_of_offspring } = req.body;
    const sql = `UPDATE breeding SET farmer_id=?, date=?, breed=?, number_of_offspring=? WHERE id=?`;
    connection.query(sql, [farmer_id, date, breed, number_of_offspring, id], (err, result) => {
        if (err) throw err;
        console.log('Breeding record updated:', result.affectedRows);
        res.send('Breeding record updated successfully');
    });
});

// Delete a breeding record
app.delete('/breeding/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM breeding WHERE id = ?`;
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        console.log('Breeding record deleted:', result.affectedRows);
        res.send('Breeding record deleted successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

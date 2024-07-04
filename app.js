require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { createTables } = require('./config/database');
const propertyController = require('./controllers/propertyController');

const app = express();

app.use(bodyParser.json());

app.post('/add_new_property', propertyController.addNewProperty);
app.get('/fetch_all_properties', propertyController.fetchAllProperties);
app.put('/update_property_details', propertyController.updatePropertyDetails);
app.delete('/delete_property_record', propertyController.deletePropertyRecord);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await createTables();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error setting up the database:', error);
        process.exit(1);
    }
};

startServer();

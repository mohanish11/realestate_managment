const { pool } = require('../config/database');
exports.addNewProperty = async (req, res) => {
    const { property_name, locality, owner_name } = req.body;
    try {
        let localityResult = await pool.query('SELECT id FROM localities WHERE name = $1', [locality]);
        if (localityResult.rows.length === 0) {
            localityResult = await pool.query('INSERT INTO localities (name) VALUES ($1) RETURNING id', [locality]);
        }
        const localityId = localityResult.rows[0].id;
        const propertyResult = await pool.query(
            'INSERT INTO properties (name, locality_id, owner_name) VALUES ($1, $2, $3) RETURNING id',
            [property_name, localityId, owner_name]
        );
        res.json({
            message: 'Property added successfully',
            property_id: propertyResult.rows[0].id
        });
        } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.fetchAllProperties = async (req, res) => {
    const { locality_name } = req.query;
     try {
        const localityResult = await pool.query('SELECT id FROM localities WHERE name = $1', [locality_name]);
        if (localityResult.rows.length === 0) {
            return res.status(404).json({ error: 'Locality not found' });
        }
    const localityId = localityResult.rows[0].id;
    const propertiesResult = await pool.query(
            'SELECT id, name, owner_name FROM properties WHERE locality_id = $1',
            [localityId]
        );
      res.json(propertiesResult.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updatePropertyDetails = async (req, res) => {
    const { property_id, locality_name, owner_name } = req.body;
    try {
        const propertyResult = await pool.query('SELECT * FROM properties WHERE id = $1', [property_id]);
        if (propertyResult.rows.length === 0) {
            return res.status(404).json({ error: 'Property not found' });
        }
        let localityResult = await pool.query('SELECT id FROM localities WHERE name = $1', [locality_name]);
        if (localityResult.rows.length === 0) {
            localityResult = await pool.query('INSERT INTO localities (name) VALUES ($1) RETURNING id', [locality_name]);
        }
        const localityId = localityResult.rows[0].id;
        await pool.query(
            'UPDATE properties SET locality_id = $1, owner_name = $2 WHERE id = $3',
            [localityId, owner_name, property_id]
        );
        const updatedProperty = await pool.query('SELECT * FROM properties WHERE id = $1', [property_id]);
        res.json({
            message: 'Property updated successfully',
            property: updatedProperty.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deletePropertyRecord = async (req, res) => {
    const { property_id } = req.body;
    try {
        const propertyResult = await pool.query('SELECT * FROM properties WHERE id = $1', [property_id]);
        if (propertyResult.rows.length === 0) {
            return res.status(404).json({ error: 'Property not found' });
        }
        await pool.query('DELETE FROM properties WHERE id = $1', [property_id]);
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

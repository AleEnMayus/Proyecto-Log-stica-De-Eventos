// controllers/resourceController.js
const Resource = require('../models/Resources');

async function getResources(req, res) {
  try {
    const resources = await Resource.getAllResources();
    res.json(resources);
  } catch (err) {
    console.error('Error en getResources:', err); // 👈 Esto ayuda mucho
    res.status(500).json({ error: 'Error obteniendo recursos' });
  }
}

async function createResource(req, res) {
  try {
    const { ResourceName, Quantity, StatusDescription, Status, Price } = req.body;
    const newResource = await Resource.addResource(ResourceName, Quantity, StatusDescription, Status, Price);
    res.status(201).json(newResource);
  } catch (err) {
    res.status(500).json({ error: 'Error creando recurso' });
  }
}

async function updateResource(req, res) {
  try {
    const { ResourceName, Quantity, StatusDescription, Status, Price } = req.body;
    const updated = await Resource.updateResource(
      req.params.id,
      ResourceName,
      Quantity,
      StatusDescription,
      Status,
      Price
    );
    updated ? res.json(updated) : res.status(404).json({ error: 'Recurso no encontrado' });
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando recurso' });
  }
}

async function deleteResource(req, res) {
  try {
    const success = await Resource.deleteResource(req.params.id);
    success
      ? res.json({ message: 'Recurso eliminado' })
      : res.status(404).json({ error: 'Recurso no encontrado' });
  } catch (err) {
    res.status(500).json({ error: 'Error eliminando recurso' });
  }
}

module.exports = { getResources, createResource, updateResource, deleteResource };
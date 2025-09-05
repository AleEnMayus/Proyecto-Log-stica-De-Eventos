import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../components/components.css';
import '../../components/CSS/Lists.css';
import HeaderAdm from '../../components/HeaderAdm';

const ListResource  = () => {
  const [recursos, setRecursos] = useState([
    { id: 1, nombre: "Proyector", codigo: "PRJ-01", cantidad: 3, estado: "Disponible" },
    { id: 2, nombre: "Micrófono", codigo: "MIC-01", cantidad: 5, estado: "En uso" },
    { id: 3, nombre: "Silla", codigo: "SLL-01", cantidad: 50, estado: "Disponible" },
    { id: 4, nombre: "Mesa", codigo: "MSA-01", cantidad: 20, estado: "Mantenimiento" },
    { id: 5, nombre: "Parlante", codigo: "PRL-01", cantidad: 4, estado: "Disponible" },
    { id: 6, nombre: "Laptop", codigo: "LAP-01", cantidad: 8, estado: "Disponible" },
    { id: 7, nombre: "Cámara", codigo: "CAM-01", cantidad: 2, estado: "En uso" },
    { id: 8, nombre: "Trípode", codigo: "TRP-01", cantidad: 6, estado: "Disponible" },
    { id: 9, nombre: "Pizarra", codigo: "PIZ-01", cantidad: 10, estado: "Disponible" },
    { id: 10, nombre: "Cable HDMI", codigo: "CBL-01", cantidad: 15, estado: "Disponible" },
  ]);

  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [selectedResources, setSelectedResources] = useState([]);
  const recursosPorPagina = 5;

  // Filtrar recursos por búsqueda
  const recursosFiltrados = recursos.filter(recurso =>
    recurso.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    recurso.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
    recurso.estado.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Calcular paginación
  const totalPaginas = Math.ceil(recursosFiltrados.length / recursosPorPagina);
  const indiceInicio = (paginaActual - 1) * recursosPorPagina;
  const indiceFin = indiceInicio + recursosPorPagina;
  const recursosActuales = recursosFiltrados.slice(indiceInicio, indiceFin);

  const eliminarRecurso = (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este recurso?")) {
      setRecursos(recursos.filter(r => r.id !== id));
      // Ajustar página si es necesario
      if (recursosActuales.length === 1 && paginaActual > 1) {
        setPaginaActual(paginaActual - 1);
      }
    }
  };

  const editarRecurso = (id) => {
    alert(`Editando recurso con ID: ${id}`);
    // Aquí implementarías la lógica de edición
  };

  const toggleSelectResource = (id) => {
    setSelectedResources(prev => 
      prev.includes(id) 
        ? prev.filter(resourceId => resourceId !== id)
        : [...prev, id]
    );
  };

  const crearNuevoRecurso = () => {
    alert("Crear nuevo recurso");
    // Aquí implementarías la lógica para crear un nuevo recurso
  };

  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'disponible':
        return 'text-green-600 bg-green-50';
      case 'en uso':
        return 'text-blue-600 bg-blue-50';
      case 'mantenimiento':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <headerAdm />
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        LISTA DE RECURSOS
      </h1>

      {/* Buscador */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Buscar recurso</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, código o estado..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1); // Resetear a la primera página al buscar
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre del Recurso
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recursosActuales.map((recurso) => (
              <tr key={recurso.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedResources.includes(recurso.id)}
                    onChange={() => toggleSelectResource(recurso.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {recurso.nombre}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {recurso.codigo}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 text-center">
                    {recurso.cantidad}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(recurso.estado)}`}>
                    {recurso.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editarRecurso(recurso.id)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar recurso"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => eliminarRecurso(recurso.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar recurso"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {recursosActuales.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron recursos que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center mt-6 space-x-2">
          <button
            onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
            disabled={paginaActual === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
            <button
              key={pagina}
              onClick={() => setPaginaActual(pagina)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pagina === paginaActual
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {pagina}
            </button>
          ))}

          <button
            onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
            disabled={paginaActual === totalPaginas}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Botón Crear Registro */}
      <div className="flex justify-center mt-8">
        <button
          onClick={crearNuevoRecurso}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
        >
          <span>➕</span>
          <span>Crear Registro</span>
        </button>
      </div>

      {/* Información adicional */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Mostrando {indiceInicio + 1}-{Math.min(indiceFin, recursosFiltrados.length)} de {recursosFiltrados.length} recursos
      </div>
    </div>
  );
};

export default ListResource;
 
import React, { useState } from 'react';

const ResourceAssignmentList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedResources, setSelectedResources] = useState([]);

    const resources = [
        { id: 1, name: 'Content', code: 'Content', quantity: 'Content', status: 'Content' },
        { id: 2, name: 'Content', code: 'Content', quantity: 'Content', status: 'Content' },
        { id: 3, name: 'Content', code: 'Content', quantity: 'Content', status: 'Content' },
        { id: 4, name: 'Content', code: 'Content', quantity: 'Content', status: 'Content' },
        { id: 5, name: 'Content', code: 'Content', quantity: 'Content', status: 'Content' },
        { id: 6, name: 'Content', code: 'Content', quantity: 'Content', status: 'Content' },
        { id: 7, name: 'Content', code: 'Content', quantity: 'Content', status: 'Content' }
    ];

    const handleCheckboxChange = (resourceId) => {
        setSelectedResources(prev => 
            prev.includes(resourceId) 
                ? prev.filter(id => id !== resourceId)
                : [...prev, resourceId]
        );
    };

    const handleRegisterAssignment = () => {
        console.log('Registering assignment for resources:', selectedResources);
    };

    return (
        <div style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
            backgroundColor: '#f8f9fa',
            minHeight: '100vh',
            padding: '40px 20px'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{
                        fontSize: '1.8rem',
                        fontWeight: '600',
                        color: '#2c3e50',
                        marginBottom: '20px'
                    }}>
                        Asignación de recursos a eventos
                    </h1>
                </div>

                {/* Search Bar */}
                <div style={{
                    maxWidth: '400px',
                    position: 'relative',
                    marginBottom: '30px'
                }}>
                    <input
                        type="text"
                        placeholder="Buscar recurso"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 45px 12px 15px',
                            border: '1px solid #ddd',
                            borderRadius: '25px',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'border-color 0.3s ease'
                        }}
                    />
                    <svg 
                        style={{
                            position: 'absolute',
                            right: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#6c757d'
                        }}
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                    >
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                </div>

                {/* Table */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    marginBottom: '30px'
                }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse'
                    }}>
                        <thead>
                            <tr style={{
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #e9ecef'
                            }}>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    color: '#495057',
                                    fontSize: '14px'
                                }}>Nombre del Recurso</th>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    color: '#495057',
                                    fontSize: '14px'
                                }}>Código del Recurso</th>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    color: '#495057',
                                    fontSize: '14px'
                                }}>Cantidad de Recursos</th>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    color: '#495057',
                                    fontSize: '14px'
                                }}>Estado del Recurso</th>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    color: '#495057',
                                    fontSize: '14px'
                                }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map((resource) => (
                                <tr key={resource.id} style={{
                                    borderBottom: '1px solid #e9ecef',
                                    transition: 'background-color 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'white'}
                                >
                                    <td style={{
                                        padding: '15px',
                                        color: '#495057',
                                        fontSize: '14px'
                                    }}>{resource.name}</td>
                                    <td style={{
                                        padding: '15px',
                                        color: '#495057',
                                        fontSize: '14px'
                                    }}>{resource.code}</td>
                                    <td style={{
                                        padding: '15px',
                                        color: '#495057',
                                        fontSize: '14px'
                                    }}>{resource.quantity}</td>
                                    <td style={{
                                        padding: '15px',
                                        color: '#495057',
                                        fontSize: '14px'
                                    }}>{resource.status}</td>
                                    <td style={{
                                        padding: '15px',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedResources.includes(resource.id)}
                                                onChange={() => handleCheckboxChange(resource.id)}
                                                style={{
                                                    transform: 'scale(1.2)',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                            <span style={{
                                                fontSize: '12px',
                                                color: '#6c757d'
                                            }}>seleccionar</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '30px'
                }}>
                    <button style={{
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s ease'
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        </svg>
                    </button>
                    
                    <button style={{
                        padding: '8px 12px',
                        border: '1px solid #007bff',
                        backgroundColor: '#007bff',
                        color: 'white',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        minWidth: '40px'
                    }}>1</button>
                    
                    <button style={{
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        minWidth: '40px'
                    }}>2</button>
                    
                    <button style={{
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s ease'
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                    </button>
                </div>

                {/* Register Button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={handleRegisterAssignment}
                        style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '12px 30px',
                            borderRadius: '25px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 10px rgba(108, 117, 125, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#5a6268';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 15px rgba(108, 117, 125, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#6c757d';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 10px rgba(108, 117, 125, 0.2)';
                        }}
                    >
                        Registrar asignación
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResourceAssignmentList;
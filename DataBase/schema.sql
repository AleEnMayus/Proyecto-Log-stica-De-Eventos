DROP DATABASE IF EXISTS ProyectoLogisticaEventos;
CREATE DATABASE ProyectoLogisticaEventos;
USE ProyectoLogisticaEventos;

CREATE TABLE Usuario(
    IdUsuario int PRIMARY KEY AUTO_INCREMENT,
    Nombres varchar(50),
    TipoDocumento enum('CC', 'CE', 'PP'),
    NumDocumento varchar(20),
    FechaNacimiento date,
    CorreoElect varchar(50),
    Contraseña varchar(255),
    Estado enum('activo', 'inactivo'),
    Rol enum('user','admin'),
    Foto varchar(255)
);

CREATE TABLE Recursos(
    IdRecurso int PRIMARY KEY AUTO_INCREMENT,
    NombreRecurso varchar(50),
    Cantidad varchar(40),
    DescripcionEstado varchar(150),
    Estado enum('En uso','Disponible'),
    Precio float
);

CREATE TABLE Solicitudes (
    IdSolicitud int PRIMARY KEY AUTO_INCREMENT,
    FechaSolicitud datetime,
    FechaGestion datetime,
    DescripcionSolicitud varchar(30),
    TipoSolicitud ENUM ('agendar_cita', 'cancelar_evento', 'cambio_documento'),
    EstadoDeSolicitud ENUM ('pendiente', 'aprobada', 'rechazada'),
    IdUsuario int,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE Eventos (
    IdEvento int PRIMARY KEY AUTO_INCREMENT,
    NombreEvento varchar(50),
    IdCliente int,
    EstadoEvento ENUM('En planeación', 'En ejecución', 'Finalizado') DEFAULT 'En planeación',
    Capacidad varchar(25),
    PrecioEvento float,
    MetodoPagoAbono enum('Efectivo','Transferencia','Tarjeta'),
    FechaCreacion datetime,
    FechaHoraEvento datetime,
    Direccion varchar(50),
    DescripcionEvento varchar(500),
    Contrato BLOB,
    NumContrato INT,
    IdSolicitud INT,
    FOREIGN KEY (IdSolicitud) REFERENCES Solicitudes(IdSolicitud),
    FOREIGN KEY (IdCliente) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE RecursosEventos (
    IdRecursoEvento int PRIMARY KEY AUTO_INCREMENT,
    CantidadAsignada int,
    EstadoAsignacion enum('reservado', 'asignado', 'devuelto'),
    IdEvento int,
    IdRecurso int,
    Precios float,
    FOREIGN KEY (IdEvento) REFERENCES Eventos(IdEvento),
    FOREIGN KEY (IdRecurso) REFERENCES Recursos(IdRecurso)
);

CREATE TABLE Citas (
    IdCita int PRIMARY KEY AUTO_INCREMENT,
    FechaCita datetime,
    IdSolicitud int,
    IdUsuario int,
    FOREIGN KEY (IdSolicitud) REFERENCES Solicitudes(IdSolicitud),
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE ArchivoMultimedia (
    IdArchivo int PRIMARY KEY AUTO_INCREMENT,
    NombreArchivo varchar(50),
    RutaArchivo varchar(256),
    Extension enum('JPG','PNG'),
    IdUsuario int,
FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE Respuestas (
    IdRespuesta int PRIMARY KEY AUTO_INCREMENT,
    ValorNumerico int,
    IdEvento int,
    IdUsuario int,
    FOREIGN KEY (IdEvento) REFERENCES Eventos(IdEvento),
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE Preguntas (
    IdPregunta int PRIMARY KEY AUTO_INCREMENT,
    TextoPregunta text,
    IdRespuesta INT,
    FOREIGN KEY (IdRespuesta) REFERENCES Respuestas(IdRespuesta)
);



CREATE TABLE Comentarios (
    IdComentario int PRIMARY KEY AUTO_INCREMENT,
    TextoComentario text,
    EstadoComentario enum('pendiente', 'seleccionado', 'rechazado') DEFAULT 'pendiente',
    FechaPublicacion datetime,
    IdUsuario int,
    IdArchivoMultimedia int,
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario),
    FOREIGN KEY (IdArchivoMultimedia) REFERENCES ArchivoMultimedia(IdArchivo)
);

INSERT INTO Usuario (Nombres, TipoDocumento, NumDocumento, FechaNacimiento, CorreoElect, Contraseña, Estado, Rol) VALUES
('Juan Carlos', 'CC', '12345678', '1990-05-15', 'juan.perez@email.com', 'contraseña123', 'activo', 'user'),
('María Elena', 'CC', '87654321', '1988-08-22', 'maria.rodriguez@email.com', 'mipass456', 'activo', 'user'),
('Ana Patricia', 'CE', '98765432', '1995-12-10', 'ana.gomez@email.com', 'ana789', 'activo', 'admin'),
('Carlos Alberto', 'CC', '11223344', '1992-03-18', 'carlos.martinez@email.com', 'carlos321', 'activo', 'user'),
('Laura Sofía', 'PP', '55667788', '1987-11-25', 'laura.hernandez@email.com', 'laura654', 'inactivo', 'user');

INSERT INTO Recursos (NombreRecurso, Cantidad, DescripcionEstado, Estado, Precio) VALUES
('Mesas redondas', '20', 'Mesas de madera en buen estado', 'Disponible', 15000.00),
('Sillas plásticas', '100', 'Sillas blancas apilables', 'Disponible', 2500.00),
('Sonido profesional', '2', 'Equipo de sonido con micrófono', 'En uso', 150000.00),
('Carpas grandes', '5', 'Carpas de 6x4 metros resistentes', 'Disponible', 80000.00),
('Luces LED', '15', 'Luces decorativas multicolor', 'Disponible', 12000.00),
('Manteles blancos', '30', 'Manteles de tela para mesas', 'Disponible', 8000.00);

INSERT INTO Solicitudes (FechaSolicitud, FechaGestion, DescripcionSolicitud, TipoSolicitud, EstadoDeSolicitud, IdUsuario) VALUES
('2024-12-01 15:30:00', '2024-12-02 09:00:00', 'Solicitud de cita para boda', 'agendar_cita', 'aprobada', 1),
('2024-11-20 11:15:00', NULL, 'Cambio de documento de identidad', 'cambio_documento', 'pendiente', 2),
('2024-12-10 16:45:00', '2024-12-11 10:30:00', 'Cancelación de evento', 'cancelar_evento', 'rechazada', 4),
('2024-12-15 14:20:00', NULL, 'Agendar cita para evento', 'agendar_cita', 'pendiente', 5);

INSERT INTO Eventos (NombreEvento, IdCliente, EstadoEvento, Capacidad, PrecioEvento, MetodoPagoAbono, FechaCreacion, FechaHoraEvento, Direccion, DescripcionEvento, IdSolicitud) VALUES
('Boda de Juan y María', 1, 'En planeación', '80 personas', 2500000.00, 'Transferencia', '2024-12-01 10:00:00', '2025-02-14 16:00:00', 'Carrera 15 #45-30', 'Celebración de matrimonio con ceremonia religiosa y recepción', 1),
('Cumpleaños de Ana', 2, 'En ejecución', '50 personas', 800000.00, 'Efectivo', '2024-11-15 14:30:00', '2025-01-20 19:00:00', 'Calle 25 #12-45', 'Fiesta de cumpleaños número 30 con temática años 90', 2),
('Evento corporativo TechCorp', 4, 'Finalizado', '120 personas', 3200000.00, 'Tarjeta', '2024-10-10 09:00:00', '2024-12-15 18:00:00', 'Av. El Dorado #78-90', 'Conferencia anual de tecnología con cena de gala', 3);

INSERT INTO RecursosEventos (CantidadAsignada, EstadoAsignacion, IdEvento, IdRecurso, Precios) VALUES
(10, 'reservado', 1, 1, 150000),
(80, 'reservado', 1, 2, 200000),
(1, 'asignado', 2, 3, 150000),
(2, 'reservado', 1, 4, 160000),
(8, 'asignado', 2, 5, 96000),
(15, 'devuelto', 3, 1, 225000),
(10, 'reservado', 1, 6, 80000);

INSERT INTO Citas (FechaCita, IdSolicitud, IdUsuario) VALUES
('2024-12-05 10:00:00', 1, 1),
('2024-12-20 15:30:00', 4, 5);

INSERT INTO ArchivoMultimedia (NombreArchivo, RutaArchivo, Extension, IdUsuario) VALUES
('foto_boda_1.jpg', '/uploads/usuarios/1/foto_boda_1.jpg', 'JPG', 1),
('decoracion_cumple.png', '/uploads/usuarios/2/decoracion_cumple.png', 'PNG', 2),
('evento_corporativo.jpg', '/uploads/usuarios/4/evento_corporativo.jpg', 'JPG', 4),
('propuesta_decoracion.png', '/uploads/usuarios/1/propuesta_decoracion.png', 'PNG', 1);

INSERT INTO Preguntas (TextoPregunta, IdRespuesta) VALUES
('¿Qué tan satisfecho está con la organización del evento?', NULL),
('¿Recomendaría nuestros servicios a otros?', NULL),
('¿Cómo califica la calidad de los recursos utilizados?', NULL),
('¿Qué tan satisfecho está con la decoración del evento?', NULL),
('¿El evento cumplió con sus expectativas?', NULL),
('¿Cómo califica la puntualidad en la entrega?', NULL),
('¿Qué tan profesional fue el servicio brindado?', NULL);

INSERT INTO Respuestas (ValorNumerico, IdEvento, IdUsuario) VALUES
(5, 1, 1),
(4, 1, 1),
(5, 1, 1),
(4, 2, 2),
(5, 2, 2),
(3, 3, 4),
(4, 3, 4);

INSERT INTO Comentarios (TextoComentario, EstadoComentario, FechaPublicacion, IdUsuario, IdArchivoMultimedia) VALUES
('Excelente servicio para mi boda, todo salió perfecto', 'seleccionado', '2024-12-20 10:30:00', 1, 1),
('La decoración quedó hermosa, superó mis expectativas', 'pendiente', '2024-12-18 14:45:00', 2, 2),
('El evento corporativo fue muy profesional', 'seleccionado', '2024-12-16 16:20:00', 4, 3),
('Me gustó mucho la propuesta de decoración', 'pendiente', '2024-12-22 09:15:00', 1, 4);

CREATE OR REPLACE VIEW VistaSatisfaccionEventos AS
SELECT  e.IdEvento, e.NombreEvento, CONCAT(u.Nombres) AS Cliente, ROUND(AVG(r.ValorNumerico), 2) AS PromedioSatisfaccion, COUNT(r.IdRespuesta) AS TotalRespuestas
FROM Eventos e
JOIN Usuario u ON e.IdCliente = u.IdUsuario
JOIN Respuestas r ON e.IdEvento = r.IdEvento
GROUP BY e.IdEvento, e.NombreEvento, Cliente
ORDER BY PromedioSatisfaccion DESC;

DELIMITER //

CREATE PROCEDURE ObtenerEventosPorSatisfaccion (
    IN pMinimoPromedio DECIMAL(3,2)
)
BEGIN
    SELECT *
    FROM VistaSatisfaccionEventos
    WHERE PromedioSatisfaccion >= pMinimoPromedio
    ORDER BY PromedioSatisfaccion DESC;
END;
//

CALL ObtenerEventosPorSatisfaccion(1.5);
DROP DATABASE IF EXISTS ProyectoLogisticaEventos;
CREATE DATABASE ProyectoLogisticaEventos;
USE ProyectoLogisticaEventos;

CREATE TABLE Usuario(
    IdUsuario int PRIMARY KEY AUTO_INCREMENT,
    Nombres varchar(50),
    Apellidos varchar(50),
    TipoDocumento enum('CC', 'CE', 'PP'),
    NumDocumento varchar(20), 
    FechaNacimiento date,
    CorreoElect varchar(50),
    Contraseña varchar(255),
    Estado enum('activo', 'inactivo'),
    Rol enum('cliente','administrador')
);

CREATE TABLE Recursos(
    IdRecurso int PRIMARY KEY AUTO_INCREMENT,
    NombreRecurso varchar(50),
    Cantidad varchar(40),
    DescripcionEstado varchar(150),
    Estado enum('En uso','Disponible'),
    Precio float
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
    FOREIGN KEY (IdCliente) REFERENCES Usuario(IdUsuario)
);

CREATE TABLE RecursosEventos (
    IdRecursoEvento int PRIMARY KEY AUTO_INCREMENT,
    CantidadAsignada int,
    EstadoAsignacion enum('reservado', 'asignado', 'devuelto'),
    IdEvento int,
    IdRecurso int,
    FOREIGN KEY (IdEvento) REFERENCES Eventos(IdEvento),
    FOREIGN KEY (IdRecurso) REFERENCES Recursos(IdRecurso)
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
idUsuario int, 
FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
);


CREATE TABLE Encuestas (
    IdEncuesta int PRIMARY KEY AUTO_INCREMENT,
    FechaVencimiento datetime,
    IdEvento int,
    FOREIGN KEY (IdEvento) REFERENCES Eventos(IdEvento)
);

CREATE TABLE Preguntas (
    IdPregunta int PRIMARY KEY AUTO_INCREMENT,
    TextoPregunta text,
    IdEncuesta int,
    FOREIGN KEY (IdEncuesta) REFERENCES Encuestas(IdEncuesta)
);

CREATE TABLE Respuestas (
    IdRespuesta int PRIMARY KEY AUTO_INCREMENT,
    ValorNumerico int, 
    IdPregunta int,
    IdUsuario int,
    FOREIGN KEY (IdPregunta) REFERENCES Preguntas(IdPregunta),
    FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario)
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

CREATE TABLE Notificaciones (
    IdNotificacion int PRIMARY KEY AUTO_INCREMENT,
    URLEncuesta text,
    IdUsuarioDes int,
    FOREIGN KEY (IdUsuarioDes) REFERENCES Usuario(IdUsuario)
);
CREATE TABLE Contratos (
  IdContrato INT PRIMARY KEY AUTO_INCREMENT,
  NombreArchivo Varchar(100),
  RutaArchivo VARCHAR(255),
  IdUsuario INT,
  IdEvento INT,

  FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario),
  FOREIGN KEY (IdEvento) REFERENCES Eventos(IdEvento)
);
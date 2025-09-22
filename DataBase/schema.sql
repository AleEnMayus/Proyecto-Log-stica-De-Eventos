DROP DATABASE IF EXISTS ProyectoLogisticaEventos;
CREATE DATABASE ProyectoLogisticaEventos;
USE ProyectoLogisticaEventos;

-- Tabla de usuarios
CREATE TABLE User (
    UserId INT PRIMARY KEY AUTO_INCREMENT,
    Names VARCHAR(50),
    DocumentType ENUM('CC', 'CE', 'PP'),
    DocumentNumber VARCHAR(20),
    BirthDate DATE,
    Email VARCHAR(50),
    Password VARCHAR(255),
    Status ENUM('active', 'inactive'),
    Role ENUM('user','admin'),
    Photo VARCHAR(255)
);

-- Tabla de recursos
CREATE TABLE Resources (
    ResourceId INT PRIMARY KEY AUTO_INCREMENT,
    ResourceName VARCHAR(50),
    Quantity VARCHAR(40),
    StatusDescription VARCHAR(150),
    Status ENUM('In use','Available'),
    Price FLOAT
);

-- Tabla de eventos
CREATE TABLE Events (
    EventId INT PRIMARY KEY AUTO_INCREMENT,
    EventName VARCHAR(50),
    ClientId INT,
    EventStatus ENUM('In planning', 'In execution', 'Completed', 'Canceled') DEFAULT 'In planning',
    Capacity VARCHAR(25),
    EventPrice FLOAT,
    AdvancePaymentMethod ENUM('Cash','Transfer','Card'),
    CreationDate DATETIME,
    EventDateTime DATETIME,
    Address VARCHAR(50),
    EventDescription VARCHAR(500),
    ContractRoute VARCHAR(100),
    ContractNumber INT,
    FOREIGN KEY (ClientId) REFERENCES User(UserId)
);

-- Tabla de solicitudes
CREATE TABLE Requests (
    RequestId INT PRIMARY KEY AUTO_INCREMENT,
    RequestDate DATETIME,
    ManagementDate DATETIME,
    RequestDescription VARCHAR(500),
    RequestType ENUM('schedule_appointment', 'cancel_event', 'document_change'),
    RequestStatus ENUM('pending', 'approved', 'rejected'),
    UserId INT,
    EventId INT NULL,
    FOREIGN KEY (UserId) REFERENCES User(UserId),
    FOREIGN KEY (EventId) REFERENCES Events(EventId)
);

-- Tabla de recursos asignados a eventos
CREATE TABLE EventResources (
    EventResourceId INT PRIMARY KEY AUTO_INCREMENT,
    AssignedQuantity INT,
    AssignmentStatus ENUM('reserved', 'assigned', 'returned'),
    EventId INT,
    ResourceId INT,
    Prices FLOAT,
    FOREIGN KEY (EventId) REFERENCES Events(EventId),
    FOREIGN KEY (ResourceId) REFERENCES Resources(ResourceId)
);

-- Tabla de archivos multimedia
CREATE TABLE MultimediaFile (
    FileId INT PRIMARY KEY AUTO_INCREMENT,
    FileName VARCHAR(50),
    FilePath VARCHAR(256),
    Extension ENUM('JPG','PNG'),
    UserId INT,
    FOREIGN KEY (UserId) REFERENCES User(UserId)
);

-- Tabla de respuestas
CREATE TABLE Answers (
    AnswerId INT PRIMARY KEY AUTO_INCREMENT,
    NumericValue INT,
    EventId INT,
    UserId INT,
    FOREIGN KEY (EventId) REFERENCES Events(EventId),
    FOREIGN KEY (UserId) REFERENCES User(UserId)
);

-- Tabla de preguntas
CREATE TABLE Questions (
    QuestionId INT PRIMARY KEY AUTO_INCREMENT,
    QuestionText TEXT,
    AnswerId INT,
    FOREIGN KEY (AnswerId) REFERENCES Answers(AnswerId)
);

-- Tabla de comentarios
CREATE TABLE Comments (
    CommentId INT PRIMARY KEY AUTO_INCREMENT,
    CommentText TEXT,
    CommentStatus ENUM('pending', 'selected', 'rejected') DEFAULT 'pending',
    PublicationDate DATETIME,
    UserId INT,
    MultimediaFileId INT,
    FOREIGN KEY (UserId) REFERENCES User(UserId),
    FOREIGN KEY (MultimediaFileId) REFERENCES MultimediaFile(FileId)
);

-- Tabla para recuperación de contraseña
CREATE TABLE PasswordReset (
    Email VARCHAR(255) PRIMARY KEY,
    Code VARCHAR(10),
    CreatedAt DATETIME
);

-- Vista de satisfacción de eventos
CREATE OR REPLACE VIEW EventSatisfactionView AS
SELECT 
    e.EventId, 
    e.EventName, 
    u.Names AS Client, 
    ROUND(AVG(a.NumericValue), 2) AS SatisfactionAverage, 
    COUNT(a.AnswerId) AS TotalAnswers
FROM Events e
JOIN User u ON e.ClientId = u.UserId
JOIN Answers a ON e.EventId = a.EventId
GROUP BY e.EventId, e.EventName, Client
ORDER BY SatisfactionAverage DESC;

-- Procedimiento almacenado para filtrar eventos por satisfacción
DELIMITER //

CREATE PROCEDURE GetEventsBySatisfaction (
    IN pMinimumAverage DECIMAL(3,2)
)
BEGIN
    SELECT *
    FROM EventSatisfactionView
    WHERE SatisfactionAverage >= pMinimumAverage
    ORDER BY SatisfactionAverage DESC;
END;
//

DELIMITER ;

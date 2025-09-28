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

-- Tabla de eventos
CREATE TABLE Events (
    EventId INT PRIMARY KEY AUTO_INCREMENT,
    EventName VARCHAR(50),
    ClientId INT,
    EventStatus ENUM('In_planning', 'In_execution', 'Completed', 'Canceled') DEFAULT 'In_planning',
    Capacity INT, -- unificar a INT
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

-- Tabla de recursos
CREATE TABLE Resources (
    ResourceId INT PRIMARY KEY AUTO_INCREMENT,
    ResourceName VARCHAR(50),
    Quantity INT, -- unificar a INT para consistencia
    StatusDescription VARCHAR(150),
    Status ENUM('In_use','Available'), -- valores sin espacios
    Price FLOAT
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
    AnswerId INT NULL,
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
    Email VARCHAR(255),
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

-- Procedimiento para creación de códigos de recuperación con límite diario
DELIMITER //

CREATE PROCEDURE CreatePasswordResetCode(
    IN pEmail VARCHAR(255),
    IN pCode VARCHAR(10)
)
BEGIN
    DECLARE codes_today INT;

    -- Borrar códigos anteriores de este email (opcional, si quieres solo un código activo)
    DELETE FROM PasswordReset WHERE Email = pEmail;

    -- Contar cuántos códigos se han generado hoy
    SELECT COUNT(*) INTO codes_today
    FROM PasswordReset
    WHERE Email = pEmail AND DATE(CreatedAt) = CURDATE();

    IF codes_today >= 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Has alcanzado el límite de 5 códigos de recuperación para hoy.';
    ELSE
        INSERT INTO PasswordReset (Email, Code, CreatedAt)
        VALUES (pEmail, pCode, NOW());
    END IF;
END //

DELIMITER ;

-- Procedimiento para verificar códigos de recuperación
DELIMITER //
CREATE PROCEDURE CheckResetCode(
    IN pEmail VARCHAR(255),
    IN pCode VARCHAR(10)
)
BEGIN
    DECLARE code_count INT;

    SELECT COUNT(*) INTO code_count
    FROM PasswordReset
    WHERE Email = pEmail 
      AND Code = pCode
      AND CreatedAt >= NOW() - INTERVAL 15 MINUTE; -- Código válido 15 minutos

    IF code_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Código inválido o expirado.';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER DecreaseResourceQuantityAfteInsert
AFTER INSERT ON EventResources
FOR EACH ROW
BEGIN
  UPDATE Resources
  SET Quantity = Quantity - NEW.AssignedQuantity
  WHERE ResourceId = NEW.ResourceId;
END//

DELIMITER ;

DELIMITER //

CREATE TRIGGER ReturnResourcesAfterEventUpdate
AFTER UPDATE ON Events
FOR EACH ROW
BEGIN

  IF (NEW.EventStatus IN ('Completed', 'Canceled') AND OLD.EventStatus <> NEW.EventStatus) THEN
    
    UPDATE Resources r
    JOIN EventResources er ON r.ResourceId = er.ResourceId
    SET r.Quantity = r.Quantity + er.AssignedQuantity
    WHERE er.EventId = NEW.EventId;

  END IF;
END//

DELIMITER ;

-- Trigger para actualizar el estado del recurso a 'In_use' si la cantidad llega a cero

DELIMITER //

CREATE TRIGGER SetResourceInUseWhenZero
AFTER UPDATE ON Resources
FOR EACH ROW
BEGIN
  IF NEW.Quantity = 0 AND NEW.Status <> 'In_use' THEN
    UPDATE Resources
    SET Status = 'In_use'
    WHERE ResourceId = NEW.ResourceId;
  END IF;
END//

DELIMITER ;
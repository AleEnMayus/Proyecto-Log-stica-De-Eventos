-- ==========================================================
-- ELIMINACIÓN Y CREACIÓN DE BASE DE DATOS
-- ==========================================================
DROP DATABASE IF EXISTS ProyectoLogisticaEventos;
CREATE DATABASE ProyectoLogisticaEventos;
USE ProyectoLogisticaEventos;

-- ==========================================================
-- TABLA: USUARIOS
-- ==========================================================
CREATE TABLE User (
    UserId INT PRIMARY KEY AUTO_INCREMENT,
    Names VARCHAR(50) NOT NULL,
    DocumentType ENUM('CC', 'CE', 'PP') NOT NULL,
    DocumentNumber VARCHAR(20) NOT NULL UNIQUE,
    BirthDate DATE NOT NULL,
    Email VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Status ENUM('active', 'inactive') DEFAULT 'active',
    Role ENUM('user','admin') DEFAULT 'user',
    Photo VARCHAR(255),
    INDEX idx_email (Email),
    INDEX idx_status (Status)
);

-- ==========================================================
-- TABLA: EVENTOS
-- ==========================================================
CREATE TABLE Events (
    EventId INT PRIMARY KEY AUTO_INCREMENT,
    EventName VARCHAR(50) NOT NULL,
    ClientId INT NOT NULL,
    EventStatus ENUM('In_planning', 'In_execution', 'Completed', 'Canceled') DEFAULT 'In_planning',
    Capacity INT NOT NULL,
    AdvancePaymentMethod ENUM('Cash','Transfer','Card'),
    CreationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    EventDateTime DATETIME NOT NULL,
    Address VARCHAR(50) NOT NULL,
    EventDescription VARCHAR(500),
    ContractRoute VARCHAR(100),
    ContractNumber INT,
    FOREIGN KEY (ClientId) REFERENCES User(UserId) ON DELETE RESTRICT,
    INDEX idx_client (ClientId),
    INDEX idx_status (EventStatus),
    INDEX idx_datetime (EventDateTime)
);

-- ==========================================================
-- TABLA: RECURSOS
-- ==========================================================
CREATE TABLE Resources (
    ResourceId INT PRIMARY KEY AUTO_INCREMENT,
    ResourceName VARCHAR(50) NOT NULL,
    Quantity INT NOT NULL DEFAULT 0,
    StatusDescription VARCHAR(150),
    Status ENUM('In_use','Available') DEFAULT 'Available',
    Price FLOAT NOT NULL,
    INDEX idx_status (Status)
);

-- ==========================================================
-- TABLA: RECURSOS ASIGNADOS A EVENTOS
-- ==========================================================
CREATE TABLE EventResources (
    EventResourceId INT PRIMARY KEY AUTO_INCREMENT,
    AssignedQuantity INT NOT NULL,
    AssignmentStatus ENUM('reserved', 'assigned', 'returned') DEFAULT 'reserved',
    EventId INT NOT NULL,
    ResourceId INT NOT NULL,
    Prices FLOAT NOT NULL,
    FOREIGN KEY (EventId) REFERENCES Events(EventId) ON DELETE CASCADE,
    FOREIGN KEY (ResourceId) REFERENCES Resources(ResourceId) ON DELETE RESTRICT,
    INDEX idx_event (EventId),
    INDEX idx_resource (ResourceId),
    INDEX idx_status (AssignmentStatus)
);

-- ==========================================================
-- TABLA: SOLICITUDES
-- ==========================================================
CREATE TABLE Requests (
    RequestId INT PRIMARY KEY AUTO_INCREMENT,
    RequestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    ManagementDate DATETIME,
    RequestDescription VARCHAR(500) NOT NULL,
    RequestType ENUM('schedule_appointment', 'cancel_event', 'document_change') NOT NULL,
    RequestStatus ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    UserId INT NOT NULL,
    EventId INT NULL,
    FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE CASCADE,
    FOREIGN KEY (EventId) REFERENCES Events(EventId) ON DELETE SET NULL,
    INDEX idx_user (UserId),
    INDEX idx_status (RequestStatus)
);

-- ==========================================================
-- TABLA: ARCHIVOS MULTIMEDIA
-- ==========================================================
CREATE TABLE MultimediaFile (
    FileId INT PRIMARY KEY AUTO_INCREMENT,
    FileName VARCHAR(50) NOT NULL,
    FilePath VARCHAR(256) NOT NULL,
    Extension ENUM('JPG','PNG','JPEG') NOT NULL
);

-- ==========================================================
-- TABLA: PREGUNTAS
-- ==========================================================
CREATE TABLE Questions (
    QuestionId INT PRIMARY KEY AUTO_INCREMENT,
    QuestionText TEXT NOT NULL
);

-- ==========================================================
-- TABLA: RESPUESTAS
-- ==========================================================
CREATE TABLE Answers (
    AnswerId INT PRIMARY KEY AUTO_INCREMENT,
    NumericValue INT NOT NULL,
    EventId INT NOT NULL,
    UserId INT NOT NULL,
    QuestionId INT NOT NULL,
    FOREIGN KEY (EventId) REFERENCES Events(EventId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE CASCADE,
    FOREIGN KEY (QuestionId) REFERENCES Questions(QuestionId) ON DELETE CASCADE,
    INDEX idx_event (EventId),
    UNIQUE KEY unique_answer (EventId, UserId, QuestionId)
);

-- ==========================================================
-- TABLA: COMENTARIOS
-- ==========================================================
CREATE TABLE Comments (
    CommentId INT PRIMARY KEY AUTO_INCREMENT,
    CommentText TEXT NOT NULL,
    CommentStatus ENUM('pending', 'selected', 'rejected') DEFAULT 'pending',
    PublicationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UserId INT NOT NULL,
    MultimediaFileId INT,
    FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE CASCADE,
    FOREIGN KEY (MultimediaFileId) REFERENCES MultimediaFile(FileId) ON DELETE SET NULL,
    INDEX idx_user (UserId),
    INDEX idx_status (CommentStatus)
);

-- ==========================================================
-- TABLA: PROMOCIONES
-- ==========================================================
CREATE TABLE Promotions (
	PromotionId INT PRIMARY KEY AUTO_INCREMENT,
	TitleProm VARCHAR (25),
	DescriptionProm VARCHAR (255),
	Price DECIMAL(10,2),
	StatusProm ENUM('active', 'inactive') DEFAULT 'inactive'
);

-- ==========================================================
-- TABLA: ASIGNACION DE PROMOCIONES
-- ==========================================================

CREATE TABLE PromotionEvent (
    PromotionEventId INT AUTO_INCREMENT PRIMARY KEY,
    EventId INT,
    PromotionId INT,
    FOREIGN KEY (EventId) REFERENCES Events(EventId) ON DELETE CASCADE,
    FOREIGN KEY (PromotionId) REFERENCES Promotions(PromotionId) ON DELETE RESTRICT
);

-- ==========================================================
-- TABLA: RECUPERACIÓN DE CONTRASEÑAS
-- ==========================================================
CREATE TABLE PasswordReset (
    Email VARCHAR(255) PRIMARY KEY,
    Code VARCHAR(10) NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    SendAttempts TINYINT DEFAULT 1,
    LastSendAttempt DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created (CreatedAt)
);



-- ==========================================================
-- PROCEDIMIENTOS ALMACENADOS
-- ==========================================================

-- Crear código de recuperación
DELIMITER //
CREATE PROCEDURE CreatePasswordResetCode(
    IN pEmail VARCHAR(255),
    IN pCode VARCHAR(10)
)
BEGIN
    DECLARE vSendAttempts TINYINT;
    DECLARE vLastSend DATETIME;
    
    SELECT SendAttempts, LastSendAttempt
    INTO vSendAttempts, vLastSend
    FROM PasswordReset
    WHERE Email = pEmail;
    
    IF vSendAttempts IS NOT NULL THEN
        -- Reiniciar si pasaron 24 horas
        IF vLastSend < DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN
            SET vSendAttempts = 0;
        END IF;
        
        -- Validar límite de envíos
        IF vSendAttempts >= 5 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Has superado el límite de solicitudes. Intenta en 24 horas.';
        END IF;
        
        -- Validar tiempo entre envíos
        IF vLastSend > DATE_SUB(NOW(), INTERVAL 2 MINUTE) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Espera 2 minutos antes de solicitar un nuevo código.';
        END IF;
        
        SET vSendAttempts = vSendAttempts + 1;
    ELSE
        SET vSendAttempts = 1;
    END IF;
    
    REPLACE INTO PasswordReset (Email, Code, CreatedAt, SendAttempts, LastSendAttempt)
    VALUES (pEmail, pCode, NOW(), vSendAttempts, NOW());
END //
DELIMITER ;

-- Verificar código
DELIMITER //
CREATE PROCEDURE CheckResetCode(
    IN pEmail VARCHAR(255),
    IN pCode VARCHAR(10)
)
BEGIN
    DECLARE vStoredCode VARCHAR(10);
    DECLARE vCreatedAt DATETIME;

    SELECT Code, CreatedAt
    INTO vStoredCode, vCreatedAt
    FROM PasswordReset
    WHERE Email = pEmail;

    IF vStoredCode IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No existe código de recuperación para este correo.';
    END IF;

    IF vCreatedAt < DATE_SUB(NOW(), INTERVAL 15 MINUTE) THEN
        DELETE FROM PasswordReset WHERE Email = pEmail;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El código ha expirado. Solicita uno nuevo.';
    END IF;

    IF vStoredCode != pCode THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Código incorrecto.';
    END IF;
    
    DELETE FROM PasswordReset WHERE Email = pEmail;
END //
DELIMITER ;

-- ==========================================================
-- EVENTOS PROGRAMADOS
-- ==========================================================
SET GLOBAL event_scheduler = ON;

-- Limpieza automática
DELIMITER //
CREATE EVENT IF NOT EXISTS CleanupPasswordReset
ON SCHEDULE EVERY 6 HOUR
DO
BEGIN
  DELETE FROM PasswordReset
  WHERE CreatedAt < DATE_SUB(NOW(), INTERVAL 1 DAY);
END //
DELIMITER ;

-- Autocompletar eventos
DELIMITER //
CREATE EVENT IF NOT EXISTS AutoCompleteEvents
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
  UPDATE Events
  SET EventStatus = 'Completed'
  WHERE EventStatus = 'In_execution' 
    AND EventDateTime < NOW();
END //
DELIMITER ;

-- ==========================================================
-- VISTAS
-- ==========================================================

-- Satisfacción de eventos
CREATE OR REPLACE VIEW EventSatisfactionView AS
SELECT 
    e.EventId, 
    e.EventName, 
    u.Names AS Client, 
    ROUND(AVG(a.NumericValue), 2) AS SatisfactionAverage, 
    COUNT(a.AnswerId) AS TotalAnswers
FROM Events e
INNER JOIN User u ON e.ClientId = u.UserId
INNER JOIN Answers a ON e.EventId = a.EventId
GROUP BY e.EventId, e.EventName, u.Names
ORDER BY SatisfactionAverage DESC;

-- Disponibilidad de recursos
CREATE OR REPLACE VIEW ResourceAvailabilityView AS
SELECT 
    r.ResourceId,
    r.ResourceName,
    r.Quantity AS TotalQuantity,
    COALESCE(SUM(CASE 
        WHEN er.AssignmentStatus IN ('reserved', 'assigned') 
        THEN er.AssignedQuantity 
        ELSE 0 
    END), 0) AS AssignedQuantity,
    r.Quantity - COALESCE(SUM(CASE 
        WHEN er.AssignmentStatus IN ('reserved', 'assigned') 
        THEN er.AssignedQuantity 
        ELSE 0 
    END), 0) AS AvailableQuantity,
    r.Status,
    r.Price
FROM Resources r
LEFT JOIN EventResources er ON r.ResourceId = er.ResourceId
GROUP BY r.ResourceId, r.ResourceName, r.Quantity, r.Status, r.Price;

-- ==========================================================
-- TRIGGERS
-- ==========================================================

-- Actualizar fecha de gestion en solicitudes
DELIMITER //
CREATE TRIGGER SetManagementDate
BEFORE UPDATE ON  requests
FOR EACH ROW 
BEGIN
	IF NEW.RequestStatus IN ("approved","rejected")
		AND OLD.RequestStatus != NEW.RequestStatus THEN
		SET NEW.ManagementDate = curdate();
	END IF;
END//
	
-- Validar disponibilidad antes de asignar
DELIMITER //
CREATE TRIGGER ValidateResourceAvailability
BEFORE INSERT ON EventResources
FOR EACH ROW
BEGIN
    DECLARE vAvailableQty INT;
    
    SELECT AvailableQuantity INTO vAvailableQty
    FROM ResourceAvailabilityView
    WHERE ResourceId = NEW.ResourceId;
    
    IF vAvailableQty < NEW.AssignedQuantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cantidad insuficiente del recurso';
    END IF;
END//

-- Actualizar estado después de asignar
DELIMITER //
CREATE TRIGGER UpdateResourceStatusAfterAssignment
AFTER INSERT ON EventResources
FOR EACH ROW
BEGIN
    UPDATE Resources r
    SET r.Status = IF((
        SELECT AvailableQuantity 
        FROM ResourceAvailabilityView 
        WHERE ResourceId = NEW.ResourceId
    ) <= 0, 'In_use', 'Available')
    WHERE r.ResourceId = NEW.ResourceId;
END//

-- Actualizar estado al devolver
DELIMITER //
CREATE TRIGGER UpdateResourceStatusAfterReturn
AFTER UPDATE ON EventResources
FOR EACH ROW
BEGIN
    IF NEW.AssignmentStatus = 'returned' AND OLD.AssignmentStatus != 'returned' THEN
        UPDATE Resources r
        SET r.Status = IF((
            SELECT AvailableQuantity 
            FROM ResourceAvailabilityView 
            WHERE ResourceId = NEW.ResourceId
        ) > 0, 'Available', 'In_use')
        WHERE r.ResourceId = NEW.ResourceId;
    END IF;
END//

-- Devolver recursos al finalizar evento
DELIMITER //
CREATE TRIGGER ReturnResourcesAfterEventUpdate
AFTER UPDATE ON Events
FOR EACH ROW
BEGIN
    IF NEW.EventStatus IN ('Completed', 'Canceled') 
       AND OLD.EventStatus NOT IN ('Completed', 'Canceled') THEN
        UPDATE EventResources
        SET AssignmentStatus = 'returned'
        WHERE EventId = NEW.EventId
        AND AssignmentStatus IN ('reserved', 'assigned');
    END IF;
END//

-- ==========================================================
-- VERIFICAR CONFIGURACIÓN
-- ==========================================================
SHOW VARIABLES LIKE 'event_scheduler';

Insert into user (UserId, Names, DocumentType, DocumentNumber, BirthDate, Email, Password, Status, Role, Photo)
values (1, 'Ale', 'CC', '12345678901', '2000-04-08', 'apilogisticaeventos@gmail.com', 
  '$2b$10$MLOkf8gB3m72sxLgAmUK0uWzzMqF0wPuP947QkYy0LJAlArPM5xF.', 'active', 'user', NULL);

Insert into user (UserId, Names, DocumentType, DocumentNumber, BirthDate, Email, Password, Status, Role, Photo)
values (2, 'Ale', 'CC', '12345678902', '2000-04-08', 'admin@gmail.com', 
  '$2b$10$MLOkf8gB3m72sxLgAmUK0uWzzMqF0wPuP947QkYy0LJAlArPM5xF.', 'active', 'user', NULL);
        
UPDATE user
SET role = 'admin'
WHERE userid = 2;
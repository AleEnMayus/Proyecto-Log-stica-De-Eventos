-- ==========================================================
-- PROYECTO: SISTEMA DE LOGÍSTICA DE EVENTOS
-- Base de datos completa con tablas, vistas, triggers y procedimientos
-- ==========================================================

-- ==========================================================
-- SECCIÓN 1: CONFIGURACIÓN INICIAL DE BASE DE DATOS
-- ==========================================================

DROP DATABASE IF EXISTS ProyectoLogisticaEventos;
CREATE DATABASE ProyectoLogisticaEventos
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE ProyectoLogisticaEventos;

-- ==========================================================
-- SECCIÓN 2: DEFINICIÓN DE TABLAS PRINCIPALES
-- ==========================================================

-- ----------------------------------------------------------
-- Tabla: User
-- Almacena información de usuarios del sistema (clientes y administradores)
-- ----------------------------------------------------------
CREATE TABLE User (
    UserId INT PRIMARY KEY AUTO_INCREMENT,
    Names VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    DocumentType ENUM('CC', 'CE', 'PP') NOT NULL,
    DocumentNumber VARCHAR(20) NOT NULL UNIQUE,
    BirthDate DATE NOT NULL,
    Email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Status ENUM('active', 'inactive') DEFAULT 'active',
    Role ENUM('user','admin') DEFAULT 'user',
    Photo VARCHAR(255),
    INDEX idx_email (Email),
    INDEX idx_status (Status)
);

-- ----------------------------------------------------------
-- Tabla: Events
-- Gestiona eventos con sus detalles, fechas y estado
-- ----------------------------------------------------------
CREATE TABLE Events (
    EventId INT PRIMARY KEY AUTO_INCREMENT,
    EventName VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    ClientId INT NOT NULL,
    EventStatus ENUM('In_planning', 'In_execution', 'Completed', 'Canceled') DEFAULT 'In_planning',
    Capacity INT NOT NULL,
    EventPrice FLOAT NOT NULL,
    AdvancePaymentMethod ENUM('Cash','Transfer','Card'),
    CreationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    EventDateTime DATETIME NOT NULL,
    Address VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    EventDescription TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    ContractRoute VARCHAR(100),
    ContractNumber INT,
    FOREIGN KEY (ClientId) REFERENCES User(UserId) ON DELETE RESTRICT,
    INDEX idx_client (ClientId),
    INDEX idx_status (EventStatus),
    INDEX idx_datetime (EventDateTime)
);

-- ----------------------------------------------------------
-- Tabla: Resources
-- Inventario de recursos disponibles para eventos
-- ----------------------------------------------------------
CREATE TABLE Resources (
    ResourceId INT PRIMARY KEY AUTO_INCREMENT,
    ResourceName VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    Quantity INT NOT NULL DEFAULT 0,
    StatusDescription VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    Status ENUM('In_use','Available') DEFAULT 'Available',
    Price FLOAT NOT NULL,
    INDEX idx_status (Status)
);

-- ----------------------------------------------------------
-- Tabla: EventResources
-- Relación entre eventos y recursos asignados
-- ----------------------------------------------------------
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

-- ----------------------------------------------------------
-- Tabla: Requests
-- Solicitudes de clientes (citas, cancelaciones, cambios)
-- ----------------------------------------------------------
CREATE TABLE Requests (
    RequestId INT PRIMARY KEY AUTO_INCREMENT,
    RequestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    ManagementDate DATETIME,
    RequestDescription TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    RequestType ENUM('schedule_appointment', 'cancel_event', 'document_change') NOT NULL,
    RequestStatus ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    UserId INT NOT NULL,
    EventId INT NULL,
    FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE CASCADE,
    FOREIGN KEY (EventId) REFERENCES Events(EventId) ON DELETE SET NULL,
    INDEX idx_user (UserId),
    INDEX idx_status (RequestStatus)
);

-- ----------------------------------------------------------
-- Tabla: MultimediaFile
-- Archivos multimedia asociados a comentarios
-- ----------------------------------------------------------
CREATE TABLE MultimediaFile (
    FileId INT PRIMARY KEY AUTO_INCREMENT,
    FileName VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    FilePath VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    Extension ENUM('JPG','PNG','JPEG') NOT NULL
);

-- ----------------------------------------------------------
-- Tabla: Questions
-- Preguntas para encuestas de satisfacción
-- ----------------------------------------------------------
CREATE TABLE Questions (
    QuestionId INT PRIMARY KEY AUTO_INCREMENT,
    QuestionText TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
);

-- ----------------------------------------------------------
-- Tabla: Answers
-- Respuestas numéricas a encuestas de satisfacción
-- ----------------------------------------------------------
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

-- ----------------------------------------------------------
-- Tabla: Comments
-- Comentarios de usuarios con archivos multimedia opcionales
-- ----------------------------------------------------------
CREATE TABLE Comments (
    CommentId INT PRIMARY KEY AUTO_INCREMENT,
    CommentText TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CommentStatus ENUM('pending', 'selected', 'rejected') DEFAULT 'pending',
    PublicationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UserId INT NOT NULL,
    MultimediaFileId INT,
    FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE CASCADE,
    FOREIGN KEY (MultimediaFileId) REFERENCES MultimediaFile(FileId) ON DELETE SET NULL,
    INDEX idx_user (UserId),
    INDEX idx_status (CommentStatus)
);

-- ----------------------------------------------------------
-- Tabla: Promotions
-- Promociones y ofertas especiales del sistema
-- ----------------------------------------------------------
CREATE TABLE Promotions (
    PromotionId INT PRIMARY KEY AUTO_INCREMENT,
    TitleProm VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    DescriptionProm VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    Price DECIMAL(10,2)
);

-- ----------------------------------------------------------
-- Tabla: PasswordReset
-- Control de códigos de recuperación de contraseña
-- ----------------------------------------------------------
CREATE TABLE PasswordReset (
    Email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci PRIMARY KEY,
    Code VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    SendAttempts TINYINT DEFAULT 1,
    LastSendAttempt DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created (CreatedAt)
);

-- ==========================================================
-- SECCIÓN 3: PROCEDIMIENTOS ALMACENADOS
-- ==========================================================

-- ----------------------------------------------------------
-- Procedimiento: CreatePasswordResetCode
-- Genera código de recuperación con límites de seguridad
-- Límites: 5 intentos en 24 horas, 2 minutos entre envíos
-- ----------------------------------------------------------
DELIMITER //
CREATE PROCEDURE CreatePasswordResetCode(
    IN pEmail VARCHAR(255),
    IN pCode VARCHAR(10)
)
BEGIN
    DECLARE vSendAttempts TINYINT;
    DECLARE vLastSend DATETIME;
    
    -- Obtener intentos previos
    SELECT SendAttempts, LastSendAttempt
    INTO vSendAttempts, vLastSend
    FROM PasswordReset
    WHERE Email = pEmail;
    
    IF vSendAttempts IS NOT NULL THEN
        -- Reiniciar contador si pasaron 24 horas
        IF vLastSend < DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN
            SET vSendAttempts = 0;
        END IF;
        
        -- Validar límite máximo de intentos
        IF vSendAttempts >= 5 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Has superado el límite de solicitudes. Intenta en 24 horas.';
        END IF;
        
        -- Validar tiempo mínimo entre solicitudes
        IF vLastSend > DATE_SUB(NOW(), INTERVAL 2 MINUTE) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Espera 2 minutos antes de solicitar un nuevo código.';
        END IF;
        
        SET vSendAttempts = vSendAttempts + 1;
    ELSE
        SET vSendAttempts = 1;
    END IF;
    
    -- Insertar o actualizar código de recuperación
    REPLACE INTO PasswordReset (Email, Code, CreatedAt, SendAttempts, LastSendAttempt)
    VALUES (pEmail, pCode, NOW(), vSendAttempts, NOW());
END //
DELIMITER ;

-- ----------------------------------------------------------
-- Procedimiento: CheckResetCode
-- Valida código de recuperación y verifica expiración
-- Límite de expiración: 15 minutos
-- ----------------------------------------------------------
DELIMITER //
CREATE PROCEDURE CheckResetCode(
    IN pEmail VARCHAR(255),
    IN pCode VARCHAR(10)
)
BEGIN
    DECLARE vStoredCode VARCHAR(10);
    DECLARE vCreatedAt DATETIME;

    -- Obtener código almacenado
    SELECT Code, CreatedAt
    INTO vStoredCode, vCreatedAt
    FROM PasswordReset
    WHERE Email = pEmail;

    -- Validar existencia del código
    IF vStoredCode IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No existe código de recuperación para este correo.';
    END IF;

    -- Validar expiración del código
    IF vCreatedAt < DATE_SUB(NOW(), INTERVAL 15 MINUTE) THEN
        DELETE FROM PasswordReset WHERE Email = pEmail;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El código ha expirado. Solicita uno nuevo.';
    END IF;

    -- Validar código correcto
    IF vStoredCode != pCode THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Código incorrecto.';
    END IF;
    
    -- Eliminar código después de validación exitosa
    DELETE FROM PasswordReset WHERE Email = pEmail;
END //
DELIMITER ;

-- ==========================================================
-- SECCIÓN 4: EVENTOS PROGRAMADOS (TAREAS AUTOMÁTICAS)
-- ==========================================================

-- Activar el planificador de eventos
SET GLOBAL event_scheduler = ON;

-- ----------------------------------------------------------
-- Evento: CleanupPasswordReset
-- Elimina códigos de recuperación antiguos cada 6 horas
-- ----------------------------------------------------------
DELIMITER //
CREATE EVENT IF NOT EXISTS CleanupPasswordReset
ON SCHEDULE EVERY 6 HOUR
DO
BEGIN
    DELETE FROM PasswordReset
    WHERE CreatedAt < DATE_SUB(NOW(), INTERVAL 1 DAY);
END //
DELIMITER ;

-- ----------------------------------------------------------
-- Evento: AutoCompleteEvents
-- Marca eventos como completados automáticamente cada hora
-- ----------------------------------------------------------
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
-- SECCIÓN 5: VISTAS DEL SISTEMA
-- ==========================================================

-- ----------------------------------------------------------
-- Vista: ViewAssignedResources
-- Muestra recursos con cantidad asignada y disponible
-- ----------------------------------------------------------
CREATE VIEW ViewAssignedResources AS
SELECT 
    r.ResourceId,
    r.ResourceName,
    r.Quantity,
    r.StatusDescription,
    COALESCE(SUM(CASE WHEN er.AssignmentStatus = 'assigned' THEN er.AssignedQuantity END), 0) AS AssignedQuantity,
    r.Price
FROM Resources r
LEFT JOIN EventResources er ON r.ResourceId = er.ResourceId
GROUP BY r.ResourceId, r.ResourceName, r.Quantity, r.StatusDescription, r.Price;

-- ----------------------------------------------------------
-- Vista: UserCalendarView
-- Calendario de usuario con eventos y citas aprobadas
-- ----------------------------------------------------------
CREATE OR REPLACE VIEW UserCalendarView AS
SELECT 
    'event' AS type,
    e.EventId AS id,
    e.EventName AS title,
    e.EventDateTime AS start_date,
    e.EventStatus AS status,
    e.Address AS location,
    e.EventDescription AS description,
    e.Capacity,
    e.ClientId AS user_id,
    u.Names AS user_name,
    NULL AS request_id,
    NULL AS request_type
FROM Events e
INNER JOIN User u ON e.ClientId = u.UserId
WHERE e.EventStatus != 'Canceled'

UNION ALL

SELECT 
    'appointment' AS type,
    r.RequestId AS id,
    CONCAT(
        'Cita: ',
        CASE r.RequestType
            WHEN 'schedule_appointment' THEN 'Agendar'
            WHEN 'cancel_event' THEN 'Cancelación'
            WHEN 'document_change' THEN 'Cambio de documento'
        END
    ) AS title,
    r.RequestDate AS start_date,
    r.RequestStatus AS status,
    NULL AS location,
    r.RequestDescription AS description,
    NULL AS Capacity,
    r.UserId AS user_id,
    u.Names AS user_name,
    r.RequestId AS request_id,
    r.RequestType AS request_type
FROM Requests r
INNER JOIN User u ON r.UserId = u.UserId
WHERE r.RequestStatus = 'approved'
  AND r.RequestType = 'schedule_appointment'
  AND r.RequestDate IS NOT NULL;

-- ----------------------------------------------------------
-- Vista: AdminCalendarView
-- Calendario administrativo con información completa de eventos y citas
-- ----------------------------------------------------------
CREATE OR REPLACE VIEW AdminCalendarView AS
SELECT 
    'event' AS type,
    e.EventId AS id,
    e.EventName AS title,
    e.EventDateTime AS start_date,
    e.EventStatus AS status,
    e.Address AS location,
    e.EventDescription AS description,
    e.Capacity,
    e.ClientId AS user_id,
    u.Names AS user_name,
    u.Email AS user_email,
    e.AdvancePaymentMethod AS payment_method,
    e.ContractNumber AS contractNumber,
    NULL AS request_id,
    NULL AS request_type,
    NULL AS request_date
FROM Events e
INNER JOIN User u ON e.ClientId = u.UserId

UNION ALL

SELECT 
    'appointment' AS type,
    r.RequestId AS id,
    CONCAT(
        'Cita: ',
        u.Names,
        ' - ',
        CASE r.RequestType
            WHEN 'schedule_appointment' THEN 'Agendar'
            WHEN 'cancel_event' THEN 'Cancelación'
            WHEN 'document_change' THEN 'Cambio de documento'
        END
    ) AS title,
    r.RequestDate AS start_date,
    r.RequestStatus AS status,
    NULL AS location,
    r.RequestDescription AS description,
    NULL AS Capacity,
    r.UserId AS user_id,
    u.Names AS user_name,
    u.Email AS user_email,
    NULL AS payment_method,
    NULL AS contractNumber,
    r.RequestId AS request_id,
    r.RequestType AS request_type,
    r.RequestDate AS request_date
FROM Requests r
INNER JOIN User u ON r.UserId = u.UserId
WHERE r.RequestStatus = 'approved'
  AND r.RequestType = 'schedule_appointment'
  AND r.RequestDate IS NOT NULL;

-- ----------------------------------------------------------
-- Vista: EventSatisfactionView
-- Promedio de satisfacción por evento basado en encuestas
-- ----------------------------------------------------------
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

-- ----------------------------------------------------------
-- Vista: ResourceAvailabilityView
-- Disponibilidad en tiempo real de recursos del sistema
-- ----------------------------------------------------------
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

-- ----------------------------------------------------------
-- Vista: EventFeedbackDetailView
-- Detalle de respuestas a encuestas con información del usuario
-- ----------------------------------------------------------
CREATE OR REPLACE VIEW EventFeedbackDetailView AS
SELECT
    u.Names AS UserName,
    e.EventName,
    a.NumericValue AS Rating,
    q.QuestionText AS Question
FROM Answers a
INNER JOIN User u ON a.UserId = u.UserId
INNER JOIN Events e ON a.EventId = e.EventId
INNER JOIN Questions q ON a.QuestionId = q.QuestionId;

-- ==========================================================
-- SECCIÓN 6: TRIGGERS (DISPARADORES AUTOMÁTICOS)
-- ==========================================================

-- ----------------------------------------------------------
-- Trigger: SetManagementDate
-- Establece automáticamente la fecha de gestión al aprobar o rechazar solicitudes
-- ----------------------------------------------------------
DELIMITER //
CREATE TRIGGER SetManagementDate
BEFORE UPDATE ON Requests
FOR EACH ROW 
BEGIN
    IF NEW.RequestStatus IN ('approved', 'rejected')
       AND OLD.RequestStatus != NEW.RequestStatus THEN
        SET NEW.ManagementDate = NOW();
    END IF;
END//
DELIMITER ;

-- ----------------------------------------------------------
-- Trigger: ValidateResourceAvailability
-- Valida disponibilidad de recursos antes de asignación
-- ----------------------------------------------------------
DELIMITER //
CREATE TRIGGER ValidateResourceAvailability
BEFORE INSERT ON EventResources
FOR EACH ROW
BEGIN
    DECLARE vAvailableQty INT;
    
    -- Obtener cantidad disponible
    SELECT AvailableQuantity INTO vAvailableQty
    FROM ResourceAvailabilityView
    WHERE ResourceId = NEW.ResourceId;
    
    -- Validar suficiencia de recursos
    IF vAvailableQty < NEW.AssignedQuantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cantidad insuficiente del recurso';
    END IF;
END//
DELIMITER ;

-- ----------------------------------------------------------
-- Trigger: UpdateResourceAfterAssignment
-- Actualiza inventario y estado del recurso después de asignación
-- ----------------------------------------------------------
DELIMITER //
CREATE TRIGGER UpdateResourceAfterAssignment
AFTER INSERT ON EventResources
FOR EACH ROW
BEGIN
    -- Descontar cantidad asignada del inventario
    UPDATE Resources
    SET Quantity = Quantity - NEW.AssignedQuantity
    WHERE ResourceId = NEW.ResourceId;

    -- Actualizar estado según disponibilidad
    UPDATE Resources
    SET Status = IF(Quantity <= 0, 'In_use', 'Available')
    WHERE ResourceId = NEW.ResourceId;
END//
DELIMITER ;

-- ----------------------------------------------------------
-- Trigger: ReturnResourcesAfterEventUpdate
-- Devuelve recursos al inventario cuando un evento se completa o cancela
-- ----------------------------------------------------------
DELIMITER //
CREATE TRIGGER ReturnResourcesAfterEventUpdate
AFTER UPDATE ON Events
FOR EACH ROW
BEGIN
    IF NEW.EventStatus IN ('Completed', 'Canceled') 
       AND OLD.EventStatus NOT IN ('Completed', 'Canceled') THEN

        -- Marcar recursos como devueltos
        UPDATE EventResources
        SET AssignmentStatus = 'returned'
        WHERE EventId = NEW.EventId
          AND AssignmentStatus IN ('reserved', 'assigned');

        -- Devolver cantidad al inventario
        UPDATE Resources r
        INNER JOIN EventResources er ON r.ResourceId = er.ResourceId
        SET r.Quantity = r.Quantity + er.AssignedQuantity
        WHERE er.EventId = NEW.EventId
          AND er.AssignmentStatus = 'returned';

        -- Actualizar estado de recursos devueltos
        UPDATE Resources r
        INNER JOIN EventResources er ON r.ResourceId = er.ResourceId
        SET r.Status = 'Available'
        WHERE er.EventId = NEW.EventId
          AND er.AssignmentStatus = 'returned'
          AND r.Quantity > 0;
    END IF;
END//
DELIMITER ;

-- ==========================================================
-- SECCIÓN 7: DATOS INICIALES DEL SISTEMA
-- ==========================================================

-- ----------------------------------------------------------
-- Insertar usuarios de prueba (usuario regular y administrador)
-- Contraseña para ambos: hasheada con bcrypt
-- ----------------------------------------------------------
INSERT INTO User (UserId, Names, DocumentType, DocumentNumber, BirthDate, Email, Password, Status, Role, Photo)
VALUES 
(1, 'Ale', 'CC', '12345678901', '2000-04-08', 'apilogisticaeventos@gmail.com', 
  '$2b$10$MLOkf8gB3m72sxLgAmUK0uWzzMqF0wPuP947QkYy0LJAlArPM5xF.', 'active', 'user', NULL),
(2, 'Ale', 'CC', '12345678902', '2000-04-08', 'admin@gmail.com', 
  '$2b$10$MLOkf8gB3m72sxLgAmUK0uWzzMqF0wPuP947QkYy0LJAlArPM5xF.', 'active', 'user', NULL);

-- Actualizar rol de administrador
UPDATE User
SET Role = 'admin'
WHERE UserId = 2;

-- ==========================================================
-- SECCIÓN 8: VERIFICACIÓN DE CONFIGURACIÓN
-- ==========================================================

-- Verificar que el planificador de eventos esté activo
SHOW VARIABLES LIKE 'event_scheduler';
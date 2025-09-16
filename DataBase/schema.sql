DROP DATABASE IF EXISTS ProyectoLogisticaEventos;
CREATE DATABASE ProyectoLogisticaEventos;
USE ProyectoLogisticaEventos;

CREATE TABLE User(
    UserId int PRIMARY KEY AUTO_INCREMENT,
    Names varchar(50),
    DocumentType enum('CC', 'CE', 'PP'),
    DocumentNumber varchar(20),
    BirthDate date,
    Email varchar(50),
    Password varchar(255),
    Status enum('active', 'inactive'),
    Role enum('user','admin'),
    Photo varchar(255)
);

CREATE TABLE Resources(
    ResourceId int PRIMARY KEY AUTO_INCREMENT,
    ResourceName varchar(50),
    Quantity varchar(40),
    StatusDescription varchar(150),
    Status enum('In use','Available'),
    Price float
);

CREATE TABLE Requests (
    RequestId int PRIMARY KEY AUTO_INCREMENT,
    RequestDate datetime,
    ManagementDate datetime,
    RequestDescription varchar(30),
    RequestType ENUM ('schedule_appointment', 'cancel_event', 'document_change'),
    RequestStatus ENUM ('pending', 'approved', 'rejected'),
    UserId int,
    FOREIGN KEY (UserId) REFERENCES User(UserId)
);

CREATE TABLE Events (
    EventId int PRIMARY KEY AUTO_INCREMENT,
    EventName varchar(50),
    ClientId int,
    EventStatus ENUM('In planning', 'In execution', 'Completed') DEFAULT 'In planning',
    Capacity varchar(25),
    EventPrice float,
    AdvancePaymentMethod enum('Cash','Transfer','Card'),
    CreationDate datetime,
    EventDateTime datetime,
    Address varchar(50),
    EventDescription varchar(500),
    ContractRoute varchar(100),
    ContractNumber INT,
    FOREIGN KEY (ClientId) REFERENCES User(UserId)
);

CREATE TABLE EventResources (
    EventResourceId int PRIMARY KEY AUTO_INCREMENT,
    AssignedQuantity int,
    AssignmentStatus enum('reserved', 'assigned', 'returned'),
    EventId int,
    ResourceId int,
    Prices float,
    FOREIGN KEY (EventId) REFERENCES Events(EventId),
    FOREIGN KEY (ResourceId) REFERENCES Resources(ResourceId)
);

/*
CREATE TABLE Appointments (
    AppointmentId int PRIMARY KEY AUTO_INCREMENT,
    AppointmentDate datetime,
    RequestId int,
    UserId int,
    FOREIGN KEY (RequestId) REFERENCES Requests(RequestId),
    FOREIGN KEY (UserId) REFERENCES User(UserId)
);
*/

CREATE TABLE MultimediaFile (
    FileId int PRIMARY KEY AUTO_INCREMENT,
    FileName varchar(50),
    FilePath varchar(256),
    Extension enum('JPG','PNG'),
    UserId int,
FOREIGN KEY (UserId) REFERENCES User(UserId)
);

CREATE TABLE Answers (
    AnswerId int PRIMARY KEY AUTO_INCREMENT,
    NumericValue int,
    EventId int,
    UserId int,
    FOREIGN KEY (EventId) REFERENCES Events(EventId),
    FOREIGN KEY (UserId) REFERENCES User(UserId)
);

CREATE TABLE Questions (
    QuestionId int PRIMARY KEY AUTO_INCREMENT,
    QuestionText text,
    AnswerId INT,
    FOREIGN KEY (AnswerId) REFERENCES Answers(AnswerId)
);

CREATE TABLE Comments (
    CommentId int PRIMARY KEY AUTO_INCREMENT,
    CommentText text,
    CommentStatus enum('pending', 'selected', 'rejected') DEFAULT 'pending',
    PublicationDate datetime,
    UserId int,
    MultimediaFileId int,
    FOREIGN KEY (UserId) REFERENCES User(UserId),
    FOREIGN KEY (MultimediaFileId) REFERENCES MultimediaFile(FileId)
);

CREATE TABLE PasswordReset (
  Email VARCHAR(255) PRIMARY KEY,
  Code VARCHAR(10),
  CreatedAt DATETIME
);

CREATE OR REPLACE VIEW EventSatisfactionView AS
SELECT  e.EventId, e.EventName, Names AS Client, ROUND(AVG(a.NumericValue), 2) AS SatisfactionAverage, COUNT(a.AnswerId) AS TotalAnswers
FROM Events e
JOIN User u ON e.ClientId = u.UserId
JOIN Answers a ON e.EventId = a.EventId
GROUP BY e.EventId, e.EventName, Client
ORDER BY SatisfactionAverage DESC;

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
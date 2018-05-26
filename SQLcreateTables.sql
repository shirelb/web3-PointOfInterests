--CREATE TABLE Users (
--	userId int NOT NULL IDENTITY(1,1) ,
--	firstName varchar(255),
--	lastName varchar(255),
--	city varchar(255),
--	country varchar(255),
--	username varchar(255),
--	password varchar(255),
--	email varchar(255),
--);

--CREATE TABLE QaRestorePassword (
--	userId int,	
--	question varchar(255),
--	answer varchar(255)
--);

--CREATE TABLE UserCategories (
--	userId int,	
--	category varchar(255)
--);

--CREATE TABLE FavoritePoints (
--	userId int,	
--	pointId int,
--	orderNum int,
--  savedDate date
--);

--CREATE TABLE PointsOfInterest (
--	pointId int NOT NULL IDENTITY(1,1) ,
--	name varchar(255),
--	category varchar(255),
--	rating real,
--	views int,
--	description text,
--	picture image
--);

--CREATE TABLE Categories (
--	category varchar(255)
--);

--CREATE TABLE Countries (
--	country varchar(255)
--);

--CREATE TABLE Reviews (
--	userId int,	
--	pointId int,
--	rate int,
--	reviewMsg text,
--	reviewDate date
--);

--DROP TABLE PointsOfInterest
--DROP TABLE Users

--ALTER TABLE PointsOfInterest DROP COLUMN pointId 
--ALTER TABLE PointsOfInterest ADD pointId INT NOT NULL IDENTITY(1,1) 

--ALTER TABLE Users DROP COLUMN userId 
--ALTER TABLE Users ADD userId INT NOT NULL IDENTITY(1,1) 

--ALTER TABLE Users DROP COLUMN username 
--ALTER TABLE Users ADD username varchar(255) NOT NULL UNIQUE

--ALTER TABLE Reviews ADD reviewDate date

--DROP TABLE Reviews

--ALTER TABLE FavoritePoints ADD savedDate date
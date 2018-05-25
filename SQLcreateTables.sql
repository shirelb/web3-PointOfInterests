CREATE TABLE Users (
	userId int,
	firstName varchar(255),
	lastName varchar(255),
	city varchar(255),
	country varchar(255),
	username varchar(255),
	password varchar(255),
	email varchar(255),
);

CREATE TABLE QaRestorePassword (
	userId int,	
	question varchar(255),
	answer varchar(255)
);

CREATE TABLE UserCategories (
	userId int,	
	category varchar(255)
);

CREATE TABLE FavoritePoints (
	userId int,	
	pointId int,
	orderNum int
);

CREATE TABLE PointsOfInterest (
	pointId int,
	name varchar(255),
	category varchar(255),
	rating real,
	views int,
	description text,
	picture text
);

CREATE TABLE Categories (
	category varchar(255)
);

CREATE TABLE Countries (
	id int,
	country varchar(255)
);

CREATE TABLE Reviews (
	userId int,	
	pointId int,
	reviewMsg text,
	rate int
);
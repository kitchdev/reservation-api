CREATE TABLE roles (
    id serial PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    permissions TEXT[]
);

CREATE TABLE users (
    id serial PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    role_id serial REFERENCES roles(id)
);

create table lanes (
	id serial primary key,
	lane_number int not null unique,
	max_capacity int not null default 5
);


create table reservations (
	id SERIAL primary key,
	user_id INT not null, 
	reservation_date date not null,
	reservation_time time not null,
	duration_minutes int not null,
	create_at timestamp default current_timestamp,
	status VARCHAR(20) default 'confirmed',
	foreign key (user_id) references users(id)
);

create table availability (
	id serial primary key,
	day_of_week varchar(10) not null,
	start_time time not null,
	end_time time not null
);

create table blocked_dates (
	id serial primary key,
	blocked_date date not null,
	reason varchar(255)
);

create table reservation_lanes (
	id serial primary key,
	reservation_id int not null,
	lane_id int not null,
	foreign key (reservation_id) references reservations(id),
	foreign key (lane_id) references lanes(id)
);


INSERT INTO Blocked_Dates (blocked_date, reason) VALUES
('2024-07-04', 'Independence Day'),
('2024-12-25', 'Christmas Day');




INSERT INTO Availability (day_of_week, start_time, end_time) VALUES
('Monday', '09:00:00', '12:00:00'),
('Monday', '15:00:00', '17:00:00'),
('Monday', '18:00:00', '22:00:00'),
('Tuesday', '12:00:00', '16:00:00'),
('Tuesday', '19:00:00', '22:00:00'),
('Wednesday', '12:00:00', '16:00:00'),
('Wednesday', '19:00:00', '22:00:00'),
('Thursday', '09:00:00', '12:00:00'),
('Thursday', '15:00:00', '17:00:00'),
('Thursday', '18:00:00', '22:00:00'),
('Friday', '12:00:00', '16:00:00'),
('Friday', '19:00:00', '22:00:00'),
('Saturday', '09:00:00', '12:00:00'),
('Saturday', '15:00:00', '17:00:00'),
('Saturday', '18:00:00', '22:00:00'),
('Sunday', '09:00:00', '12:00:00'),
('Sunday', '15:00:00', '17:00:00'),
('Sunday', '18:00:00', '22:00:00');


insert  into lanes (lane_number, max_capacity) values 
(1, 5),
(2, 5),
(3, 5),
(4, 5),
(5, 5),
(6, 5),
(7, 5),
(8, 5);


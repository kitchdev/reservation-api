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

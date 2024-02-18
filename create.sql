drop schema cccat15 cascade;

create schema cccat15;

create table cccat15.account (
account_id uuid,
name text,
email text,
cpf text,
car_plate text,
is_passenger boolean,
is_driver boolean,
password text,
password_algorithm text,
salt text
);



create table cccat15.ride (
ride_id uuid,
passenger_id uuid,
driver_id uuid,
status text,
fare numeric,
distance numeric,
from_lat numeric,
from_long numeric,
to_lat numeric,
to_long numeric,
last_lat numeric,
last_long numeric,
date timestamp
);



create table cccat15.position (
position_id uuid primary key,
ride_id uuid,
lat numeric,
long numeric,
date timestamp
);


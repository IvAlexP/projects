CREATE TABLE address
(
    id        SERIAL PRIMARY KEY,
    latitude  DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL
);


CREATE TABLE status
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE users
(
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(100)       NOT NULL,
    address_id    INT REFERENCES address (id)
);


CREATE TABLE roles
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);


CREATE TABLE user_roles
(
    user_id INT NOT NULL REFERENCES users (id),
    role_id INT NOT NULL REFERENCES roles (id),
    PRIMARY KEY (user_id, role_id)
);


CREATE TABLE orders
(
    id          SERIAL PRIMARY KEY,
    id_courier  INT REFERENCES users (id),
    id_client   INT REFERENCES users (id) NOT NULL,
    address_id  INT REFERENCES address (id),
    description VARCHAR(32672)            NOT NULL,
    status_id   INT REFERENCES status (id)
);


INSERT INTO roles(name)
VALUES ('client'),
       ('courier'),
       ('admin');

INSERT INTO status(name)
VALUES ('unallocated'),
       ('pending'),
       ('done');

-- # SCRIPT PARA LA CREACIÓN DE LA BASE DE DATOS: Cine_SD

-- 0. ELIMINAR BASE DE DATOS Y USUARIO SI EXISTEN
DROP DATABASE IF EXISTS Cine_SD;
DROP USER IF EXISTS 'sd_cine'@'%';

-- 1. CREACIÓN DE LA BASE DE DATOS
CREATE DATABASE Cine_SD
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE Cine_SD;

-- 2. CREACIÓN DE USUARIO Y PERMISOS
CREATE USER 'sd_cine'@'%' IDENTIFIED BY '123456789@';
GRANT ALL PRIVILEGES ON Cine_SD.* TO 'sd_cine'@'%';
FLUSH PRIVILEGES;

-- 3. CREACIÓN DE TABLAS Y RESTRICCIONES
------------------------------------------------------------

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE movies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  description TEXT
);

CREATE TABLE rooms (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  capacity INT NOT NULL
);

CREATE TABLE showtimes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  movie_id BIGINT NOT NULL,
  room_id BIGINT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE seats (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  room_id BIGINT NOT NULL,
  seat_number INT NOT NULL,
  `row` VARCHAR(10) NOT NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE tickets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  showtime_id BIGINT NOT NULL,
  seat_id BIGINT NOT NULL,
  purchase_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id),
  FOREIGN KEY (seat_id) REFERENCES seats(id)
);

-- 4. ÍNDICES SECUNDARIOS
------------------------------------------------------------

CREATE INDEX idx_showtimes_movie ON showtimes(movie_id);
CREATE INDEX idx_tickets_user ON tickets(user_id);
CREATE INDEX idx_seats_room ON seats(room_id);

-- 5. DATOS DE EJEMPLO
------------------------------------------------------------

INSERT INTO users (name, email, password) VALUES
  ('Carlos', 'carlos@example.com', 'password123'),
  ('Lucía', 'lucia@example.com', 'lucia_pass'),
  ('Ana', 'ana@example.com', 'ana123');

INSERT INTO movies (title, duration, description) VALUES
  ('Inception', 148, 'A mind-bending thriller'),
  ('Interstellar', 169, 'Exploring space and time'),
  ('The Matrix', 136, 'Virtual reality and rebellion');

INSERT INTO rooms (name, capacity) VALUES
  ('Sala 1', 100),
  ('Sala 2', 80);

INSERT INTO showtimes (movie_id, room_id, start_time) VALUES
  (1, 1, '2025-06-15 18:00:00'),
  (2, 2, '2025-06-15 20:30:00');

-- Asumimos que la sala 1 tiene 5 filas con 10 asientos cada una
INSERT INTO seats (room_id, seat_number, `row`) VALUES
  (1, 1, 'A'), (1, 2, 'A'), (1, 3, 'A'), (1, 4, 'A'), (1, 5, 'A'),
  (1, 1, 'B'), (1, 2, 'B'), (1, 3, 'B'), (1, 4, 'B'), (1, 5, 'B');

-- Venta de ticket de prueba
INSERT INTO tickets (user_id, showtime_id, seat_id) VALUES
  (1, 1, 1),
  (2, 2, 6);

-- 6. PROCEDIMIENTO ALMACENADO: Comprar entrada
------------------------------------------------------------

DELIMITER $$

CREATE PROCEDURE sp_ComprarTicket (
  IN p_user_id BIGINT,
  IN p_showtime_id BIGINT,
  IN p_seat_id BIGINT,
  OUT p_mensaje VARCHAR(200)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SET p_mensaje = 'Error: no se pudo completar la compra.';
  END;

  START TRANSACTION;

  IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
    SET p_mensaje = 'Error: Usuario no válido.';
    ROLLBACK;
  ELSEIF NOT EXISTS (SELECT 1 FROM showtimes WHERE id = p_showtime_id) THEN
    SET p_mensaje = 'Error: Función no válida.';
    ROLLBACK;
  ELSEIF NOT EXISTS (SELECT 1 FROM seats WHERE id = p_seat_id) THEN
    SET p_mensaje = 'Error: Asiento no válido.';
    ROLLBACK;
  ELSEIF EXISTS (
    SELECT 1 FROM tickets
    WHERE showtime_id = p_showtime_id AND seat_id = p_seat_id
  ) THEN
    SET p_mensaje = 'Error: Ese asiento ya está ocupado.';
    ROLLBACK;
  ELSE
    INSERT INTO tickets (user_id, showtime_id, seat_id)
    VALUES (p_user_id, p_showtime_id, p_seat_id);
    COMMIT;
    SET p_mensaje = 'Compra realizada con éxito.';
  END IF;
END$$

DELIMITER ;


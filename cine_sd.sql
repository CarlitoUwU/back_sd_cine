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
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE movies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  url_poster VARCHAR(255),
  url_background VARCHAR(255),
  url_trailer VARCHAR(255),
  genre VARCHAR(255),
  rating FLOAT,
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
  format VARCHAR(100) NOT NULL,
  price FLOAT NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE seats (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  room_id BIGINT NOT NULL,
  seat_number INT NOT NULL,
  `row` VARCHAR(10) NOT NULL,
  is_occupied TINYINT(1) NOT NULL DEFAULT 0,
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

DELIMITER $$

CREATE TRIGGER trg_after_insert_room
AFTER INSERT ON rooms
FOR EACH ROW
BEGIN
  DECLARE total_rows INT;
  DECLARE current_row INT DEFAULT 1;
  DECLARE seat_num INT;
  DECLARE row_letter CHAR(1);

  SET total_rows = NEW.capacity / 10;

  WHILE current_row <= total_rows DO
    SET row_letter = CHAR(64 + current_row); -- 65 = 'A'

    SET seat_num = 1;
    WHILE seat_num <= 10 DO
      INSERT INTO seats (room_id, seat_number, `row`, is_occupied)
      VALUES (NEW.id, seat_num, row_letter, 0);

      SET seat_num = seat_num + 1;
    END WHILE;

    SET current_row = current_row + 1;
  END WHILE;

END$$

DELIMITER ;

-- 5. DATOS DE EJEMPLO EXTENDIDOS


-- Usuarios
INSERT INTO users (first_name, last_name, email, password) VALUES
  ('Carlos', 'Valdivia', 'carlos@example.com', 'password123'),
  ('Lucía', 'Luna', 'lucia@example.com', 'lucia_pass'),
  ('Ana', 'Choque', 'ana@example.com', 'ana123'),
  ('Pedro', 'Martínez', 'pedro@example.com', 'pedro123'),
  ('María', 'Gómez', 'maria@example.com', 'maria123'),
  ('Juan', 'Pérez', 'juan@example.com', 'juan123'),
  ('Laura', 'Sánchez', 'laura@example.com', 'laura123'),
  ('David', 'López', 'david@example.com', 'david123');

-- Películas (18 películas)
INSERT INTO movies (id, title, duration, description, genre, rating, url_poster, url_background, url_trailer) VALUES
(1, 'Interstellar', 169, 'Un grupo de exploradores se embarca en el viaje más importante en la historia de la humanidad.', 'Ciencia ficción', 4.8, 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg', 'https://www.youtube.com/embed/zSWdZVtXT7E'),
(2, 'Inception', 148, 'Dom Cobb es un ladrón con una rara habilidad para entrar en los sueños de la gente.', 'Thriller psicológico', 4.7, 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg', 'https://www.youtube.com/embed/YoHD9XEInc0'),
(3, 'Toy Story', 81, 'Los juguetes de Andy, un niño de 6 años, temen que un nuevo regalo los sustituya.', 'Animación', 4.5, 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg', 'https://image.tmdb.org/t/p/original/dji4Fm0gCDVb9DQQMRvAI8YNnTz.jpg', 'https://www.youtube.com/embed/wmiIUN-7qhE'),
(4, 'The Dark Knight', 152, 'Batman tiene que mantener el equilibrio entre el heroísmo y el vigilantismo.', 'Acción', 4.9, 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 'https://image.tmdb.org/t/p/original/h3jYanWMEJq6JJsCopy1h7cT2Hs.jpg', 'https://www.youtube.com/embed/EXeTwQWrcwY'),
(5, 'Pulp Fiction', 154, 'Las vidas de dos mafiosos, un boxeador y un par de bandidos se entrelazan.', 'Crimen', 4.6, 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 'https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg', 'https://www.youtube.com/embed/s7EdQ4FqbhY'),
(6, 'The Shawshank Redemption', 142, 'Un banquero es condenado a cadena perpetua por el asesinato de su esposa.', 'Drama', 4.9, 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', 'https://image.tmdb.org/t/p/original/wPU78OPN4BYEgWYdXyg0phMee64.jpg', 'https://www.youtube.com/embed/6hB3S9bIaco'),
(7, 'Avengers: Endgame', 181, 'Los Vengadores se reúnen una vez más para revertir los acontecimientos de Infinity War.', 'Acción', 4.8, 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg', 'https://www.youtube.com/embed/TcMBFSGVi1c'),
(8, 'The Godfather', 175, 'La historia de la familia criminal Corleone bajo el patriarca Vito Corleone.', 'Crimen', 4.9, 'https://image.tmdb.org/t/p/w500/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg', 'https://image.tmdb.org/t/p/original/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg', 'https://www.youtube.com/embed/sY1S34973zA'),
(9, 'Parasite', 132, 'Todos aspiran a salir de la pobreza y cuando los Kim infiltran a los Park, sus vidas cambian.', 'Drama', 4.6, 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', 'https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg', 'https://www.youtube.com/embed/5xH0HfJHsaY'),
(10, 'Spirited Away', 125, 'Chihiro se encuentra en un mundo de dioses y brujas cuando sus padres son transformados.', 'Animación', 4.7, 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', 'https://image.tmdb.org/t/p/original/AbuyZE9qOB2Q7O0i6OKN7u3YJh9.jpg', 'https://www.youtube.com/embed/ByXuk9QqQkk'),
(11, 'The Matrix', 136, 'Un hacker descubre la verdad sobre la realidad y su papel en la guerra contra los controladores.', 'Ciencia ficción', 4.7, 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 'https://image.tmdb.org/t/p/original/7u3pxc0K1wx32IleAkLv78MKgrw.jpg', 'https://www.youtube.com/embed/vKQi3bBA1y8'),
(12, 'Forrest Gump', 142, 'La vida de Forrest Gump, un hombre con un coeficiente intelectual bajo pero con un gran corazón.', 'Drama', 4.8, 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg', 'https://image.tmdb.org/t/p/original/xw3jvi6UUxyA2U4r3dHQDdGJ4uR.jpg', 'https://www.youtube.com/embed/bLvqoHBptjg'),
(13, 'The Lion King', 118, 'Simba, un joven león, debe reclamar su lugar como rey después de la muerte de su padre.', 'Animación', 4.5, 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', 'https://image.tmdb.org/t/p/original/A7JNzr5o7sPZ5Pe5HG2v7YxYS20.jpg', 'https://www.youtube.com/embed/7TavVZMewpY'),
(14, 'Joker', 122, 'Arthur Fleck, un comediante fallido, se adentra en una espiral de crimen y caos en Gotham.', 'Drama', 4.3, 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', 'https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg', 'https://www.youtube.com/embed/zAGVQLHvwOY'),
(15, 'Back to the Future', 116, 'Marty McFly viaja accidentalmente 30 años al pasado en un DeLorean convertido en máquina del tiempo.', 'Ciencia ficción', 4.7, 'https://image.tmdb.org/t/p/w500/7lyBcpYB0Qt8gYhXYaEZUNlNQAv.jpg', 'https://image.tmdb.org/t/p/original/6Z7l6Xx0YqPQBgZ3QOQq7EYNDx1.jpg', 'https://www.youtube.com/embed/qvsgGtivCgs'),
(16, 'The Silence of the Lambs', 118, 'Una joven agente del FBI debe confiar en un asesino en serie encarcelado para atrapar a otro.', 'Thriller', 4.6, 'https://image.tmdb.org/t/p/w500/rplLJ2hPcRQN9M8r2Gv5JYBEuSq.jpg', 'https://image.tmdb.org/t/p/original/mfwq2nMBzArzQ7Y9RKE8SKeeTkg.jpg', 'https://www.youtube.com/embed/W6Mm8Sbe__o'),
(17, 'Gladiator', 155, 'Un general romano es traicionado y convertido en esclavo que lucha como gladiador.', 'Acción', 4.7, 'https://image.tmdb.org/t/p/w500/6WBIzCgmDCYrqh64yDREGeDk9d3.jpg', 'https://image.tmdb.org/t/p/original/h6O5OE3ueRVdCc7V7cwTiQocI7P.jpg', 'https://www.youtube.com/embed/owK1qxDselE'),
(18, 'Titanic', 195, 'Una joven aristócrata se enamora de un artista humilde a bordo del transatlántico Titanic.', 'Romance', 4.8, 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', 'https://image.tmdb.org/t/p/original/yDI6D5ZQh67YU4r2ms8qcSbAviZ.jpg', 'https://www.youtube.com/embed/kVrqfYjkTdQ');

-- Salas (10 salas con diferentes capacidades)
INSERT INTO rooms (name, capacity) VALUES
  ('Sala 1 - IMAX', 150),
  ('Sala 2 - Premium', 180),
  ('Sala 3 - 3D', 150),
  ('Sala 4 - Estándar', 120),
  ('Sala 5 - Estándar', 120),
  ('Sala 6 - VIP', 80),
  ('Sala 7 - 4DX', 100),
  ('Sala 8 - 3D', 150),
  ('Sala 9 - Estándar', 120),
  ('Sala 10 - Premium', 180);


-- Funciones para cada película desde el jueves 19 hasta el miércoles 25 de junio
-- Cada película tendrá al menos 2 funciones por día en diferentes salas

-- Película 1: Interstellar
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(1, 1, '2025-06-19 12:00:00', 'IMAX 3D', 14.99),
(1, 3, '2025-06-19 15:30:00', '3D', 12.50),
(1, 5, '2025-06-19 19:00:00', '2D', 10.99),
(1, 7, '2025-06-19 22:30:00', '4DX 3D', 16.50),
-- Viernes 20
(1, 2, '2025-06-20 11:30:00', 'Premium 2D', 13.99),
(1, 4, '2025-06-20 15:00:00', '2D', 10.99),
(1, 6, '2025-06-20 18:30:00', 'VIP 3D', 15.50),
(1, 8, '2025-06-20 22:00:00', '3D', 12.50),
-- Sábado 21
(1, 1, '2025-06-21 10:00:00', 'IMAX 3D', 14.99),
(1, 3, '2025-06-21 13:30:00', '3D', 12.50),
(1, 5, '2025-06-21 17:00:00', '2D', 10.99),
(1, 7, '2025-06-21 20:30:00', '4DX 3D', 16.50),
(1, 9, '2025-06-21 23:59:00', '2D', 10.99),
-- Domingo 22
(1, 2, '2025-06-22 12:30:00', 'Premium 2D', 13.99),
(1, 4, '2025-06-22 16:00:00', '2D', 10.99),
(1, 6, '2025-06-22 19:30:00', 'VIP 3D', 15.50),
-- Lunes 23
(1, 1, '2025-06-23 14:00:00', 'IMAX 3D', 14.99),
(1, 3, '2025-06-23 17:30:00', '3D', 12.50),
(1, 5, '2025-06-23 21:00:00', '2D', 10.99),
-- Martes 24
(1, 2, '2025-06-24 13:00:00', 'Premium 2D', 13.99),
(1, 4, '2025-06-24 16:30:00', '2D', 10.99),
(1, 6, '2025-06-24 20:00:00', 'VIP 3D', 15.50),
-- Miércoles 25
(1, 1, '2025-06-25 12:00:00', 'IMAX 3D', 14.99),
(1, 3, '2025-06-25 15:30:00', '3D', 12.50),
(1, 5, '2025-06-25 19:00:00', '2D', 10.99);

-- Película 2: Inception
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(2, 2, '2025-06-19 13:00:00', 'Premium 2D', 13.99),
(2, 4, '2025-06-19 16:30:00', '2D', 10.99),
(2, 6, '2025-06-19 20:00:00', 'VIP 2D', 14.50),
-- Viernes 20
(2, 1, '2025-06-20 14:30:00', 'IMAX 2D', 13.99),
(2, 3, '2025-06-20 18:00:00', '2D', 10.99),
(2, 5, '2025-06-20 21:30:00', '2D', 10.99),
-- Sábado 21
(2, 2, '2025-06-21 11:00:00', 'Premium 2D', 13.99),
(2, 4, '2025-06-21 14:30:00', '2D', 10.99),
(2, 6, '2025-06-21 18:00:00', 'VIP 2D', 14.50),
(2, 8, '2025-06-21 21:30:00', '2D', 10.99),
-- Domingo 22
(2, 1, '2025-06-22 13:30:00', 'IMAX 2D', 13.99),
(2, 3, '2025-06-22 17:00:00', '2D', 10.99),
(2, 5, '2025-06-22 20:30:00', '2D', 10.99),
-- Lunes 23
(2, 2, '2025-06-23 15:00:00', 'Premium 2D', 13.99),
(2, 4, '2025-06-23 18:30:00', '2D', 10.99),
-- Martes 24
(2, 1, '2025-06-24 14:00:00', 'IMAX 2D', 13.99),
(2, 3, '2025-06-24 17:30:00', '2D', 10.99),
(2, 5, '2025-06-24 21:00:00', '2D', 10.99),
-- Miércoles 25
(2, 2, '2025-06-25 13:00:00', 'Premium 2D', 13.99),
(2, 4, '2025-06-25 16:30:00', '2D', 10.99),
(2, 6, '2025-06-25 20:00:00', 'VIP 2D', 14.50);

-- Película 3: Toy Story
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(3, 3, '2025-06-19 10:30:00', '3D', 11.50),
(3, 5, '2025-06-19 13:00:00', '2D', 9.99),
(3, 7, '2025-06-19 15:30:00', '4DX 3D', 14.50),
-- Viernes 20
(3, 4, '2025-06-20 11:00:00', '2D', 9.99),
(3, 6, '2025-06-20 14:00:00', 'VIP 3D', 13.50),
(3, 8, '2025-06-20 16:30:00', '3D', 11.50),
-- Sábado 21
(3, 3, '2025-06-21 09:30:00', '3D', 11.50),
(3, 5, '2025-06-21 12:00:00', '2D', 9.99),
(3, 7, '2025-06-21 14:30:00', '4DX 3D', 14.50),
(3, 9, '2025-06-21 17:00:00', '2D', 9.99),
-- Domingo 22
(3, 4, '2025-06-22 10:00:00', '2D', 9.99),
(3, 6, '2025-06-22 13:00:00', 'VIP 3D', 13.50),
(3, 8, '2025-06-22 15:30:00', '3D', 11.50),
-- Lunes 23
(3, 3, '2025-06-23 11:30:00', '3D', 11.50),
(3, 5, '2025-06-23 14:00:00', '2D', 9.99),
-- Martes 24
(3, 4, '2025-06-24 10:30:00', '2D', 9.99),
(3, 6, '2025-06-24 13:30:00', 'VIP 3D', 13.50),
(3, 8, '2025-06-24 16:00:00', '3D', 11.50),
-- Miércoles 25
(3, 3, '2025-06-25 10:00:00', '3D', 11.50),
(3, 5, '2025-06-25 12:30:00', '2D', 9.99),
(3, 7, '2025-06-25 15:00:00', '4DX 3D', 14.50);

-- Película 4: The Dark Knight
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(4, 4, '2025-06-19 14:00:00', '2D', 10.99),
(4, 6, '2025-06-19 17:30:00', 'VIP 2D', 14.50),
(4, 8, '2025-06-19 21:00:00', '2D', 10.99),
-- Viernes 20
(4, 3, '2025-06-20 13:30:00', '2D', 10.99),
(4, 5, '2025-06-20 17:00:00', '2D', 10.99),
(4, 7, '2025-06-20 20:30:00', '4DX 2D', 15.50),
-- Sábado 21
(4, 4, '2025-06-21 12:30:00', '2D', 10.99),
(4, 6, '2025-06-21 16:00:00', 'VIP 2D', 14.50),
(4, 8, '2025-06-21 19:30:00', '2D', 10.99),
(4, 10, '2025-06-21 23:00:00', '2D', 10.99),
-- Domingo 22
(4, 3, '2025-06-22 14:30:00', '2D', 10.99),
(4, 5, '2025-06-22 18:00:00', '2D', 10.99),
-- Lunes 23
(4, 4, '2025-06-23 16:00:00', '2D', 10.99),
(4, 6, '2025-06-23 19:30:00', 'VIP 2D', 14.50),
-- Martes 24
(4, 3, '2025-06-24 15:30:00', '2D', 10.99),
(4, 5, '2025-06-24 19:00:00', '2D', 10.99),
-- Miércoles 25
(4, 4, '2025-06-25 14:00:00', '2D', 10.99),
(4, 6, '2025-06-25 17:30:00', 'VIP 2D', 14.50),
(4, 8, '2025-06-25 21:00:00', '2D', 10.99);

-- Película 5: Pulp Fiction
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(5, 5, '2025-06-19 15:30:00', '2D', 10.99),
(5, 7, '2025-06-19 19:00:00', '4DX 2D', 15.50),
(5, 9, '2025-06-19 22:30:00', '2D', 10.99),
-- Viernes 20
(5, 6, '2025-06-20 16:00:00', 'VIP 2D', 14.50),
(5, 8, '2025-06-20 19:30:00', '2D', 10.99),
-- Sábado 21
(5, 5, '2025-06-21 13:30:00', '2D', 10.99),
(5, 7, '2025-06-21 17:00:00', '4DX 2D', 15.50),
(5, 9, '2025-06-21 20:30:00', '2D', 10.99),
-- Domingo 22
(5, 6, '2025-06-22 15:00:00', 'VIP 2D', 14.50),
(5, 8, '2025-06-22 18:30:00', '2D', 10.99),
-- Lunes 23
(5, 5, '2025-06-23 17:30:00', '2D', 10.99),
(5, 7, '2025-06-23 21:00:00', '4DX 2D', 15.50),
-- Martes 24
(5, 6, '2025-06-24 16:30:00', 'VIP 2D', 14.50),
(5, 8, '2025-06-24 20:00:00', '2D', 10.99),
-- Miércoles 25
(5, 5, '2025-06-25 15:30:00', '2D', 10.99),
(5, 7, '2025-06-25 19:00:00', '4DX 2D', 15.50),
(5, 9, '2025-06-25 22:30:00', '2D', 10.99);

-- Película 6: The Shawshank Redemption
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(6, 6, '2025-06-19 12:30:00', 'VIP 2D', 13.50),
(6, 8, '2025-06-19 16:00:00', '2D', 10.99),
(6, 10, '2025-06-19 19:30:00', '2D', 10.99),
-- Viernes 20
(6, 5, '2025-06-20 14:00:00', '2D', 10.99),
(6, 7, '2025-06-20 17:30:00', '4DX 2D', 15.50),
-- Sábado 21
(6, 6, '2025-06-21 11:30:00', 'VIP 2D', 13.50),
(6, 8, '2025-06-21 15:00:00', '2D', 10.99),
(6, 10, '2025-06-21 18:30:00', '2D', 10.99),
-- Domingo 22
(6, 5, '2025-06-22 13:00:00', '2D', 10.99),
(6, 7, '2025-06-22 16:30:00', '4DX 2D', 15.50),
-- Lunes 23
(6, 6, '2025-06-23 14:30:00', 'VIP 2D', 13.50),
(6, 8, '2025-06-23 18:00:00', '2D', 10.99),
-- Martes 24
(6, 5, '2025-06-24 15:00:00', '2D', 10.99),
(6, 7, '2025-06-24 18:30:00', '4DX 2D', 15.50),
-- Miércoles 25
(6, 6, '2025-06-25 12:30:00', 'VIP 2D', 13.50),
(6, 8, '2025-06-25 16:00:00', '2D', 10.99),
(6, 10, '2025-06-25 19:30:00', '2D', 10.99);

-- Película 7: Avengers: Endgame
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(7, 7, '2025-06-19 11:00:00', '4DX 3D', 16.50),
(7, 9, '2025-06-19 14:30:00', '2D', 12.99),
(7, 1, '2025-06-19 18:00:00', 'IMAX 3D', 17.99),
-- Viernes 20
(7, 8, '2025-06-20 12:30:00', '3D', 14.50),
(7, 10, '2025-06-20 16:00:00', '2D', 12.99),
(7, 2, '2025-06-20 19:30:00', 'Premium 3D', 16.99),
-- Sábado 21
(7, 7, '2025-06-21 10:00:00', '4DX 3D', 16.50),
(7, 9, '2025-06-21 13:30:00', '2D', 12.99),
(7, 1, '2025-06-21 17:00:00', 'IMAX 3D', 17.99),
(7, 3, '2025-06-21 20:30:00', '3D', 14.50),
-- Domingo 22
(7, 8, '2025-06-22 11:30:00', '3D', 14.50),
(7, 10, '2025-06-22 15:00:00', '2D', 12.99),
(7, 2, '2025-06-22 18:30:00', 'Premium 3D', 16.99),
-- Lunes 23
(7, 7, '2025-06-23 13:00:00', '4DX 3D', 16.50),
(7, 9, '2025-06-23 16:30:00', '2D', 12.99),
-- Martes 24
(7, 8, '2025-06-24 14:30:00', '3D', 14.50),
(7, 10, '2025-06-24 18:00:00', '2D', 12.99),
-- Miércoles 25
(7, 7, '2025-06-25 11:00:00', '4DX 3D', 16.50),
(7, 9, '2025-06-25 14:30:00', '2D', 12.99),
(7, 1, '2025-06-25 18:00:00', 'IMAX 3D', 17.99);

-- Película 8: The Godfather
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(8, 8, '2025-06-19 14:00:00', '2D', 11.99),
(8, 10, '2025-06-19 17:30:00', '2D', 11.99),
(8, 2, '2025-06-19 21:00:00', 'Premium 2D', 14.99),
-- Viernes 20
(8, 7, '2025-06-20 15:30:00', '4DX 2D', 15.99),
(8, 9, '2025-06-20 19:00:00', '2D', 11.99),
-- Sábado 21
(8, 8, '2025-06-21 12:00:00', '2D', 11.99),
(8, 10, '2025-06-21 15:30:00', '2D', 11.99),
(8, 2, '2025-06-21 19:00:00', 'Premium 2D', 14.99),
(8, 4, '2025-06-21 22:30:00', '2D', 11.99),
-- Domingo 22
(8, 7, '2025-06-22 14:30:00', '4DX 2D', 15.99),
(8, 9, '2025-06-22 18:00:00', '2D', 11.99),
-- Lunes 23
(8, 8, '2025-06-23 16:00:00', '2D', 11.99),
(8, 10, '2025-06-23 19:30:00', '2D', 11.99),
-- Martes 24
(8, 7, '2025-06-24 15:30:00', '4DX 2D', 15.99),
(8, 9, '2025-06-24 19:00:00', '2D', 11.99),
-- Miércoles 25
(8, 8, '2025-06-25 14:00:00', '2D', 11.99),
(8, 10, '2025-06-25 17:30:00', '2D', 11.99),
(8, 2, '2025-06-25 21:00:00', 'Premium 2D', 14.99);

-- Película 9: Parasite
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(9, 9, '2025-06-19 13:30:00', '2D', 10.50),
(9, 1, '2025-06-19 16:30:00', 'IMAX 2D', 12.99),
(9, 3, '2025-06-19 20:00:00', '2D', 10.50),
-- Viernes 20
(9, 10, '2025-06-20 14:00:00', '2D', 10.50),
(9, 2, '2025-06-20 17:00:00', 'Premium 2D', 13.50),
(9, 4, '2025-06-20 20:30:00', '2D', 10.50),
-- Sábado 21
(9, 9, '2025-06-21 11:30:00', '2D', 10.50),
(9, 1, '2025-06-21 14:30:00', 'IMAX 2D', 12.99),
(9, 3, '2025-06-21 18:00:00', '2D', 10.50),
(9, 5, '2025-06-21 21:30:00', '2D', 10.50),
-- Domingo 22
(9, 10, '2025-06-22 13:00:00', '2D', 10.50),
(9, 2, '2025-06-22 16:00:00', 'Premium 2D', 13.50),
(9, 4, '2025-06-22 19:30:00', '2D', 10.50),
-- Lunes 23
(9, 9, '2025-06-23 15:30:00', '2D', 10.50),
(9, 1, '2025-06-23 18:30:00', 'IMAX 2D', 12.99),
-- Martes 24
(9, 10, '2025-06-24 14:30:00', '2D', 10.50),
(9, 2, '2025-06-24 17:30:00', 'Premium 2D', 13.50),
-- Miércoles 25
(9, 9, '2025-06-25 13:30:00', '2D', 10.50),
(9, 1, '2025-06-25 16:30:00', 'IMAX 2D', 12.99),
(9, 3, '2025-06-25 20:00:00', '2D', 10.50);

-- Película 10: Spirited Away
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(10, 10, '2025-06-19 10:30:00', '2D', 9.99),
(10, 2, '2025-06-19 13:00:00', 'Premium 2D', 12.50),
(10, 4, '2025-06-19 15:30:00', '2D', 9.99),
-- Viernes 20
(10, 9, '2025-06-20 12:00:00', '2D', 9.99),
(10, 1, '2025-06-20 14:30:00', 'IMAX 2D', 11.99),
(10, 3, '2025-06-20 17:00:00', '2D', 9.99),
-- Sábado 21
(10, 10, '2025-06-21 09:30:00', '2D', 9.99),
(10, 2, '2025-06-21 12:00:00', 'Premium 2D', 12.50),
(10, 4, '2025-06-21 14:30:00', '2D', 9.99),
(10, 6, '2025-06-21 17:00:00', 'VIP 2D', 13.50),
-- Domingo 22
(10, 9, '2025-06-22 11:00:00', '2D', 9.99),
(10, 1, '2025-06-22 13:30:00', 'IMAX 2D', 11.99),
(10, 3, '2025-06-22 16:00:00', '2D', 9.99),
-- Lunes 23
(10, 10, '2025-06-23 12:30:00', '2D', 9.99),
(10, 2, '2025-06-23 15:00:00', 'Premium 2D', 12.50),
-- Martes 24
(10, 9, '2025-06-24 13:00:00', '2D', 9.99),
(10, 1, '2025-06-24 15:30:00', 'IMAX 2D', 11.99),
-- Miércoles 25
(10, 10, '2025-06-25 10:30:00', '2D', 9.99),
(10, 2, '2025-06-25 13:00:00', 'Premium 2D', 12.50),
(10, 4, '2025-06-25 15:30:00', '2D', 9.99);

-- Película 11: The Matrix
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(11, 1, '2025-06-19 11:30:00', 'IMAX 3D', 14.99),
(11, 3, '2025-06-19 15:00:00', '3D', 12.50),
(11, 5, '2025-06-19 18:30:00', '2D', 10.99),
-- Viernes 20
(11, 2, '2025-06-20 13:00:00', 'Premium 3D', 15.50),
(11, 4, '2025-06-20 16:30:00', '2D', 10.99),
(11, 6, '2025-06-20 20:00:00', 'VIP 3D', 15.50),
-- Sábado 21
(11, 1, '2025-06-21 10:30:00', 'IMAX 3D', 14.99),
(11, 3, '2025-06-21 14:00:00', '3D', 12.50),
(11, 5, '2025-06-21 17:30:00', '2D', 10.99),
(11, 7, '2025-06-21 21:00:00', '4DX 3D', 16.50),
-- Domingo 22
(11, 2, '2025-06-22 12:00:00', 'Premium 3D', 15.50),
(11, 4, '2025-06-22 15:30:00', '2D', 10.99),
(11, 6, '2025-06-22 19:00:00', 'VIP 3D', 15.50),
-- Lunes 23
(11, 1, '2025-06-23 14:30:00', 'IMAX 3D', 14.99),
(11, 3, '2025-06-23 18:00:00', '3D', 12.50),
-- Martes 24
(11, 2, '2025-06-24 13:30:00', 'Premium 3D', 15.50),
(11, 4, '2025-06-24 17:00:00', '2D', 10.99),
-- Miércoles 25
(11, 1, '2025-06-25 11:30:00', 'IMAX 3D', 14.99),
(11, 3, '2025-06-25 15:00:00', '3D', 12.50),
(11, 5, '2025-06-25 18:30:00', '2D', 10.99);

-- Película 12: Forrest Gump
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(12, 2, '2025-06-19 12:00:00', 'Premium 2D', 13.50),
(12, 4, '2025-06-19 15:30:00', '2D', 10.99),
(12, 6, '2025-06-19 19:00:00', 'VIP 2D', 14.50),
-- Viernes 20
(12, 1, '2025-06-20 13:30:00', 'IMAX 2D', 13.99),
(12, 3, '2025-06-20 17:00:00', '2D', 10.99),
(12, 5, '2025-06-20 20:30:00', '2D', 10.99),
-- Sábado 21
(12, 2, '2025-06-21 11:00:00', 'Premium 2D', 13.50),
(12, 4, '2025-06-21 14:30:00', '2D', 10.99),
(12, 6, '2025-06-21 18:00:00', 'VIP 2D', 14.50),
(12, 8, '2025-06-21 21:30:00', '2D', 10.99),
-- Domingo 22
(12, 1, '2025-06-22 12:30:00', 'IMAX 2D', 13.99),
(12, 3, '2025-06-22 16:00:00', '2D', 10.99),
(12, 5, '2025-06-22 19:30:00', '2D', 10.99),
-- Lunes 23
(12, 2, '2025-06-23 15:00:00', 'Premium 2D', 13.50),
(12, 4, '2025-06-23 18:30:00', '2D', 10.99),
-- Martes 24
(12, 1, '2025-06-24 14:00:00', 'IMAX 2D', 13.99),
(12, 3, '2025-06-24 17:30:00', '2D', 10.99),
-- Miércoles 25
(12, 2, '2025-06-25 12:00:00', 'Premium 2D', 13.50),
(12, 4, '2025-06-25 15:30:00', '2D', 10.99),
(12, 6, '2025-06-25 19:00:00', 'VIP 2D', 14.50);

-- Película 13: The Lion King
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(13, 3, '2025-06-19 10:00:00', '3D', 11.50),
(13, 5, '2025-06-19 12:30:00', '2D', 9.99),
(13, 7, '2025-06-19 15:00:00', '4DX 3D', 14.50),
-- Viernes 20
(13, 4, '2025-06-20 11:30:00', '2D', 9.99),
(13, 6, '2025-06-20 14:00:00', 'VIP 3D', 13.50),
(13, 8, '2025-06-20 16:30:00', '3D', 11.50),
-- Sábado 21
(13, 3, '2025-06-21 09:00:00', '3D', 11.50),
(13, 5, '2025-06-21 11:30:00', '2D', 9.99),
(13, 7, '2025-06-21 14:00:00', '4DX 3D', 14.50),
(13, 9, '2025-06-21 16:30:00', '2D', 9.99),
-- Domingo 22
(13, 4, '2025-06-22 10:30:00', '2D', 9.99),
(13, 6, '2025-06-22 13:00:00', 'VIP 3D', 13.50),
(13, 8, '2025-06-22 15:30:00', '3D', 11.50),
-- Lunes 23
(13, 3, '2025-06-23 12:00:00', '3D', 11.50),
(13, 5, '2025-06-23 14:30:00', '2D', 9.99),
-- Martes 24
(13, 4, '2025-06-24 11:00:00', '2D', 9.99),
(13, 6, '2025-06-24 13:30:00', 'VIP 3D', 13.50),
(13, 8, '2025-06-24 16:00:00', '3D', 11.50),
-- Miércoles 25
(13, 3, '2025-06-25 10:00:00', '3D', 11.50),
(13, 5, '2025-06-25 12:30:00', '2D', 9.99),
(13, 7, '2025-06-25 15:00:00', '4DX 3D', 14.50);

-- Película 14: Joker
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(14, 4, '2025-06-19 13:00:00', '2D', 10.50),
(14, 6, '2025-06-19 16:30:00', 'VIP 2D', 14.50),
(14, 8, '2025-06-19 20:00:00', '2D', 10.50),
-- Viernes 20
(14, 3, '2025-06-20 14:30:00', '2D', 10.50),
(14, 5, '2025-06-20 18:00:00', '2D', 10.50),
(14, 7, '2025-06-20 21:30:00', '4DX 2D', 15.50),
-- Sábado 21
(14, 4, '2025-06-21 12:00:00', '2D', 10.50),
(14, 6, '2025-06-21 15:30:00', 'VIP 2D', 14.50),
(14, 8, '2025-06-21 19:00:00', '2D', 10.50),
(14, 10, '2025-06-21 22:30:00', '2D', 10.50),
-- Domingo 22
(14, 3, '2025-06-22 13:30:00', '2D', 10.50),
(14, 5, '2025-06-22 17:00:00', '2D', 10.50),
(14, 7, '2025-06-22 20:30:00', '4DX 2D', 15.50),
-- Lunes 23
(14, 4, '2025-06-23 15:00:00', '2D', 10.50),
(14, 6, '2025-06-23 18:30:00', 'VIP 2D', 14.50),
-- Martes 24
(14, 3, '2025-06-24 14:30:00', '2D', 10.50),
(14, 5, '2025-06-24 18:00:00', '2D', 10.50),
-- Miércoles 25
(14, 4, '2025-06-25 13:00:00', '2D', 10.50),
(14, 6, '2025-06-25 16:30:00', 'VIP 2D', 14.50),
(14, 8, '2025-06-25 20:00:00', '2D', 10.50);

-- Película 15: Back to the Future
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(15, 5, '2025-06-19 14:30:00', '2D', 10.99),
(15, 7, '2025-06-19 18:00:00', '4DX 2D', 15.50),
(15, 9, '2025-06-19 21:30:00', '2D', 10.99),
-- Viernes 20
(15, 6, '2025-06-20 15:30:00', 'VIP 2D', 14.50),
(15, 8, '2025-06-20 19:00:00', '2D', 10.99),
-- Sábado 21
(15, 5, '2025-06-21 13:00:00', '2D', 10.99),
(15, 7, '2025-06-21 16:30:00', '4DX 2D', 15.50),
(15, 9, '2025-06-21 20:00:00', '2D', 10.99),
(15, 1, '2025-06-21 23:30:00', 'IMAX 2D', 13.99),
-- Domingo 22
(15, 6, '2025-06-22 14:30:00', 'VIP 2D', 14.50),
(15, 8, '2025-06-22 18:00:00', '2D', 10.99),
(15, 10, '2025-06-22 21:30:00', '2D', 10.99),
-- Lunes 23
(15, 5, '2025-06-23 16:00:00', '2D', 10.99),
(15, 7, '2025-06-23 19:30:00', '4DX 2D', 15.50),
-- Martes 24
(15, 6, '2025-06-24 15:30:00', 'VIP 2D', 14.50),
(15, 8, '2025-06-24 19:00:00', '2D', 10.99),
-- Miércoles 25
(15, 5, '2025-06-25 14:30:00', '2D', 10.99),
(15, 7, '2025-06-25 18:00:00', '4DX 2D', 15.50),
(15, 9, '2025-06-25 21:30:00', '2D', 10.99);

-- Película 16: The Silence of the Lambs
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(16, 6, '2025-06-19 11:00:00', 'VIP 2D', 13.50),
(16, 8, '2025-06-19 14:30:00', '2D', 10.50),
(16, 10, '2025-06-19 18:00:00', '2D', 10.50),
-- Viernes 20
(16, 5, '2025-06-20 12:30:00', '2D', 10.50),
(16, 7, '2025-06-20 16:00:00', '4DX 2D', 15.50),
(16, 9, '2025-06-20 19:30:00', '2D', 10.50),
-- Sábado 21
(16, 6, '2025-06-21 10:00:00', 'VIP 2D', 13.50),
(16, 8, '2025-06-21 13:30:00', '2D', 10.50),
(16, 10, '2025-06-21 17:00:00', '2D', 10.50),
(16, 2, '2025-06-21 20:30:00', 'Premium 2D', 14.50),
-- Domingo 22
(16, 5, '2025-06-22 11:30:00', '2D', 10.50),
(16, 7, '2025-06-22 15:00:00', '4DX 2D', 15.50),
(16, 9, '2025-06-22 18:30:00', '2D', 10.50),
-- Lunes 23
(16, 6, '2025-06-23 13:00:00', 'VIP 2D', 13.50),
(16, 8, '2025-06-23 16:30:00', '2D', 10.50),
-- Martes 24
(16, 5, '2025-06-24 12:30:00', '2D', 10.50),
(16, 7, '2025-06-24 16:00:00', '4DX 2D', 15.50),
-- Miércoles 25
(16, 6, '2025-06-25 11:00:00', 'VIP 2D', 13.50),
(16, 8, '2025-06-25 14:30:00', '2D', 10.50),
(16, 10, '2025-06-25 18:00:00', '2D', 10.50);

-- Película 17: Gladiator
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(17, 7, '2025-06-19 12:00:00', '4DX 2D', 15.50),
(17, 9, '2025-06-19 15:30:00', '2D', 11.99),
(17, 1, '2025-06-19 19:00:00', 'IMAX 2D', 14.99),
-- Viernes 20
(17, 8, '2025-06-20 13:30:00', '2D', 11.99),
(17, 10, '2025-06-20 17:00:00', '2D', 11.99),
(17, 2, '2025-06-20 20:30:00', 'Premium 2D', 14.99),
-- Sábado 21
(17, 7, '2025-06-21 11:00:00', '4DX 2D', 15.50),
(17, 9, '2025-06-21 14:30:00', '2D', 11.99),
(17, 1, '2025-06-21 18:00:00', 'IMAX 2D', 14.99),
(17, 3, '2025-06-21 21:30:00', '2D', 11.99),
-- Domingo 22
(17, 8, '2025-06-22 12:30:00', '2D', 11.99),
(17, 10, '2025-06-22 16:00:00', '2D', 11.99),
(17, 2, '2025-06-22 19:30:00', 'Premium 2D', 14.99),
-- Lunes 23
(17, 7, '2025-06-23 14:00:00', '4DX 2D', 15.50),
(17, 9, '2025-06-23 17:30:00', '2D', 11.99),
-- Martes 24
(17, 8, '2025-06-24 13:30:00', '2D', 11.99),
(17, 10, '2025-06-24 17:00:00', '2D', 11.99),
-- Miércoles 25
(17, 7, '2025-06-25 12:00:00', '4DX 2D', 15.50),
(17, 9, '2025-06-25 15:30:00', '2D', 11.99),
(17, 1, '2025-06-25 19:00:00', 'IMAX 2D', 14.99);

-- Película 18: Titanic
INSERT INTO showtimes (movie_id, room_id, start_time, format, price) VALUES
-- Jueves 19
(18, 8, '2025-06-19 13:00:00', '2D', 12.50),
(18, 10, '2025-06-19 17:00:00', '2D', 12.50),
(18, 2, '2025-06-19 21:00:00', 'Premium 2D', 15.50),
-- Viernes 20
(18, 7, '2025-06-20 14:30:00', '4DX 2D', 16.50),
(18, 9, '2025-06-20 18:30:00', '2D', 12.50),
(18, 1, '2025-06-20 22:30:00', 'IMAX 2D', 15.99),
-- Sábado 21
(18, 8, '2025-06-21 12:00:00', '2D', 12.50),
(18, 10, '2025-06-21 16:00:00', '2D', 12.50),
(18, 2, '2025-06-21 20:00:00', 'Premium 2D', 15.50),
(18, 4, '2025-06-21 23:30:00', '2D', 12.50),
-- Domingo 22
(18, 7, '2025-06-22 13:30:00', '4DX 2D', 16.50),
(18, 9, '2025-06-22 17:30:00', '2D', 12.50),
(18, 1, '2025-06-22 21:30:00', 'IMAX 2D', 15.99),
-- Lunes 23
(18, 8, '2025-06-23 15:00:00', '2D', 12.50),
(18, 10, '2025-06-23 19:00:00', '2D', 12.50),
-- Martes 24
(18, 7, '2025-06-24 14:30:00', '4DX 2D', 16.50),
(18, 9, '2025-06-24 18:30:00', '2D', 12.50),
-- Miércoles 25
(18, 8, '2025-06-25 13:00:00', '2D', 12.50),
(18, 10, '2025-06-25 17:00:00', '2D', 12.50),
(18, 2, '2025-06-25 21:00:00', 'Premium 2D', 15.50);

-- Tickets de ejemplo
INSERT INTO tickets (user_id, showtime_id, seat_id) VALUES
-- Usuario 1 compra 3 entradas
(1, 1, 1), (1, 1, 2), (1, 1, 3),
-- Usuario 2 compra 2 entradas
(2, 5, 50), (2, 5, 51),
-- Usuario 3 compra 1 entrada
(3, 10, 100),
-- Usuario 4 compra 4 entradas
(4, 15, 150), (4, 15, 151), (4, 15, 152), (4, 15, 153),
-- Usuario 5 compra 2 entradas
(5, 20, 200), (5, 20, 201),
-- Usuario 6 compra 1 entrada
(6, 25, 250),
-- Usuario 7 compra 3 entradas
(7, 30, 300), (7, 30, 301), (7, 30, 302),
-- Usuario 8 compra 2 entradas
(8, 35, 350), (8, 35, 351);

-- Actualizar asientos ocupados
UPDATE seats s
JOIN tickets t ON s.id = t.seat_id
SET s.is_occupied = 1;

-- 6. PROCEDIMIENTO ALMACENADO: Comprar entrada
------------------------------------------------------------

DELIMITER $$

CREATE PROCEDURE sp_ComprarTicket (
  IN p_user_id BIGINT,
  IN p_showtime_id BIGINT,
  IN p_row VARCHAR(10),
  IN p_seat_number INT
)
BEGIN
  DECLARE v_seat_id BIGINT;
  DECLARE v_room_id BIGINT;
  DECLARE mensaje VARCHAR(200);

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SET mensaje = 'Error: no se pudo completar la compra.';
    SELECT mensaje AS mensaje;
  END;

  START TRANSACTION;

  -- Validar existencia de usuario
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
    SET mensaje = 'Error: Usuario no válido.';
    ROLLBACK;
    SELECT mensaje AS mensaje;

  -- Validar existencia de función
  ELSEIF NOT EXISTS (SELECT 1 FROM showtimes WHERE id = p_showtime_id) THEN
    SET mensaje = 'Error: Función no válida.';
    ROLLBACK;
    SELECT mensaje AS mensaje;

  ELSE
    -- Obtener room_id desde showtimes
    SELECT room_id INTO v_room_id
    FROM showtimes
    WHERE id = p_showtime_id;

    -- Buscar seat_id a partir de room_id, fila y número
    SELECT id INTO v_seat_id
    FROM seats
    WHERE room_id = v_room_id AND `row` = p_row AND seat_number = p_seat_number
    LIMIT 1;

    -- Validar si se encontró un asiento válido
    IF v_seat_id IS NULL THEN
      SET mensaje = 'Error: Asiento no válido.';
      ROLLBACK;
      SELECT mensaje AS mensaje;

    -- Validar si ya está ocupado
    ELSEIF EXISTS (
      SELECT 1 FROM tickets
      WHERE showtime_id = p_showtime_id AND seat_id = v_seat_id
    ) THEN
      SET mensaje = 'Error: Ese asiento ya está ocupado.';
      ROLLBACK;
      SELECT mensaje AS mensaje;

    ELSE
      -- Insertar ticket
      INSERT INTO tickets (user_id, showtime_id, seat_id)
      VALUES (p_user_id, p_showtime_id, v_seat_id);
      COMMIT;
      SET mensaje = 'Compra realizada con éxito.';
      SELECT mensaje AS mensaje;
    END IF;
  END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_ComprarTicketSinRollBack (
  IN p_user_id BIGINT,
  IN p_showtime_id BIGINT,
  IN p_row VARCHAR(10),
  IN p_seat_number INT
)
BEGIN
  DECLARE v_seat_id BIGINT;
  DECLARE v_room_id BIGINT;
  DECLARE mensaje VARCHAR(200);

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    -- No hacemos rollback aquí para que el cliente controle la transacción
    SET mensaje = 'Error: no se pudo completar la compra.';
    SELECT mensaje AS mensaje;
  END;

  -- Validar existencia de usuario
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
    SET mensaje = 'Error: Usuario no válido.';
    SELECT mensaje AS mensaje;

  -- Validar existencia de función
  ELSEIF NOT EXISTS (SELECT 1 FROM showtimes WHERE id = p_showtime_id) THEN
    SET mensaje = 'Error: Función no válida.';
    SELECT mensaje AS mensaje;

  ELSE
    -- Obtener room_id desde showtimes
    SELECT room_id INTO v_room_id
    FROM showtimes
    WHERE id = p_showtime_id;

    -- Buscar seat_id a partir de room_id, fila y número
    SELECT id INTO v_seat_id
    FROM seats
    WHERE room_id = v_room_id AND `row` = p_row AND seat_number = p_seat_number
    LIMIT 1;

    -- Validar si se encontró un asiento válido
    IF v_seat_id IS NULL THEN
      SET mensaje = 'Error: Asiento no válido.';
      SELECT mensaje AS mensaje;

    -- Validar si ya está ocupado
    ELSEIF EXISTS (
      SELECT 1 FROM tickets
      WHERE showtime_id = p_showtime_id AND seat_id = v_seat_id
    ) THEN
      SET mensaje = 'Error: Ese asiento ya está ocupado.';
      SELECT mensaje AS mensaje;

    ELSE
      -- Insertar ticket (sin commit)
      INSERT INTO tickets (user_id, showtime_id, seat_id)
      VALUES (p_user_id, p_showtime_id, v_seat_id);
      
      SET mensaje = 'Compra realizada con éxito.';
      SELECT mensaje AS mensaje;
    END IF;
  END IF;
END$$

DELIMITER ;


CREATE DATABASE IF NOT EXISTS lilkartoffel;
USE lilkartoffel;

-- 1. roles
DROP TABLE IF EXISTS roles;
CREATE TABLE IF NOT EXISTS roles (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY name (name)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2. users
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  role_id INT NOT NULL DEFAULT '1',
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY fk_users_roles (role_id),
  CONSTRAINT fk_users_roles FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. categories
DROP TABLE IF EXISTS categories;
CREATE TABLE IF NOT EXISTS categories (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY name (name)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. traits
DROP TABLE IF EXISTS traits;
CREATE TABLE IF NOT EXISTS traits (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category_id INT DEFAULT NULL,
  PRIMARY KEY (id),
  KEY category_id (category_id),
  CONSTRAINT traits_ibfk_1 FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5. entities
DROP TABLE IF EXISTS entities;
CREATE TABLE IF NOT EXISTS entities (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  picture VARCHAR(255) DEFAULT NULL,
  owner_id INT DEFAULT NULL,
  category_id INT DEFAULT NULL,
  city VARCHAR(100) DEFAULT NULL,
  status ENUM('approved','rejected','pending') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (id),
  KEY idx_entities_owner (owner_id),
  KEY fk_entities_category (category_id),
  CONSTRAINT fk_entities_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE,
  CONSTRAINT fk_entities_owner FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 6. reviews
DROP TABLE IF EXISTS reviews;
CREATE TABLE IF NOT EXISTS reviews (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  entity_id INT NOT NULL,
  parent_id INT DEFAULT NULL,
  description TEXT,
  rating TINYINT(1) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  KEY entity_id (entity_id),
  KEY fk_reviews_parent (parent_id),
  CONSTRAINT fk_reviews_parent FOREIGN KEY (parent_id) REFERENCES reviews (id) ON DELETE CASCADE,
  CONSTRAINT reviews_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT reviews_ibfk_2 FOREIGN KEY (entity_id) REFERENCES entities (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 7. review_pictures
DROP TABLE IF EXISTS review_pictures;
CREATE TABLE IF NOT EXISTS review_pictures (
  id INT NOT NULL AUTO_INCREMENT,
  review_id INT NOT NULL,
  path VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_review_id (review_id),
  CONSTRAINT review_pictures_ibfk_1 FOREIGN KEY (review_id) REFERENCES reviews (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 8. review_trait_rating
DROP TABLE IF EXISTS review_trait_rating;
CREATE TABLE IF NOT EXISTS review_trait_rating (
  id INT NOT NULL AUTO_INCREMENT,
  review_id INT NOT NULL,
  trait_id INT NOT NULL,
  rating TINYINT NOT NULL,
  PRIMARY KEY (id),
  KEY review_id (review_id),
  KEY trait_id (trait_id),
  CONSTRAINT review_trait_rating_ibfk_1 FOREIGN KEY (review_id) REFERENCES reviews (id) ON DELETE CASCADE,
  CONSTRAINT review_trait_rating_ibfk_2 FOREIGN KEY (trait_id) REFERENCES traits (id) ON DELETE CASCADE,
  CONSTRAINT review_trait_rating_chk_1 CHECK ((rating >= 1 AND rating <= 5))
) ENGINE=InnoDB AUTO_INCREMENT=446 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 9. review_votes
DROP TABLE IF EXISTS review_votes;
CREATE TABLE IF NOT EXISTS review_votes (
  id INT NOT NULL AUTO_INCREMENT,
  review_id INT NOT NULL,
  user_id INT NOT NULL,
  vote_type ENUM('like','dislike') NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY unique_user_review_vote (user_id, review_id),
  KEY review_id (review_id),
  CONSTRAINT review_votes_ibfk_1 FOREIGN KEY (review_id) REFERENCES reviews (id) ON DELETE CASCADE,
  CONSTRAINT review_votes_ibfk_2 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 10. pending_roles
DROP TABLE IF EXISTS pending_roles;
CREATE TABLE IF NOT EXISTS pending_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  UNIQUE KEY user_id (user_id),
  CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT role_id_fk FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS reported_reviews;
CREATE TABLE IF NOT EXISTS reported_reviews (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  review_id int NOT NULL,
  description text,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  KEY review_id (review_id),
  CONSTRAINT reported_reviews_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT reported_reviews_ibfk_2 FOREIGN KEY (review_id) REFERENCES reviews (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

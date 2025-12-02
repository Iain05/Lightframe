CREATE TABLE albums (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  public BOOLEAN DEFAULT (0),
  description TEXT,
  cover_image VARCHAR(255),
  num_photos INT,
  collection VARCHAR(100),
  date_created DATETIME DEFAULT (CURRENT_DATE),
  event_date DATE,
  views INT
);

CREATE TABLE photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  album_id VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,  -- or full S3/URL path
  width INT,
  height INT,
  photo_index INT,
  downloads INT DEFAULT 0,
  date_taken DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES albums(id)
);

CREATE TABLE metadata (
	`key` varchar(255) PRIMARY KEY,
    `value` TEXT
);

CREATE TRIGGER after_photo_insert
AFTER INSERT ON photos
FOR EACH ROW
UPDATE albums
SET num_photos = num_photos + 1
WHERE id = NEW.album_id;

CREATE TRIGGER after_photo_delete
AFTER DELETE ON photos
FOR EACH ROW
UPDATE albums
SET num_photos = num_photos - 1
WHERE id = OLD.album_id;
# June 20th, 2025
![[Pasted image 20250620234253.png]]
Okay so surprisingly, it actually does not look like shit. I mean like yes I'm using libraries but like they work pretty well. And I followed a tutorial for making a top bar because I'm like not doing allat. Today I got the Java backend setup which is obviously just returning hardcoded albums right now. 

Next I need to set up the architecture for collections, because in actuality we want albums to be stored in collections. Collections can reference any album, and albums can be referenced multiple times. 

Also I added good exception handling because I'm a based programmer and not a soydev (I will forget to do this for every single function from now on). 
```Java
@GetMapping("/api/album")  
public Album getAlbum(@RequestParam String id) {  
    Album album;  
    try {  
        return albumService.getAlbum(id);  
    } catch (AlbumNotFoundException e) {  
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());  
    } catch (Exception e) {  
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());  
    }}
```

returns 
```Json
{
	"name": String,
	"dateCreated": String,
	"id": String,
	"coverImage": String,
	"numPhotos": int,
	"photos": [
		{
			"url": String,
			"width": int,
			"height": int,
			"index": int,
			"dateTaken": String
		}
	]
}
```
# June 21st, 2025
![[Pasted image 20250621101850.png]]
So we actually got a pretty nice collection thing going here. The albums aren't fetched dynamically but we can add that. I should also probably add the date to each one. I'll do that after getting them dynamically from the backend. So what do we need to do for that.

As it is right now I don't really plan to have dynamic collections. I feel like it might be best to just hard code those... I'm like way too lazy to add another layer of database fetching and frontend stuff for that. And this might be coping but it makes the site flexible in a different way, in that its easy to customize collections to each be unique and have unique pages if desired. Might be kinda gas to personalize the site more. I'm def coping though.

Probably want a request to /api/collection?id="collection_id"
and then it will need to return
```Json
{
	"name": String,
	"count": int,
	"albums": [
		{
			"id": String,
			"name": String,
			"coverImage": String, // url to the image
			"dateCreated": String,
			"numPhotos": int,
		}
	]
}
```

Since I'm not returning images with this one, I should probably change the class setup. We should have this just be an Album, and then have an AlbumImages that extends it?

According to chatgpt we'll want four tables
```sql
CREATE TABLE albums (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image VARCHAR(255),
  num_photos INT,
  collection VARCHAR(100);
  date_created DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  album_id VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,  -- or full S3/URL path
  width INT,
  height INT,
  photo_index INT,
  date_taken DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES albums(id)
);
```
and that all seems to check out to me. 

ChatGPT also generated triggers for met o keep track of album count
```sql
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
```
god bless ChatGPT like honestly. Makes my life so easy.

Okay the backend is now able to get collections from the database I am an programming god.

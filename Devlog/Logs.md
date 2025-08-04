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
  public BOOLEAN DEFAULT (0),
  description TEXT,
  cover_image VARCHAR(255),
  num_photos INT,
  collection VARCHAR(100),
  date_created DATETIME DEFAULT (CURRENT_DATE),
  event_date DATE,
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

# June 22nd, 2025
So today I decided to finally address an issue I have been electing to ignore since I started. Which admittedly hasn't been very long, pretty poor run tbh I expect better of myself. But basically how the fuck do you fetch a gigabyte of images every time the user opens an album. This has been a problem since the beginning of time dating back to the ancient greeks. Some say Euclid himself studied this problem. As far as I can tell from very little research there isn't a great way to solve this. It seems like the standard way is to just store multiple versions of the image which is kinda valid. The approach I've chosen is to just store a preview version and the full res version in a bucket. one at /preview/image and one at /full/image, just making it easy to find the same images corresponding url. 

Thats all great but how do you actually serve it? Well i have two react libraries right, i have the react photo album and 'yet another react lightbox'. *As far as I understand things* I can just generate the list of photos once, give react photo album the list with the src as the /preview url, and then give the lightbox the identical version with the /full url. Then when you click one, triggering a lightbox render, it will fetch the full resolution, plus start fetching full resolution ones of surrounding images. Which should greatly improve ux. 

Testing this method locally does generate some pretty slow load times for images, when trying to view the whole thing. its not bad, but probably can be improved, potentially by having another medium resolution one at 1080p that gets served faster until the full res one comes in. But that increases complexity a decent amount. I want to keep things simple for now. Im pretty close to have a usable version of this up. The most immediate things I need to do now are
1. Figure out how to serve the frontend and backend on a compute instance
2. connect the compute instance to the oracle database
3. set up the oracle cloud database
4. Test everything through cloud and make sure there are no glaring issues with my whole tech stack
5. Uploading images 

# June 25th, 2025
holy shitballs i hate cloud services. I just want a free server man. I was like trying to do everything through oracle because i saw their crazy always free ampere tier thats like 24 GB and also their rates seem pretty decent for storage, database, and all that. But like I've spent two days running a script to automatically try and register one and they're just not available. So we pivoted to google. google has an "always free" tier as well (ill probably end up paying a bit for all the bandwidth on the bucket) and it lowkey sucks but itll get the job done. 1 GB ram may not be happy. But it seems fine so far...? Anyway right now I'm running the backend dockerfile and if this is all good the next thing I need to do is set up a database and bucket but for google this time. Once I have a database set up I need to change the environment variables credentials to access it and then we should just be good to go? Hopefully we have all the hosting stuff done by tomorrow, and then I can actually try this at some scale and implement uploading and authentication. Fuck the build just paused.

i am a god amongst man. Okay well the stupid google server sucks as well but like i got my database actually working remotely properly. We have to tunnel to it so like basically right
`ssh -i C:/Users/Iain/.ssh/key_to_vm -L 3307:${db.private.ip}:3306 ubuntu@${vm.public.ip}`
will tunnel the database at 3306 to our localhost at 3307. 

So then all i should need to do on my server is run that command to get the tunnel working, and then docker compose up and we should be balling. I also need to upload the jar because the server just crashes every time it tries to build the java project :skull:.

# July 1st, 2025
Okay lowkey highkey had a colossal crashout today over getting bucket stuff to work. Thank god for AI because the documentation on the oracle stuff is so incredibly doodoo. I still barely know how it functions but thats a problem for the me who has to get it working on a docker container again. The core features are working now though hooray! Today I got all the image uploading and deleting stuff finished (mostly). And I did a bunch of qol frontend stuff including 
1. Fade transitions as images load in to the gallery view
2. Selections to bulk delete images
3. Indicators for image upload status
4. Download buttons on images for full res download

And i think thats the main things. There's still a bunch of stuff to work on before its fully ready but its getting really close. 

Todo (in order of priority):
1. Ability to select a cover image
2. Delete an album should delete all images in the album
3. Remove download and select from home page
4. Change the medium size image upload resolution
5. Order images by date taken (prefer to do it by backend I think? faster?)

# July 2nd, 2025
Okay so selecting a cover image was lowkey easy, and then deleting an album was mostly easy. Also made the down and select buttons on the image toggleable with props on the album gallery. So I did pretty much everything that was on my todo in like an hour. I haven't done image ordering yet though, and i still need to fix up a dockerfile a bit, since I need to do that ip tunnel for the database. Also need to figure out how the hell I'm gonna do the oracle set up on the server without it being a nightmare. I guess one time setup at least shouldn't be to bad.

# July 6th, 2025
Today I got the website deployed and working. Working being the key part because the server kept crashing when trying to upload images. Turns out the solution was money. This thing still kinda works for free, but to upload images you would have to spin up a local instance and upload that way. Still kinda valid tbh, but I'm just gonna pay for now and see how things go. Its like a 5 dollar server- E2 Small. 

The main features left that I can think of are all just quality of life things. Things like allowing batch downloading and making it so that the admin can re organize images. Re organizing images should actually be quite easy, since the react photo album already has a demo of that functionality on the doc site: https://react-photo-album.com/examples/sortable-gallery. I would also like to do reorganiziation of albums in collections but thats much less priority, since I can very easy just do it manually by changing the album date. Speaking of which, I kinda wanna make it so that albums can have "event dates". But I'm not sure the best way to do it. Actually no I do know. We should not change the createdAt flag, that should be album creation date. But we should add an optional item to the schema which is event date. That will just be a LocalDate object. yeah Imma do that right now actually. I'm so smart omg. 

# July 8th, 2025
So I ran into a small issue which was how the frontend knows which album is the main 'portfolio' that appears as the splash page. I'm going to take a very rudimentary approach that is at least not shit so its extendable in the future. I'm going to create a new table called metadata, and basically just have a key called HOME_ALBUM that maps to an album id. that way we dont have to rebuild the frontend to change the main album.
```mysql
CREATE TABLE metadata (
	`key` varchar(255) PRIMARY KEY,
    `value` TEXT
);
```

I asked Elia to make me a logo today and its actually so sick god bless his soul.![[icon128.png]]
Actually looks so fire.
![[Pasted image 20250708235636.png]]
Also I got the about me done the other day dont know if i wrote that down here. Idk this is mostly just brain dump for fun at this point. 

# August 1st
Improvements to make:
- Loading/processing popup when deleting images - currently just stalls for a bit and then goes to blank page
- 
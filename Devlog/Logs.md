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
	"index": int,
	"coverImage": String,
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
			"index": int,
			"name": String,
			"coverImage": String, // url to the image
			"dateCreated": String
		}
	]
}
```

Since I'm not returning images with this one, I should probably change the class setup. We should have this just be an Album, and then have an AlbumImages that extends it?
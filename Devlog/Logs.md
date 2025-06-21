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
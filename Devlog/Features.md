# Uploading
There are a few things to keep in mind when uploading images, and they kinda go hand in hand with organization. How do we keep image names unique? One method might be to organize images into albums so you can't have duplicate names in an album. You could also name the images based on the album id, since album id's are meant to be unique. 

You know what I like both of these, we should organize images into albums but then also rename them upon upload I kinda like it. So I'll just have to query for the last -###.jpg part of a photo with a certain album id when uploading a new photo and add one to it. 

In the bucket though I don't actually see any reason to organize albums by collection. Album id's are already unique, and this keeps things more flexible if I want a many to many relationship between albums and collections. ie one album can be part of many collections, and collections can contain many unique albums.

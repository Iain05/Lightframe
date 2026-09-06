package com.example.backend.api.controller;

import com.example.backend.api.model.Album;
import com.example.backend.exception.AlbumNotFoundException;
import com.example.backend.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Serves Open Graph metadata for link-preview crawlers (Discord, Slack,
 * iMessage, ...).
 *
 * Those crawlers do not run JavaScript, so they never see the tags the SPA
 * would set at
 * runtime. nginx routes crawler requests for /album/{id} here instead of to
 * index.html,
 * and this returns a bare HTML document whose meta tags describe the album
 * itself.
 */
@RestController
@RequestMapping("/api/og")
public class OpenGraphController {

    private final AlbumService albumService;

    /** Public base URL of the site, no trailing slash, e.g. https://example.com */
    @Value("${public.site.url:}")
    private String siteUrl;

    /** Public base URL photos are served from, trailing slash expected. */
    @Value("${public.bucket.base:}")
    private String bucketBase;

    /** Site name, used as the title when there is no album to describe. */
    @Value("${public.site.name:Lightframe}")
    private String siteName;

    @Autowired
    public OpenGraphController(AlbumService albumService) {
        this.albumService = albumService;
    }

    /**
     * Render the link preview for a single album.
     *
     * Private albums get a full preview too: "private" only hides an album from the
     * collection grid, it doesn't restrict access, so sharing the URL is expected
     * to work.
     *
     * @param id the unique identifier of the album
     * @return an HTML document containing only Open Graph metadata
     */
    @GetMapping(value = "album/{id}", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> albumPreview(@PathVariable String id) {
        Album album;
        try {
            album = albumService.getAlbumDetails(id);
        } catch (AlbumNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(sitePreview());
        }

        String title = blank(album.getName()) ? siteName : album.getName();
        String description = blank(album.getDescription())
                ? photoCount(album)
                : album.getDescription();
        // medium/, not small/ — crawlers downgrade to a tiny side thumbnail below
        // ~300px
        String image = (blank(album.getCoverImage()) || blank(bucketBase))
                ? absolute("/open-graph.jpg")
                : bucketBase.replaceAll("/+$", "") + "/medium/" + album.getCoverImage();

        return ResponseEntity.ok(render(title, description, image, absolute("/album/" + id)));
    }

    /**
     * The generic, album-less preview: whatever a bare link to the site would show.
     */
    private String sitePreview() {
        return render(siteName, "Photography showcase and portfolio.",
                absolute("/open-graph.jpg"), absolute("/"));
    }

    /**
     * Build the HTML document. Any value may be null, in which case its tag is
     * omitted —
     * an absent og:image is handled gracefully by crawlers, a malformed one is not.
     */
    private String render(String title, String description, String image, String url) {
        StringBuilder html = new StringBuilder();
        html.append("<!doctype html>\n<html lang=\"en\">\n<head>\n")
                .append("<meta charset=\"UTF-8\">\n")
                .append(tag("og:title", title))
                .append(tag("og:description", description))
                .append(tag("og:image", image))
                .append(tag("og:url", url))
                .append("<meta property=\"og:type\" content=\"website\">\n")
                .append("<meta name=\"twitter:card\" content=\"summary_large_image\">\n");

        if (image != null) {
            html.append("<meta name=\"twitter:image\" content=\"").append(escape(image)).append("\">\n");
        }
        if (title != null) {
            html.append("<title>").append(escape(title)).append("</title>\n");
        }
        html.append("</head>\n<body>\n");
        if (url != null) {
            html.append("<a href=\"").append(escape(url)).append("\">")
                    .append(escape(title == null ? "View" : title)).append("</a>\n");
        }
        html.append("</body>\n</html>\n");
        return html.toString();
    }

    private String tag(String property, String content) {
        if (content == null || content.isBlank())
            return "";
        return "<meta property=\"" + property + "\" content=\"" + escape(content) + "\">\n";
    }

    /**
     * Turn a site-relative path into an absolute URL. Open Graph requires absolute
     * URLs;
     * returns null when the site URL isn't configured so the tag gets dropped
     * instead.
     */
    private String absolute(String path) {
        if (blank(siteUrl))
            return null;
        return siteUrl.replaceAll("/+$", "") + path;
    }

    private String photoCount(Album album) {
        Integer count = album.getNumPhotos();
        if (count == null || count == 0)
            return null;
        return count + (count == 1 ? " photo" : " photos");
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }

    /**
     * Album names and descriptions are user-supplied; an unescaped quote breaks the
     * tag.
     */
    private String escape(String value) {
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}

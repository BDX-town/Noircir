# Noircir - Blog Generator for bdx.town

Noircir is a blog generator developed for bdx.town, aiming to address issues with the current Plume platform. Due to concerns about its reliability and a commitment to eco-responsibility, the transition to a static file-based solution became necessary.

## Project Focus

- **Not Another Static Blog Generator:** Noircir utilizes 11ty to create a static file-based CMS, ensuring users can manage blogs independently without relying on servers other than Nginx.
- **User Experience Considerations:** The project focuses on improving user experience, especially for non-tech-savvy users, by using static HTML files to create a multi-page application with progressive enhancement.
- **Eco-responsability**: Effortlessly create a minimalistic blog using flat files, promoting responsible practices such as image dithering, media compression, and the use of lightweight JavaScript bundles for a swift and eco-friendly browsing experience. Prioritize simplicity without compromising on thoughtful behaviors.

## Technical Components

- **Vite Project:** Customized Vite project generates multiple HTML files, forming a lightweight CMS app.
- **NGINX Server:** Configured with Webdav for source content file management and potential future authentication handling.
- **Automation Scripts:** Scripts trigger 11ty when files are created, edited, or deleted.
- **11ty:** Serves as the core static site generator for effective blog management.

## CMS Features

Users can:
- View blog posts
- Create new blog posts
- Edit existing blog posts
- Add media to blog posts
- Delete blog posts
- Remove media

## Configuration

You can set or change these values in your environement in order to change some parameters: 

```bash
# noircir folder: where you saved noircir files
ENV NOIRCIR_FOLDER="/noircir"
# nginx root: all noircir data will be saved there, blogs and generated content
ENV NGINX_FOLDER=/var/www/html
# 11ty base path: all blogs data will be saved there. Will be under NGINX_FOLDER
ENV BLOGS_FOLDER=blogs
# blog's ressources: each blog has it's own ressources folder, where all media will be uploaded. Will be under NGINX_FOLDER/BLOGS_FOLDER/username
ENV RESSOURCES_FOLDER=ressources
# Please create a dedicated to run noircir and it to the nginx www-data group
ENV WWW_USER=noircir
# must match nginx group
ENV WWW_GROUP=www-data
```

## Roadmap

- Error handling strategy
- Offline operation
- prevent ressources folder to be erased 
- Ensure meta.json format after edition
- Prevent files that are not media / markdown to be uploaded via webdav
- sanitize blog post content in template 
- use alpine instead of debian for container


## Mockups

Explore the [Figma mockups](https://www.figma.com/file/4yeNx17sBsMgZeaoCX2jhT/Noirsir?type=design&node-id=0-1&mode=design&t=AFuMcptQkwRsC053-0) for a visual representation.

## Tools

- [Blog generator 11ty](https://www.11ty.dev/) - Static site generator
- [Webdav library](https://www.npmjs.com/package/webdav) - Used for Webdav functionality

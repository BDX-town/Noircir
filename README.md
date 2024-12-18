# Noircir - Blog Generator for bdx.town

Noircir is a static blog generator built for the bdx.town community, providing an eco-friendly and reliable alternative to the Plume platform. Designed with sustainability in mind, it prioritizes minimal server reliance by generating static files while delivering an intuitive experience for users.


## Project Focus

- **Not Another Static Blog Generator:** Noircir utilizes 11ty to create a static file-based CMS, ensuring users can manage blogs independently without relying on servers other than Nginx.
- **User Experience Considerations:** The project focuses on improving user experience, especially for non-tech-savvy users, by using static HTML files to create a multi-page application with progressive enhancement.
- **Eco-responsability**: Effortlessly create a minimalistic blog using flat files, promoting responsible practices such as image dithering, media compression, and the use of lightweight JavaScript bundles for a swift and eco-friendly browsing experience. Prioritize simplicity without compromising on thoughtful behaviors.

## Technical Components

- **Vite Project:** Customized Vite project generates multiple HTML files, forming a lightweight CMS app.
- **NGINX Server:** Configured with Webdav for source content file management and potential future authentication handling.
- **Automation Scripts:** Scripts trigger 11ty when files are created, edited, or deleted.
- **11ty:** Serves as the core static site generator for effective blog management.

## Project structure 

* **cms**: Contains the React-based CMS that allows users to interact with the WebDAV server seamlessly, without needing to use their own WebDAV client.
* **template**: Holds the code for a sample blog rendering template. Refer to its dedicated README for more details on customization and usage.
* **generator**: Includes the 11ty configuration for generating blogs, leveraging the template project for rendering blog content.
* **tools**: A collection of shell scripts for maintenance tasks, such as starting the service, updating, and adding/deleting users.

## Configuration

You can set or change these values in your environement in order to change some parameters: 

```bash
# Please set this var env at startup as it is mandatory
ENV SERVER localhost
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

We are providing a docker image via Github release for ease of use.

```
# Any of the var env specified earlier can be set with the -e arg
docker run -p <external-port>:8080 -e "SERVER=<your server address>" noircir
```



## Roadmap

- use Oauth instead of basic Auth
- prevent ressources folder to be erased 
- Ensure meta.json format after edition
- Prevent files that are not media / markdown to be uploaded via webdav


## Mockups

Explore the [Figma mockups](https://www.figma.com/file/4yeNx17sBsMgZeaoCX2jhT/Noirsir?type=design&node-id=0-1&mode=design&t=AFuMcptQkwRsC053-0) for a visual representation.

## Tools

- [Blog generator 11ty](https://www.11ty.dev/) - Static site generator
- [Webdav library](https://www.npmjs.com/package/webdav) - Used for Webdav functionality

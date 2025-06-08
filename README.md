# Noircir - Blog Generator for bdx.town

Noircir is a static blog generator built for the bdx.town community, providing an eco-friendly and reliable alternative to the Plume platform. Designed with sustainability in mind, it prioritizes minimal server reliance by generating static files while delivering an intuitive experience for users.

## Technical Components

* **Vite Project:** Customized Vite project generates multiple HTML files, forming a lightweight CMS app.
* **NGINX Server:** Configured with WebDAV for source content file management and potential future authentication handling.
* **Automation Scripts:** Scripts trigger 11ty when files are created, edited, or deleted.
* **11ty:** Serves as the core static site generator for effective blog management.

## Project Structure

* **cms**: Contains the React-based CMS that allows users to interact with the WebDAV server seamlessly, without needing to use their own WebDAV client.
* **template**: Holds the code for a sample blog rendering template. Refer to its dedicated README for more details on customization and usage.
* **generator**: Includes the 11ty configuration for generating blogs, leveraging the template project for rendering blog content.
* **tools**: A collection of shell scripts for maintenance tasks, such as starting the service, updating, and adding/deleting users.

## Blog Structure

The CMS project is designed to allow authenticated users to edit these files through a user-friendly web interface. This removes the need for direct file system access or manual editing via WebDAV clients.

A "noircir" blog is a directory inside the `BLOGS_FOLDER`. It must contain:

### 1. Blog Metadata JSON File

A single JSON file named after the blog (e.g. `boxon.json`) that defines core metadata:

```json
{
  "blogDescription": "A short description of the blog",
  "blogName": "MyBlog",
  "blogCover": "https://example.com/path/to/cover.jpg",
  "layout": "article.11ty.js",
  "lang": "fr-FR"
}
```

### 2. Markdown Posts

Each blog post is written in a markdown file with frontmatter metadata:

```markdown
---
title: "Sample Blog Post Title"
description: "A short summary of the blog post"
cover: "https://example.com/path/to/cover.png"
createdAt: "2024-01-01T00:00:00.000Z"
updatedAt: "2024-01-02T00:00:00.000Z"
draft: false
---

<contenu markdown>
```

### 3. Ressources Folder

A subfolder named `ressources` is used to store uploaded images or other media for the blog.

## Configuration

Set the following environment variables to customize Noircir:

```bash
# Mandatory at startup
env SERVER=localhost
# Folder where Noircir source files are stored
env NOIRCIR_FOLDER="/noircir"
# NGINX root for all data
env NGINX_FOLDER=/var/www/html
# Blog data location (under NGINX_FOLDER)
env BLOGS_FOLDER=blogs
# Media storage folder (under NGINX_FOLDER/BLOGS_FOLDER/username)
env RESSOURCES_FOLDER=ressources
# Dedicated user to run Noircir, must belong to nginx group
env WWW_USER=noircir
env WWW_GROUP=www-data
```

## Docker

Use the provided Docker image via GitHub release:

```bash
# Any of the env vars above can be set using -e

docker run -p <external-port>:8080 -e "SERVER=<your server address>" noircir
```

## Roadmap

* Use OAuth instead of Basic Auth
* Prevent deletion of the `ressources` folder
* Ensure consistent format of metadata JSON after edits
* Restrict WebDAV uploads to markdown and media files only

## Mockups

Explore the [Figma mockups](https://www.figma.com/file/4yeNx17sBsMgZeaoCX2jhT/Noirsir?type=design&node-id=0-1&mode=design&t=AFuMcptQkwRsC053-0) for a visual representation.

## Tools

* [11ty](https://www.11ty.dev/) - Static site generator
* [WebDAV JS Library](https://www.npmjs.com/package/webdav) - Used for file synchronization

---

Refer to the `template/` subproject documentation for how blogs are rendered using React components like `HtmlArticle`, `HtmlIndex`, `Article`, and `Index`.

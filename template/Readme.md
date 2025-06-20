# Template

This subproject provides the HTML and React-based rendering logic for a blog system powered by [Eleventy (11ty)](https://www.11ty.dev/) and WebDAV. It includes reusable React components used to generate blog articles and blog indexes.

## Components

### `HtmlArticle`

Renders a single blog post page. This is a wrapper component responsible for assembling the full HTML page structure, including metadata and layout elements. The actual content rendering is delegated to the `Article` component.

> **Note:** The `content` field of this component should contain the raw HTML output generated by the `Article` component.

#### Props

`HtmlArticle` expects a single object with the following shape:

```ts
interface HtmlArticleProps {
  // General blog metadata
  blogName: string;           // Name of the blog
  blogDescription: string;    // Short description of the blog
  blogCover: string;          // URL to the blog's cover image
  fediverse?: string;         // Optional Fediverse handle
  lang: "fr-FR";              // Language code (fixed to French)

  // Web wrapper information
  style: string;              // URL to the stylesheet used by the blog
  page: {
    url: string;             // Eleventy-generated URL of the current page
  };
  content: string;           // Raw HTML content rendered by the `Article` component

  // Post-specific data
  file: string;              // Internal identifier or file path
  title: string;             // Title of the blog post
  description: string;       // Short summary or meta description
  weight: number;            // Ordering weight (used for sorting)
  cover?: string;            // Optional cover image for the post
  updatedAt: Date;           // Last updated timestamp
  createdAt: Date;           // Creation timestamp
  content: string;           // Full HTML content of the post
  draft: boolean;            // Indicates if the post is in draft mode
}
```

---

### `Article`

Renders the actual content of a blog post.

#### Props

```ts
interface ArticleProps {
  // Post-specific data
  file: string;
  title: string;
  description: string;
  weight: number;
  cover?: string;
  updatedAt: Date;
  createdAt: Date;
  content: string;
  draft: boolean;

  // General blog metadata
  blogName: string;
  blogDescription: string;
  blogCover: string;
  fediverse?: string;
  lang: "fr-FR";
}
```

---

### `HtmlIndex`

Renders the blog index page (typically listing blog posts). This is a wrapper component used to build the page layout and metadata. The actual listing is handled by the `Index` component.

> **Note:** The `content` field of this component should contain the raw HTML output generated by the `Index` component.

#### Props

```ts
interface HtmlIndexProps {
  // General blog metadata
  blogName: string;
  blogDescription: string;
  blogCover: string;
  fediverse?: string;
  lang: "fr-FR";

  // Web wrapper information
  style: string;
  page: {
    url: string;
  };
  content: string;           // Raw HTML content rendered by the `Index` component
}
```

---

### `Index`

Renders the content of the blog index page.

#### Props

```ts
interface IndexProps {
  // General blog metadata
  blogName: string;
  blogDescription: string;
  blogCover: string;
  fediverse?: string;
  lang: "fr-FR";

  // Collection of blog posts
    pages: Array<{
        data: {
            file: string;
            title: string;
            description: string;
            weight: number;
            cover?: string;
            updatedAt: Date;
            createdAt: Date;
            content: string;
            draft: boolean;
        },
        page: {
            url: string;
        }
    }>;
}
```

---

## Usage

This template project is intended to be consumed by a blog generator that:

1. Generates static content using **Eleventy**.
2. Provides data for blog posts and index pages using the interfaces above.
3. Renders final HTML using the `HtmlArticle` and `HtmlIndex` wrapper components.

These wrappers handle metadata and layout setup, while `Article` and `Index` perform the actual content rendering. The result of `Article` and `Index` should be passed as raw HTML to the `content` field of their respective wrapper components.


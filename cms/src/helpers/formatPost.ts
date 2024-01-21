import { Post } from "../types/Post";

export function formatPost(post: Post) {
    return `---
title: ${JSON.stringify(post.title)}
description: ${JSON.stringify(post.description)}
cover: "https://i.gifer.com/origin/a5/a5d89b8c37ad96dc56a5874bee8de8a5_w200.gif"
---
${post.content} `;
}
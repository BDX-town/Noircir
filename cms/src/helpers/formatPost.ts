import { Post } from "types/src/Post";

export function formatPost(post: Post) {
    return `---
title: ${JSON.stringify(post.title)}
description: ${JSON.stringify(post.description)}
cover: ${JSON.stringify(post.cover)}
createdAt: ${JSON.stringify(post.createdAt.toISOString())}
updatedAt: ${JSON.stringify(post.updatedAt.toISOString())}
draft: ${JSON.stringify(post.draft)}
---
${post.content} `;
}
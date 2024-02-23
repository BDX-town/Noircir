import { Post } from "../types/Post";

export function formatPost(post: Post) {
    return `---
title: ${JSON.stringify(post.title)}
description: ${JSON.stringify(post.description)}
cover: ${JSON.stringify(post.cover)}
createdAt: ${JSON.stringify(post.createdAt.toISOString())}
updatedAt: ${JSON.stringify(post.updatedAt.toISOString())}
---
${post.content} `;
}
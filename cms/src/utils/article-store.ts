import { createArticleId, parseArticle } from "../services/articles";
import type { Article } from "../types";

const STORE_KEY = "noircir-local-article-store"
const LATEST_STORE_KEY = "noircir-local-article-latest-tag"

function getArticle(id: string): Promise<Article | undefined> {
    const rawStore = localStorage.getItem(STORE_KEY)
    if(!rawStore) return Promise.resolve(undefined)
    const store = JSON.parse(rawStore)
    if(!store[id]) return Promise.resolve(undefined)
    return parseArticle(store[id]);
}

function storeArticle(article: Article): void {
    const rawStore = localStorage.getItem(STORE_KEY) || '{}'
    const store = JSON.parse(rawStore)
    store[article.id || createArticleId(article)] = article
    console.log('stored backup', article);
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
}

export default {
    getArticle,
    storeArticle
}
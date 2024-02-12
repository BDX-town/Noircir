import type { Story } from "@ladle/react"
import React from "react"
import Article from "./Article.tsx"


const article = {
    title: "How to speed up Akkoma (and Pleroma)",
    cover: "https://plume.bdx.town/static/media/6B0EE834-ED46-9D2A-FC4F-47BBAEE95556.png",
    description: "Fast and 😎-ious",
    content: "Bonjour",
    updatedAt: new Date().toISOString(),
    lang: 'fr-FR',
    blogName: "Faits diverses",
    blogDescription: "A propos de trucs et de machins",
    blogCover: "https://plume.bdx.town/static/media/6B0EE834-ED46-9D2A-FC4F-47BBAEE95556.png",
    style: "/style.css",
}

export const BaseStory: Story = (props) => <Article {...article} {...props}></Article>
BaseStory.storyName = "Base"

BaseStory.args = {}
BaseStory.argTypes = {}

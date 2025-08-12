import { useAppContext } from '@/hooks/useAppContext'
import React from 'react'

export function SideBar() {
    const { blog, posts } = useAppContext()

    return (
        <div className='h-full flex flex-col'>
            <h1>{ blog?.name }</h1>
            <div className='grow flex flex-col gap-2'>
                {
                    posts.map((post) => (
                        <a href="#" key={post.file}>
                            <strong>
                                {  post.title }
                            </strong>
                            <div className='flex justify-between items-center'>
                                <time>
                                    {post.createdAt.toLocaleDateString()}
                                </time>
                                <span>
                                    voir
                                </span>
                            </div>
                        </a>
                    ))
                }
            </div>
        </div>
    )
}
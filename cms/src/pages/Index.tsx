import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import EasyMDE from 'easymde'
import debounce from 'debounce'
import { parse } from 'marked'
import { Post as IPost } from 'types/src/Post'
import { Article } from 'template'
import { Blog } from 'types/src/Blog'


export function Index() {
    const editor = useRef<EasyMDE>()
    const [post, setPost] = useState<Partial<IPost>>({})

    const onPostContentChange = useMemo(() => debounce(async () => {
        const content = await parse(editor.current?.value() || '')
        setPost({ ...post, content })
    }, 500), [post])

    useLayoutEffect(() => {
        editor.current = new EasyMDE()
    }, []);

    useEffect(() => {
        if(!editor.current) return undefined
        editor.current.codemirror.on("change", onPostContentChange)
        return () =>  {
            editor.current?.codemirror.off("change", onPostContentChange)
        }
    }, [onPostContentChange])

    const onPostDelete = useCallback(() => {

    }, [])

    return (
        <>
        <div className='flex gap-5 items-center justify-between'>
            <input name="title" />
            <div>
                <button onClick={onPostDelete}>supprimer</button>
            </div>
        </div>
        <div className='flex items-start'>
            <div>
                {
                    // TODO: when focusing on thqt the rest of the page should hide
                }
                <textarea />
            </div>
            <div>
                <Article blog={undefined as unknown as Blog} post={post as IPost} />
            </div>
        </div>
        </>
    )
}
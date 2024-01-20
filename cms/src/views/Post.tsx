import React from 'react';
import { Button, TextInput, useTranslations } from '@bdxtown/canaille';
import {MDXEditor, headingsPlugin, toolbarPlugin, markdownShortcutPlugin, BlockTypeSelect, BoldItalicUnderlineToggles, UndoRedo, InsertImage, linkDialogPlugin, CreateLink, imagePlugin, MDXEditorMethods  } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css'
import { IconBookUpload } from '@tabler/icons-react'
import fr from './Post.fr-FR.i18n.json';
import { useAppContext } from '../data/AppContext';
import { useParams } from 'react-router-dom';
import { Loader } from './../bits/Loader';
import { editPost } from '../services/posts';

export const Location = {
    path: '/post/:file',
}

export const Post = () => {
    const param = useParams();
    const filename = param.file;
    const { posts, blog } = useAppContext();
    const post = React.useMemo(() => {
        return posts?.find((p) => p.file === filename);
    }, [filename, posts]);
    const { __, T } = useTranslations('Post', {'fr-FR': fr});
    const editor = React.useRef<MDXEditorMethods>(null);


    const onSubmit: React.FormEventHandler = React.useCallback(async (e) => {
        e.preventDefault();
        if(!editor.current || !post || !blog) return;
        const formData = Array.from(new FormData(e.currentTarget as HTMLFormElement)
            .entries())
            .reduce((acc, curr) => ({...acc, [curr[0]]: curr[1]}), {});
        const data = {
            ...post,
            ...formData,
            content: editor.current?.getMarkdown()
        }
        // TODO: feedback
        const result = await editPost(blog, data);
        console.log(result);
    }, [blog, post]);


    if(!post) return (
        <div className='grow flex flex-col items-center justify-center'>
            <Loader />
        </div>
    );

    return (
        <form className="grow p-5 flex flex-col gap-4" onSubmit={onSubmit}>
            <TextInput name="title" label={__('title')} defaultValue={post?.title} />
            <TextInput name="description" label={__('description')} defaultValue={post?.description} />
            <MDXEditor 
                className='grow border-solid border-2 border-grey-100 rounded-2xl overflow-hidden' 
                markdown={post?.content as string} 
                ref={editor}
                plugins={[
                    linkDialogPlugin(),
                    imagePlugin(),
                    headingsPlugin(),
                    toolbarPlugin({
                        toolbarContents: () => (
                        <>
                            {' '}
                            <UndoRedo />
                            <BlockTypeSelect />
                            <BoldItalicUnderlineToggles />
                            <CreateLink />
                            <InsertImage />
                        </>
                        )
                    }),
                    markdownShortcutPlugin()
                ]} 
            />
            <div className='text-right'>
                <Button size={50} htmlType='submit'>
                    <IconBookUpload /> <T>publish</T>
                </Button>
            </div>
        </form>
    )
}
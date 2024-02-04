import React from 'react';
import { useAppContext } from '../data/AppContext';
import { TextInput, Button, useTranslations } from '@bdxtown/canaille';
import {MDXEditor, headingsPlugin, toolbarPlugin, markdownShortcutPlugin, BlockTypeSelect, BoldItalicUnderlineToggles, UndoRedo, InsertImage, linkDialogPlugin, CreateLink, imagePlugin, MDXEditorMethods  } from '@mdxeditor/editor';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { Blog as IBlog } from '../types/Blog';

import fr from './Blog.fr-FR.i18n.json';

export const Location = {
    path: '/blog'
}

export const Blog = () => {
    const { blog, actions} = useAppContext();
    const { editBlog } = actions;
    const { __, T} = useTranslations('Blog', { 'fr-FR': fr });
    const editor = React.useRef<MDXEditorMethods>(null);


    const onSubmit: React.FormEventHandler<HTMLFormElement> = React.useCallback(async (e) => {
        e.preventDefault();
        if(!editor.current) return;
        const formData: Partial<IBlog> = Array.from(new FormData(e.currentTarget as HTMLFormElement)
            .entries())
            .reduce((acc, curr) => ({...acc, [curr[0]]: curr[1]}), {});
        const data: IBlog = {
            ...blog,
            ...formData,
            description: editor.current.getMarkdown(),
        };
        const result = await editBlog(data);
        // TODO: add feedback
        console.log(result);
    }, [blog, editBlog]);

    return (
        <form className="grow p-5 flex flex-col gap-4" onSubmit={onSubmit}>
            <TextInput name="name" label={__('title')} defaultValue={blog.name} />
            <MDXEditor 
                className='grow border-solid border-2 border-grey-100 rounded-2xl overflow-hidden' 
                markdown={blog.description} 
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
            <div className='flex justify-end'>
                <div className='flex gap-3 items-center'>
                    <Button size={50} htmlType='submit'>
                        <IconDeviceFloppy /> <T>publish</T>
                    </Button>
                </div>

            </div>
        </form>
    )
}
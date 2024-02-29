import React from 'react';
import { useAppContext } from '../data/AppContext';
import { TextInput, Button, useTranslations } from '@bdxtown/canaille';
import {MDXEditor, toolbarPlugin, markdownShortcutPlugin, BlockTypeSelect, BoldItalicUnderlineToggles, UndoRedo, linkDialogPlugin, CreateLink, MDXEditorMethods, listsPlugin, linkPlugin, quotePlugin  } from '@mdxeditor/editor';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { Blog as IBlog } from 'types/src/Blog';

import { MediaInput } from '../bits/MediaInput';

import fr from './Blog.fr-FR.i18n.json';

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
            blogDescription: editor.current.getMarkdown(),
        };
        const result = await editBlog(data);
        // TODO: add feedback
        console.log(result);
    }, [blog, editBlog]);

    return (
        <form className="grow p-5 flex flex-col gap-4" onSubmit={onSubmit}>
            <div className='flex gap-3 items-start'>
                <div className='flex flex-col w-full'>
                    <TextInput className='grow' name="blogName" label={__('title')} defaultValue={blog.blogName} required />
                    <p className='self-end max-w-[450px] text-right text-sm text-gray-700'><T>cover-description</T></p>
                </div>
                <MediaInput className='h-[100px]' label={__('cover')} name="blogCover" required defaultValue={blog.blogCover}>
                    <T>cover</T>
                </MediaInput>
            </div>
            <MDXEditor 
                className='grow border-solid border-2 border-grey-100 rounded-2xl overflow-hidden bg-white' 
                markdown={blog.blogDescription} 
                ref={editor}
                plugins={[
                    listsPlugin(),
                    linkPlugin(),
                    quotePlugin(),
                    markdownShortcutPlugin(),
                    linkDialogPlugin(),
                    toolbarPlugin({
                        toolbarContents: () => (
                        <>
                            {' '}
                            <UndoRedo />
                            <BlockTypeSelect />
                            <BoldItalicUnderlineToggles />
                            <CreateLink />
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
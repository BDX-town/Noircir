import React from 'react';
import { useAppContext } from '../data/AppContext';
import { TextInput, Button, useTranslations } from '@bdxtown/canaille';
import {MDXEditor, toolbarPlugin, markdownShortcutPlugin, BlockTypeSelect, BoldItalicUnderlineToggles, UndoRedo, linkDialogPlugin, CreateLink, MDXEditorMethods, listsPlugin, linkPlugin, quotePlugin  } from '@mdxeditor/editor';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { Blog as IBlog } from 'types/src/Blog';

import { MediaInput } from '../bits/MediaInput';

import fr from './Blog.fr-FR.i18n.json';
import { AppError } from '../data/AppError';
import { EDIT_BLOG_DENY, EDIT_BLOG_FAIL, EDIT_BLOG_FALSE } from '../services/blogs';
import { ButtonProcess } from '../bits/ButtonProcess';


export const Blog = () => {
    const { blog, actions} = useAppContext();
    const { editBlog } = actions;
    const { __, T} = useTranslations('Blog', { 'fr-FR': fr });
    const editor = React.useRef<MDXEditorMethods>(null);

    const [processing, setProcessing] = React.useState(false);
    const [error, setError] = React.useState<AppError | undefined>(undefined);


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
        setProcessing(true);
        try {
            const result = await editBlog(data);
            if(!result) setError(new AppError(EDIT_BLOG_FALSE, "The server file system refused the edit, something is wrong."));
        } catch (e) {
            const appError = e as AppError;
            if(appError.code === EDIT_BLOG_FAIL || appError.code === EDIT_BLOG_DENY) setError(appError);
            else throw e;
        } finally {
            setProcessing(false);
        }
    }, [blog, editBlog]);

    return (
        <form className="grow p-5 flex flex-col gap-4" onSubmit={onSubmit}>
            <div className='flex gap-3 items-start'>
                <div className='flex flex-col w-full'>
                    <TextInput className='grow' name="blogName" label={__('title')} defaultValue={blog.blogName} required />
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
                    <ButtonProcess processing={processing} error={error} size={50} htmlType="submit">
                        <IconDeviceFloppy /> <T>publish</T>
                    </ButtonProcess>
                </div>

            </div>
        </form>
    )
}
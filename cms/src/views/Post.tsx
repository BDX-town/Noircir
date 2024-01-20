import React from 'react';
import { Button, TextInput, useTranslations } from '@bdxtown/canaille';
import {MDXEditor, headingsPlugin, toolbarPlugin, markdownShortcutPlugin, BlockTypeSelect, BoldItalicUnderlineToggles, UndoRedo, InsertImage, linkDialogPlugin, CreateLink, imagePlugin, MDXEditorMethods  } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css'
import { IconBookUpload, IconTrash, IconBook2 } from '@tabler/icons-react'
import fr from './Post.fr-FR.i18n.json';
import { useAppContext } from '../data/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from './../bits/Loader';
import { Modal } from '../bits/Modal';
import { Post as IPost } from '../types/Post';
import { slugify } from './../helpers/slugify';

export const Location = {
    path: '/post/:file',
}

const DeleteModal = ({ onCancel, post }: { onCancel: React.MouseEventHandler, post: IPost }) => {
    const { actions } = useAppContext();
    const { deletePost } = actions;
    const { T } = useTranslations('Post', {'fr-FR': fr});

    const navigate = useNavigate();

    const onConfirm = React.useCallback(async () => {
        // TODO: feedback
        const result = await deletePost(post);
        console.log(result);
        navigate('/');
    }, [deletePost, navigate, post]);

    return (
        <Modal className='bg-additional-primary'>
            <T>shouldDelete</T>
            <div className='mt-3 flex justify-between items-center gap-4'>
                <Button size={50} className='bg-red-500' onClick={onConfirm}>
                    <IconTrash /> <T>confirm</T>
                </Button>
                <Button size={50} onClick={onCancel}>
                    <IconBook2 /> <T>cancel</T>
                </Button>
            </div>
        </Modal>
    );
}

export const Post = ({ blank = false }: { blank?: boolean }) => {
    const param = useParams();
    const filename = param.file;
    const { posts, blog, actions } = useAppContext();
    const { editPost } = actions;
    const post = React.useMemo(() => {
        return posts?.find((p) => p.file === filename);
    }, [filename, posts]);
    const { __, T } = useTranslations('Post', {'fr-FR': fr});
    const editor = React.useRef<MDXEditorMethods>(null);
    const [shouldDelete, setShouldDelete] = React.useState(false);


    const onSubmit: React.FormEventHandler = React.useCallback(async (e) => {
        e.preventDefault();
        if(!editor.current || !blog || (!blank && !post)) return;
        const formData: Partial<IPost> = Array.from(new FormData(e.currentTarget as HTMLFormElement)
            .entries())
            .reduce((acc, curr) => ({...acc, [curr[0]]: curr[1]}), {});
        const data: IPost = {
            ...post,
            ...formData,
            file: post?.file || `${slugify(formData.title as string)}-${new Date().getTime()}.md`,
            content: editor.current?.getMarkdown()
        } as IPost
        // TODO: feedback
        const result = await editPost(data);
        console.log(result);
    }, [blank, blog, editPost, post]);


    if(!post && !blank) return (
        <div className='grow flex flex-col items-center justify-center'>
            <Loader />
        </div>
    );

    return (
        <>
            <form className="grow p-5 flex flex-col gap-4" onSubmit={onSubmit}>
                <TextInput name="title" label={__('title')} defaultValue={post?.title} />
                <TextInput name="description" label={__('description')} defaultValue={post?.description} />
                <MDXEditor 
                    className='grow border-solid border-2 border-grey-100 rounded-2xl overflow-hidden' 
                    markdown={post?.content as string || ""} 
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
                <div className='flex justify-between'>
                    {
                        !blank ? (
                            <Button variant='secondary' onClick={() => setShouldDelete(true)}>
                                <IconTrash /> <T>delete</T>
                            </Button>
                        ) : (
                            <span className='opacity-0'></span>
                        )
                    }
                    <Button size={50} htmlType='submit'>
                        <IconBookUpload /> <T>publish</T>
                    </Button>
                </div>
            </form>
            {
                shouldDelete && <DeleteModal post={post as IPost} onCancel={() => setShouldDelete(false)} />
            }
        </>
    )
}
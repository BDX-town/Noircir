import React from 'react';
import { Button, TextInput, useTranslations, createUseStyles, Checkbox } from '@bdxtown/canaille';
import {MDXEditor, headingsPlugin, toolbarPlugin, markdownShortcutPlugin, BlockTypeSelect, BoldItalicUnderlineToggles, UndoRedo, linkDialogPlugin, CreateLink, imagePlugin, MDXEditorMethods, listsPlugin, linkPlugin, quotePlugin  } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css'
import { IconBookUpload, IconTrash, IconBook2, IconDeviceFloppy } from '@tabler/icons-react'
import fr from './Post.fr-FR.i18n.json';
import { useAppContext } from '../data/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from './../bits/Loader';
import { Modal } from '../bits/Modal';
import { Post as IPost } from 'types/src/Post';
import { slugify } from './../helpers/slugify';
import { formatPost } from '../helpers/formatPost';
import { ImageUploader } from './../bits/ImageUploader';
import debounce from 'debounce';
import { weight as calculateWeight } from './../helpers/weight'

import { MediaInput } from '../bits/MediaInput';
import { ButtonProcess } from '../bits/ButtonProcess';
import { AppError } from '../data/AppError';
import { DELETE_MEDIA_DENY, DELETE_MEDIA_FAIL } from '../services/media';
import { EDIT_POST_DENY, EDIT_POST_FAIL, EDIT_POST_FALSE } from '../services/posts';
import { HTMLAdd } from '../bits/HTMLAdd';


const useStyle = createUseStyles({
    editorCSS: {
        "&>.mdxeditor-toolbar": {
            maxWidth: "800px",
            marginLeft: "auto",
            marginRight: "auto",
            zIndex: 0,
            overflow: "visible !important",

            "&>*": {
                zIndex: "1 !important",
            },

            "&::before": {
                content: "''",
                position: "absolute",
                width: "1vw",
                height: "1%",
                transformOrigin: "0 0",
                transform: "scale(100, 100) translateX(-50%)",
                backgroundColor: "inherit",
                top: 0,
                left: "50%",
                zIndex: 0,
            },
        }
    } as React.CSSProperties,
    confirmDelete: {
        "&>button": {
            background: "rgb(239 68 68 / var(--tw-bg-opacity))",
        }
    }
})

const DeleteModal = ({ onCancel, post }: { onCancel: React.MouseEventHandler, post: IPost }) => {
    const { actions } = useAppContext();
    const { deletePost } = actions;
    const { T } = useTranslations('Post', {'fr-FR': fr});
    const { confirmDelete } = useStyle();

    const [error, setError] = React.useState<AppError | undefined>(undefined);
    const [processing, setProcessing] = React.useState(false);

    const navigate = useNavigate();

    const onConfirm = React.useCallback(async () => {
        setProcessing(true);
        setError(undefined);
        try {
            await deletePost(post);
            navigate('/');
        } catch (e) {
            const appError = e as AppError;
            if(appError.code === DELETE_MEDIA_DENY || appError.code === DELETE_MEDIA_FAIL) setError(appError);
            else throw e;
        } finally {
            setProcessing(false);
        }
    }, [deletePost, navigate, post]);

    return (
        <Modal className='bg-additional-primary' onClose={onCancel}>
            <T>shouldDelete</T>
            <div className='mt-3 flex justify-between items-center gap-4'>
                <ButtonProcess className={confirmDelete} size={50} onClick={onConfirm} processing={processing} error={error}>
                    <IconTrash /> <T>confirm</T>
                </ButtonProcess>
                <Button size={50} onClick={onCancel}>
                    <IconBook2 /> <T>cancel</T>
                </Button>
            </div>
        </Modal>
    );
}


  


const Post = ({ blank = false }: { blank?: boolean }) => {
    const param = useParams();
    const filename = param.file;
    const { posts, blog, actions, online, media } = useAppContext();
    const { editPost } = actions;
    const post = React.useMemo(() => {
        return posts?.find((p) => p.file === filename);
    }, [filename, posts]);
    const { __, T } = useTranslations('Post', {'fr-FR': fr});
    const editor = React.useRef<MDXEditorMethods>(null);
    const [shouldDelete, setShouldDelete] = React.useState(false);
    const editorWrapper = React.useRef<HTMLDivElement>(null);
    const [imageWeight, setImageWeight] = React.useState(0);
    const [draft, setDraft] = React.useState(post?.draft === undefined ? true : post.draft);

    const [weight, setWeight] = React.useState(post ? new TextEncoder().encode(formatPost(post)).length : 0);

    const { editorCSS } = useStyle();

    const [processing, setProcessing] = React.useState(false);
    const [success, setSuccess] = React.useState<string | undefined>(undefined);
    const [error, setError] = React.useState<AppError | undefined>(undefined);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const calculateImageWeight = React.useCallback(debounce(async () => {
        if(!editorWrapper.current || !online) return;
        const sources = [
            post?.cover,
            ...(Array.from(editorWrapper.current.querySelectorAll('img')) as HTMLImageElement[]).map((r) => r.currentSrc)
        ].filter((r) => (!!r)) as string[];
        const imgRequest = Array.from(new Set(sources))
            .map((r) => fetch(r).then((f) => f.text()));
        const imgSizes = await Promise.all(imgRequest);
        setImageWeight(imgSizes.reduce((acc, curr) => acc += curr.length, 0));
    }, 500), [online]);

    React.useEffect(() => {
        calculateImageWeight();
    }, [calculateImageWeight]);

    const onChange: React.KeyboardEventHandler<HTMLFormElement> = React.useCallback((e) => {
        const formData: Partial<IPost & { "cover-weight": string}> = Array.from(new FormData(e.currentTarget as HTMLFormElement)
            .entries())
            .reduce((acc, curr) => ({...acc, [curr[0]]: curr[1]}), {});
        const data: IPost = {
            ...post,
            ...formData,
            file: post?.file || `${slugify(formData.title as string)}-${new Date().getTime()}.md`,
            content: editor.current?.getMarkdown()
        } as IPost

        console.log(formData)

        const weight = new TextEncoder().encode(formatPost(data)).length;
        setWeight(weight + parseInt(formData["cover-weight"] as string, 10));
        calculateImageWeight();
    }, [calculateImageWeight, post]);


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
            content: editor.current?.getMarkdown(),
            updatedAt: new Date(),
            createdAt: post?.createdAt || new Date(),
            weight,
            draft: (formData.draft as unknown as string) === "on" ? true : false,
        } as IPost;
        setProcessing(true);
        setError(undefined);
        setSuccess(undefined);
        try {
            const result = await editPost(data);
            if(result) setSuccess(__('success'));
            else setSuccess(__('queued'));
        } catch (e) {
            const appError = e as AppError;
            if(appError.code === EDIT_POST_DENY || appError.code === EDIT_POST_FAIL || appError.code === EDIT_POST_FALSE) setError(appError);
            else throw e;
        } finally {
            setProcessing(false);
        }
    }, [__, blank, blog, editPost, post, weight]);


    if(!post && !blank || !media) {
        return (
            <div className='p-4 grow flex items-center justify-center'>
                <Loader />
            </div>
        )
    }

    return (
        <>
            <form className="grow mt-5 flex flex-col gap-4" onSubmit={onSubmit} onChange={onChange} onKeyUp={onChange}>
                <div className='px-5 flex flex-col gap-4'>
                    <div className='flex gap-3'>
                        <div className='grow flex flex-col justify-between gap-5'>
                            <TextInput required name="title" label={__('title')} defaultValue={post?.title} />
                            <TextInput required name="description" label={__('description')} defaultValue={post?.description} />
                        </div>
                        <MediaInput className='w-min' name="cover" label={__('cover')} defaultValue={post?.cover}>
                            <T>cover</T>
                        </MediaInput>
                    </div>
                </div>
                <div ref={editorWrapper}>
                    <MDXEditor 
                        className={`${editorCSS} grow border-solid border-0 border-t-2 border-b-2  border-grey-100 bg-white text-[22px] leading-[135%] px-5`}
                        contentEditableClassName='min-h-[450px] max-w-[800px] mx-auto'
                        markdown={post?.content as string || ""} 
                        ref={editor}
                        plugins={[
                            headingsPlugin(),
                            listsPlugin(),
                            linkPlugin(),
                            quotePlugin(),
                            markdownShortcutPlugin(),
                            linkDialogPlugin(),
                            imagePlugin(),
                            toolbarPlugin({
                                toolbarContents: () => (
                                    <>
                                        <UndoRedo />
                                        <BlockTypeSelect />
                                        <BoldItalicUnderlineToggles />
                                        <CreateLink />
                                        <ImageUploader onPick={calculateImageWeight} />
                                        <HTMLAdd />
                                    </>
                                )
                            }),
                        ]} 
                    />
                </div>
                <div className='flex justify-between items-center px-5 pb-5'>
                    {
                        !blank ? (
                            <Button disabled={!online} className='hover:bg-red-500' size={50} variant="light" onClick={() => setShouldDelete(true)}>
                                <IconTrash /> <T>delete</T>
                            </Button>
                        ) : (
                            <span className='opacity-0'></span>
                        )
                    }
                    <div className='flex flex-col gap-2'>
                        <div>
                            {
                                online ? <T weight={calculateWeight(weight + imageWeight)}>for-reader</T> : <T weight={calculateWeight(weight)}>for-reader-offline</T>
                            }
                        </div>    
                        <div className='flex gap-3 items-start'>
                            <div className='flex items-center'>
                                <Button disabled className='w-0 invisible' size={50}><IconBook2 /> Publier</Button>
                                <Checkbox name="draft" checked={draft} onChange={() => setDraft(!draft)}  ><T>draft</T></Checkbox>
                            </div>
                            <ButtonProcess className='w-[200px]' size={50} htmlType='submit' processing={processing} error={error} success={success}>
                                {
                                    draft ? (
                                        <>
                                            <IconDeviceFloppy /> <T>save</T>
                                        </>
                                    ) : (
                                        <>
                                            <IconBookUpload /> <T>publish</T>
                                        </>
                                    )
                                }
                            </ButtonProcess>
                        </div>
                    </div>

                </div>
            </form>
            {
                shouldDelete && <DeleteModal post={post as IPost} onCancel={() => setShouldDelete(false)} />
            }
        </>
    )
}

export default Post;
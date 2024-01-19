import { TextInput, useTranslations } from '@bdxtown/canaille';
import {MDXEditor, headingsPlugin, toolbarPlugin, BoldItalicUnderlineToggles, UndoRedo, InsertImage, linkDialogPlugin, CreateLink, imagePlugin  } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css'
import fr from './Post.fr-FR.i18n.json';

export const Location = {
    path: '/post/:file',
}

export const Post = () => {
    const { __ } = useTranslations('Post', {'fr-FR': fr});
    return (
        <form className="p-5 flex flex-col gap-4">
            <TextInput label={__('title')} />
            <TextInput label={__('description')} />
            <MDXEditor markdown={'# Hello World'} plugins={[
                linkDialogPlugin(),
                imagePlugin(),
                headingsPlugin(),
                toolbarPlugin({
                    toolbarContents: () => (
                      <>
                        {' '}
                        <UndoRedo />
                        <BoldItalicUnderlineToggles />
                        <CreateLink />
                        <InsertImage />
                      </>
                    )
                })
          
            ]} />
        </form>
    )
}
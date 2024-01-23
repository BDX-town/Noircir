import React from 'react';
import { rootEditor$, $createImageNode } from '@mdxeditor/editor';
import { useCellValue } from '@mdxeditor/gurx';
import { $insertNodes } from 'lexical';

import { MediaSelectionModal } from './MediaSelectionModal';

import { IconPhoto } from '@tabler/icons-react';

import { Media } from '../types/Media';

export const ImageUploader = () => {
    // access the viewMode node value
    const editor = useCellValue(rootEditor$);
    const [modal, setModal] = React.useState(false);
  
    const onPick = React.useCallback((media: Media, alt: string) => {
      editor?.update(() => {
        const node = $createImageNode({ src: media.url, altText: alt});
        $insertNodes([node]);
      })
      setModal(false);
    }, [editor]);

    return (
      <>
        <button className='bg-transparent border-none opacity-60 hover:bg-gray-300 rounded' onClick={() => setModal(true)}><IconPhoto /></button>
        {
          modal && <MediaSelectionModal onPick={onPick} onCancel={() => setModal(false)}/>
        }
      </>
    )
}
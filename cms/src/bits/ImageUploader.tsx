import React from 'react';
import { rootEditor$, $createImageNode } from '@mdxeditor/editor';
import { useCellValue } from '@mdxeditor/gurx';
import { $insertNodes } from 'lexical';

import { MediaSelectionModal } from './MediaSelectionModal';

import { IconPhoto } from '@tabler/icons-react';

import { Media } from '../types/Media';

export const ImageUploader = ({ onPick }: { onPick?: (m: Media) => void }) => {
    // access the viewMode node value
    const editor = useCellValue(rootEditor$);
    const [modal, setModal] = React.useState(false);
  
    const onInternalPick = React.useCallback((media: Media, alt: string) => {
      editor?.update(() => {
        const node = $createImageNode({ src: media.url, altText: alt});
        $insertNodes([node]);
      })
      setModal(false);
      if(onPick) onPick(media);
    }, [editor, onPick]);

    return (
      <>
        <button type="button" className='bg-transparent border-none opacity-60 hover:bg-gray-300 rounded' onClick={() => setModal(true)}><IconPhoto /></button>
        {
          modal && <MediaSelectionModal onPick={onInternalPick} onCancel={() => setModal(false)}/>
        }
      </>
    )
}
import { useCallback, useState } from 'react';
import { rootEditor$, $createGenericHTMLNode } from '@mdxeditor/editor';
import { useCellValue } from '@mdxeditor/gurx';
import { $insertNodes } from 'lexical';


import { IconCode } from '@tabler/icons-react';
import { Modal } from './Modal';
import { Button, TextInput } from '@bdxtown/canaille';


export const HTMLAdd = () => {
    // access the viewMode node value
    const editor = useCellValue(rootEditor$);
    const [showModal, setShowModal] = useState(false);
  
    const onInsert = useCallback(() => {
      editor?.update(() => {
        const node = $createGenericHTMLNode("iframe", "mdxJsxFlowElement", [{name: "style", type: "mdxJsxAttribute", value: "border-radius:12px"}, {name: "src", type: "mdxJsxAttribute", value: "https://open.spotify.com/embed/track/0hV6HHEtcDVUxiZPuI050H?utm_source=generator"}] );//  src: "", width:"100%", height:"80", frameBorder: "0"} )
        $insertNodes([node]);
      })
    }, [editor]);

    const onClick = useCallback(() => {
        setShowModal(true);
    }, [])

    return (
      <>
        <button type="button" className='bg-transparent border-none opacity-60 hover:bg-gray-300 rounded' onClick={onClick}><IconCode /></button>
        {
            showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <textarea className='w-[300px] h-[100px]' />
                    <div className='text-right mt-2 d-flex justify-content-between'>
                        <Button className='hover:bg-red-500' variant='light' size={50} onClick={onInsert}>Annuler</Button>
                        <Button size={50} onClick={onInsert}>Insérer</Button>
                    </div>
                </Modal>
            )
        }
      </>
    )
}
import { FormEventHandler, useCallback, useState } from 'react';
import { rootEditor$, $createGenericHTMLNode } from '@mdxeditor/editor';
import { useCellValue } from '@mdxeditor/gurx';
import { $insertNodes } from 'lexical';


import { IconCode } from '@tabler/icons-react';
import { Modal } from './Modal';
import { Button, useTranslations } from '@bdxtown/canaille';

import fr from './HTMLAdd.fr-FR.i18n.json';

const tr = {
  "fr-FR": fr,
}


export const HTMLAdd = () => {
    const { T } = useTranslations("HTMLAdd", tr);
    // access the viewMode node value
    const editor = useCellValue(rootEditor$);
    const [showModal, setShowModal] = useState(false);
  
    const onSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      const data = new FormData(e.currentTarget);
      const code = data.get("code") as string;

      const parent = document.createElement("div");
      parent.innerHTML = code;
      const node = parent.firstElementChild as Element;
      if(!node) return;

      editor?.update(() => {
        const vnode = $createGenericHTMLNode(node.tagName.toLowerCase() as never, "mdxJsxFlowElement", Array.from(node.attributes).map((a) => ({ name: a.name, value: a.value, type: "mdxJsxAttribute" })));
        $insertNodes([vnode]);
      })
      setShowModal(false);
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
                  <form onSubmit={onSubmit}>
                    <div className='text-left text-lg font-semibold'><T>title</T></div>
                    <div className='text-sm'><T>description</T></div>
                    <textarea autoFocus name="code" className='my-3 w-full min-w-[300px] h-[100px]' />
                    <div className='text-right mt-2 flex justify-between'>
                        <Button className='hover:bg-red-500' variant='light' size={50} onClick={() => setShowModal(false)}><T>cancel</T></Button>
                        <Button size={50} htmlType='submit'><T>insert</T></Button>
                    </div>
                  </form>

                </Modal>
            )
        }
      </>
    )
}
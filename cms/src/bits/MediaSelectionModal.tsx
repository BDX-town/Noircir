import React from 'react';
import fr from './MediaSelectionModal.fr-FR.i18n.json';

import { useAppContext } from '../data/AppContext';
import { useTranslations, Block, Button, Radio, TextInput, createUseStyles } from '@bdxtown/canaille';
import { IconPhoto } from '@tabler/icons-react';
import { Modal } from './Modal';
import { Media } from '../types/Media';
import { Location } from '../views/Media';

const useStyle = createUseStyles({
    mediaList: {
      '&:has(input:checked)': {
        '& div:has(input:not(:checked))': {
          opacity: 0.5,
        },
        '& div:has(input:checked)': {
          transform: 'scale(1.05)'
        }
      },
    }
})

export const MediaSelectionModal = ({ onPick, onCancel }: { onPick: (m: Media, alt: string) => void, onCancel: React.MouseEventHandler}) => {
  const { T, __ } = useTranslations('MediaSelectionModal', { 'fr-FR': fr });
  const { mediaList } = useStyle();

  const { media: _media } = useAppContext();

  const media = [..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media, ..._media];

  const onSubmit: React.FormEventHandler = React.useCallback((e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget as HTMLFormElement);
    onPick(media.find((m) => m.file === data.get("media")) as Media, data.get("alt") as string);
  }, [media, onPick]);

  return (
    <Modal className='h-[90%] max-w-[90%]'>
      <form onSubmit={onSubmit} className='flex h-full'>
        <div className='flex flex-col'>
          <Radio name="media" className={`${mediaList} shrink flex flex-wrap gap-2 overflow-y-scroll basis-0 grow justify-center`}>
            {
                media.map((m) => (
                  <label>
                    <Block key={m.url} className={`relative bg-transparent text-center p-0 overflow-hidden flex items-center`}>
                        <Radio.Item className='absolute top-0 left-0 m-2' value={m.file} required />
                        <img className='w-[150px] h-[150px] object-contain' src={m.url} alt={m.file} />
                    </Block>
                  </label>
                ))
            }
          </Radio>
          <div className='p-1 text-left opacity-80'>
            <T here={Location.path}>
              not-found
            </T>
          </div>
        </div>

        <div className='shrink-0 flex flex-col'>
          <div className='grow'>

          </div>
          <div>
            <TextInput name="alt" label={__('alt')} className='mt-3' required />
          </div>
          <div className='flex justify-between items-center mt-3'>
            <Button size={50} variant="secondary" onClick={onCancel}><T>cancel</T></Button>
            <Button size={50} htmlType='submit'><IconPhoto /> <T>pick</T></Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}


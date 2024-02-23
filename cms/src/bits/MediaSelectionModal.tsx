import React from 'react';
import fr from './MediaSelectionModal.fr-FR.i18n.json';

import { useAppContext } from '../data/AppContext';
import { useTranslations, Block, Button, Radio, TextInput, createUseStyles } from '@bdxtown/canaille';
import { IconPhoto, IconPhotoHexagon } from '@tabler/icons-react';
import { Modal } from './Modal';
import { Media } from '../types/Media';
import { weight } from '../helpers/weight';
import { ButtonUpload } from './ButtonUpload';

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
  const [selectedMedia, setSelectedMedia] = React.useState<Media | undefined>(undefined);

  const { media } = useAppContext();


  const onChange: React.FormEventHandler = React.useCallback((e) => {
    const data = new FormData(e.currentTarget as HTMLFormElement);
    setSelectedMedia(
      media.find((m) => m.file === data.get("media"))
    )
  }, [media]);

  const onSubmit: React.FormEventHandler = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const data = new FormData(e.currentTarget as HTMLFormElement);
    onPick(media.find((m) => m.file === data.get("media")) as Media, data.get("alt") as string);
  }, [media, onPick]);

  return (
    <Modal className='h-[90%] max-w-[90%] w-full' onClose={onCancel as () => void}>
      <form onSubmit={onSubmit} onChange={onChange} className='flex h-full'>
        <div className='flex flex-col grow'>
          <Radio name="media" className={`${mediaList} shrink flex flex-wrap gap-2 overflow-y-scroll`}>
            {
                media.map((m) => (
                  <label key={m.url}>
                    <Block  className={`relative bg-transparent text-center p-0 overflow-hidden flex items-center`}>
                        <Radio.Item className='absolute top-0 left-0 m-2' value={m.file} required />
                        <img className='w-[150px] h-[150px] object-contain' src={m.url} alt={m.file} />
                    </Block>
                  </label>
                ))
            }
          </Radio>
          <div className='grow'></div>
          <div className='p-1 text-left opacity-80'>
            <ButtonUpload><T>not-found</T></ButtonUpload>
          </div>
        </div>

        <div className='shrink-0 w-[260px] flex flex-col h-full'>
          <div className='grow shrink w-full flex flex-col justify-center items-center basis-0 min-h-0'>
            {
              selectedMedia ? (
                <img className='w-full max-h-full object-contain' src={selectedMedia.url} alt={selectedMedia.file} />
              ) : (
                <>
                  <IconPhotoHexagon className='text-gray-400 mb-3' size={50} />
                  <T>select</T>
                </>
              )
            }
          </div>
          <div className='text-right'>
            <div className='mb-4'>
              {
                selectedMedia && (
                  <>
                    <div className='font-semibold text-sm'><T>file-weight</T></div> 
                    {weight(selectedMedia.weight)}
                  </>
                )
              }
    
            </div>
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


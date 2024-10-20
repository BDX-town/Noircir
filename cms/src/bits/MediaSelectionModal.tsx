import React from 'react';
import fr from './MediaSelectionModal.fr-FR.i18n.json';

import { useAppContext } from '../data/AppContext';
import { useTranslations, Block, Button, Radio, TextInput, createUseStyles } from '@bdxtown/canaille';
import { IconArrowBack, IconPhoto, IconPhotoHexagon } from '@tabler/icons-react';
import { Modal } from './Modal';
import { Media } from 'types/src/Media';
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

export const MediaSelectionModal = ({ onPick, onCancel }: { onPick: (m: Media, alt: string) => void, onCancel: React.MouseEventHandler }) => {
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
      <form onSubmit={onSubmit} onChange={onChange} className='flex h-full relative z-0'>
        <div className='absolute left-0 bottom-0 z-10'>
            <ButtonUpload><T>not-found</T></ButtonUpload>
        </div>
        <Block className='w-[340px] h-[400px] p-0 flex flex-col absolute bottom-0 right-0 z-10 bg-additional-primary overflow-hidden'>
          <div className='grow shrink-0 w-full flex flex-col justify-center items-center basis-0 min-h-0 bg-brand-primary-light border-solid border-b-2 border-t-0 border-l-0 border-grey-600'>
            {
              selectedMedia ? (
                <img className='w-full max-h-full object-contain  ' src={selectedMedia.url} alt={selectedMedia.file} />
              ) : (
                <>
                  <IconPhotoHexagon className='text-gray-400 mb-3' size={50} />
                  <T>select</T>
                </>
              )
            }
          </div>
          <div className='p-2'>
            <div className='text-right'>
              <div className='my-2'>
                {
                  selectedMedia && (
                    <>
                      {weight(selectedMedia.weight)}
                    </>
                  )
                }

              </div>
              <TextInput name="alt" label={__('alt')} className='mt-3' required />
            </div>
            <div className='flex justify-between items-center mt-3'>
              <Button size={50} variant="secondary" onClick={onCancel}><IconArrowBack /> <T>cancel</T></Button>
              <Button size={50} htmlType='submit'><IconPhoto /> <T>pick</T></Button>
            </div>
          </div>
        </Block>
        <div className='flex flex-col grow'>
          <Radio name="media" className={`${mediaList} shrink flex flex-wrap gap-2 pb-[400px] overflow-y-scroll`}>
            {
              media.map((m) => (
                <label key={m.url}>
                  <Block className={`relative bg-transparent text-center p-0 overflow-hidden flex items-center`}>
                    <Radio.Item className='absolute top-0 left-0 m-2' value={m.file} required />
                    <img className='w-[150px] h-[150px] object-contain' src={m.url} alt={m.file} />
                  </Block>
                </label>
              ))
            }
          </Radio>
        </div>

      </form>
    </Modal>
  );
}


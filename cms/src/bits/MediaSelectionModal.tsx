import React from 'react';
import fr from './MediaSelectionModal.fr-FR.i18n.json';

import { useAppContext } from '../data/AppContext';
import { useTranslations, Block, Button, Radio, TextInput } from '@bdxtown/canaille';
import { Modal } from './Modal';
import { Media } from '../types/Media';

export const MediaSelectionModal = ({ onPick, onCancel }: { onPick: (m: Media, alt: string) => void, onCancel: React.MouseEventHandler}) => {
  const { T, __ } = useTranslations('MediaSelectionModal', { 'fr-FR': fr });

  const { media } = useAppContext();

  const onSubmit: React.FormEventHandler = React.useCallback((e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget as HTMLFormElement);
    onPick(media.find((m) => m.file === data.get("media")) as Media, data.get("alt") as string);
  }, [media, onPick]);

  return (
    <Modal>
      <form onSubmit={onSubmit}>
        <div className='flex gap-3 grow'>
          <Radio name="media">
            {
                media.map((m) => (
                    <Block key={m.url} className='relative h-[150px] w-[150px] bg-transparent text-center p-0 overflow-hidden'>
                        <label>
                            <Radio.Item className='absolute top-0 left-0 m-2' value={m.file} required />
                            <img className='h-full' src={m.url} alt={m.file} />
                        </label>
                    </Block>
                ))
            }
          </Radio>
        </div>
        <div>
          <TextInput name="alt" label={__('alt')} className='mt-3' required />
        </div>
        <div className='flex justify-between items-center mt-3'>
          <Button size={50} variant="secondary" onClick={onCancel}><T>cancel</T></Button>
          <Button size={50} htmlType='submit'><T>pick</T></Button>
        </div>
      </form>
    </Modal>
  );
}


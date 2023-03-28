import { type FC } from 'react';
import { ModalClose, Title } from '@/components';

interface ModalHeaderProps {
  close: () => void;
  title: string;
}

const ModalHeader: FC<ModalHeaderProps> = ({ close, title }) => {
  return (
    <section className='space-y-2  border-b border-orange  px-4'>
      <ModalClose close={close} />

      <div className='flex items-center gap-2 px-3'>
        <div className='h-5 w-5 rounded-full bg-orange' />
        <Title title={title} titleStyles='text-gray-900 tracking-wider' />
      </div>

      <div className='h-[0.3rem] w-full rounded-t-full bg-orange' />
    </section>
  );
};

export default ModalHeader;

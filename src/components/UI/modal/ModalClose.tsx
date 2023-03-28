import { type FC } from 'react';
import { Icon } from '@/components';
import { HiXMark } from 'react-icons/hi2';

interface ModalCloseProps {
  close: () => void;
}

const WidgetClose: FC<ModalCloseProps> = ({ close }) => {
  return (
    <Icon
      icon={<HiXMark className={`h-5 w-5`} />}
      purpose={close}
      iconWrapperStyles='p-1 w-fit h-fit  rounded-full flex justify-center items-center z-50 bg-red-300 hover:bg-red-500'
    />
  );
};

export default WidgetClose;

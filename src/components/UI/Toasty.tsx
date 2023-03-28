import { Toast } from 'react-hot-toast';
import { FC } from 'react';

interface ToastyProps {
  t: Toast;
  title: string;
  toastWrapperStyles: string;
}

const Toasty: FC<ToastyProps> = ({ t, title, toastWrapperStyles }) => {
  return (
    <section
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } ${toastWrapperStyles}`}
    >
      <span className='text-sm'>{title}</span>
    </section>
  );
};

export default Toasty;

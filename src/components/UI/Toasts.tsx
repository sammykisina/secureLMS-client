import toast from 'react-hot-toast';
import { Toasty } from '@/components';

const Toasts = {
  errorToast: (title: string) => getToasted(title, 'text-red-500'),
  successToast: (title: string) => getToasted(title, 'text-green-500'),
};

export default Toasts;

const getToasted = (title: string, toastColor: string) => {
  toast.custom(
    (t) => (
      <Toasty
        t={t}
        title={title}
        toastWrapperStyles={`bg-white border shadow-md px-4 py-2 rounded-full ${toastColor}`}
      />
    ),
    {
      position: 'top-right',
    }
  );
};

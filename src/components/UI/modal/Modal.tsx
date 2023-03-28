import type { FC, ReactNode } from 'react';

interface ModalProps {
  modalState: boolean;
  modalStyles: string;
  component: ReactNode;
}

const Modal: FC<ModalProps> = ({ modalState, modalStyles, component }) => {
  return (
    <section
      className={`${modalState ? 'modalWrapper show ' : 'modalWrapper'} `}
    >
      <div className={`modal ${modalStyles} flex flex-col gap-y-4 py-5`}>
        {component}
      </div>
    </section>
  );
};

export default Modal;

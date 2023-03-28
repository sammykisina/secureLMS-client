import { ReactNode, FC } from 'react';

interface IconProps {
  icon: ReactNode;
  iconWrapperStyles?: string;
  purpose?: () => void;
}

const Icon: FC<IconProps> = ({ icon, iconWrapperStyles, purpose }) => {
  return (
    <div className={`${iconWrapperStyles} cursor-pointer`} onClick={purpose}>
      {icon}
    </div>
  );
};

export default Icon;

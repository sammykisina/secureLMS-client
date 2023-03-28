import { type FC, type ReactNode, useRef, type Dispatch } from 'react';
import { Icon } from '@/components';
import { useClickOutside } from '@/hooks';

interface DropdownProps {
  active?: ReactNode;
  inactive: ReactNode;
  dropdownComponent: ReactNode;
  displayState: boolean;
  setDisplayState: Dispatch<React.SetStateAction<boolean>>;
  badge?: number;
}

const Dropdown: FC<DropdownProps> = ({
  active,
  inactive,
  dropdownComponent,
  displayState,
  setDisplayState,
  badge,
}) => {
  /**
   * component states
   */
  const dropdownComponentRef = useRef<HTMLDivElement>(null);

  /**
   * component functions
   */
  useClickOutside(dropdownComponentRef, () => setDisplayState(false));

  return (
    <div className='relative' ref={dropdownComponentRef}>
      <div className='group'>
        <Icon
          icon={displayState ? active : inactive}
          iconWrapperStyles={`z-30 p-2 rounded-full relative ${
            displayState ? 'text-callToAction' : 'text-textColor/50'
          }`}
          purpose={() => setDisplayState((prev) => !prev)}
        />

        {badge
          ? badge > 0 && (
              <div className='absolute top-[0.5rem] right-[0.5rem] z-30 h-2 w-2 items-center justify-center rounded-full bg-red-500 text-sm duration-300' />
            )
          : ''}
      </div>

      <div
        className={` ${
          displayState ? 'dropdownContent active z-50' : 'dropdownContent'
        }`}
      >
        {dropdownComponent}
      </div>
    </div>
  );
};

export default Dropdown;

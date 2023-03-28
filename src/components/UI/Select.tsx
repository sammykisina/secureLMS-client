import { useClickOutside } from '@/hooks';
import { type FC, useRef, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { HiXMark } from 'react-icons/hi2';
import { Icon } from '@/components';

type SelectionOption = {
  name: string;
  value: string;
};

interface SelectProps {
  selected: any;
  setSelected: any;
  title?: string;
  selectWrapperStyles: string;
  options: SelectionOption[] | string[];
  multiple: boolean;
  selectPanelStyles: string;
  disable?: boolean;
}

const Select: FC<SelectProps> = ({
  selected,
  title,
  setSelected,
  options,
  multiple,
  selectWrapperStyles,
  selectPanelStyles,
  disable,
}) => {
  /**
   * component states
   */
  const [isSelectPanelOpen, setIsSelectPanelOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  /**
   * component functions
   */
  const selectOption = (option: SelectionOption | string) => {
    if (multiple) {
      checkIfOptionIsInSelectedArray(option)
        ? setSelected(
            selected.filter((selectedOption: SelectionOption | string) =>
              typeof option === 'object' && typeof selectedOption === 'object'
                ? selectedOption?.name.toLowerCase() !==
                  option.name.toLowerCase()
                : (selectedOption as string).toLowerCase() !==
                  (option as string).toLowerCase()
            )
          )
        : setSelected([...selected, option]);
    } else {
      // If The Selected Is Not Equal To The Currently Clicked Option
      if (option !== selected) setSelected(option);
    }
  };

  const getActiveOptionClass = (option: SelectionOption | string) => {
    let activeOptionStyles = '';

    if (Array.isArray(selected)) {
      checkIfOptionIsInSelectedArray(option)
        ? (activeOptionStyles = 'bg-callToAction/10')
        : '';
    } else {
      typeof option === 'object'
        ? option?.name.toLowerCase() === selected.name.toLowerCase()
          ? (activeOptionStyles = 'bg-callToAction/10')
          : ''
        : option.toLowerCase() === selected.toLowerCase()
        ? (activeOptionStyles = 'bg-callToAction/10')
        : '';
    }

    return activeOptionStyles;
  };

  const checkIfOptionIsInSelectedArray = (option: SelectionOption | string) => {
    let value: SelectionOption | string | null = null;

    selected.find((selectedOption: SelectionOption | string) => {
      if (typeof option === 'object' && typeof selectedOption === 'object') {
        selectedOption.name.toLowerCase() === option.name.toLowerCase()
          ? (value = selectedOption)
          : '';
      } else {
        (selectedOption as string).toLowerCase() ===
        (option as string).toLowerCase()
          ? (value = selectedOption)
          : '';
      }
    });

    return value;
  };

  useClickOutside(selectRef, () => setIsSelectPanelOpen(false));

  return (
    <section
      ref={selectRef}
      tabIndex={0}
      className={`relative cursor-pointer gap-[0.5rem]  px-2 outline-none  ${selectWrapperStyles}`}
      onClick={() =>
        setIsSelectPanelOpen(
          (prevIsSelectPanelOpenState) => !prevIsSelectPanelOpenState
        )
      }
    >
      {/* selected */}
      <div className='flex items-center justify-between gap-1'>
        <div className='flex flex-1 gap-1 overflow-x-auto whitespace-nowrap text-sm capitalize text-textColor scrollbar-hide'>
          {selected.length === 0 || !selected
            ? title
            : multiple && Array.isArray(selected)
            ? selected.map((selectedOption, selectedOptionIndex) => (
                <div
                  key={selectedOptionIndex}
                  onClick={(event) => {
                    event.stopPropagation();
                    selectOption(selectedOption);
                  }}
                  className='flex items-center rounded-full bg-callToAction/10 px-2 py-1 tracking-wider'
                >
                  <Icon icon={<HiXMark className='h-3 w-3' />} />
                  <span className='text-sm'>
                    {typeof selectedOption === 'object'
                      ? selectedOption.name
                      : selectedOption}
                  </span>
                </div>
              ))
            : typeof selected === 'object'
            ? (selected as SelectionOption).name
            : selected}
        </div>

        {/* indicator icon */}
        <span
          className={`flex items-center justify-center rounded-full duration-300  hover:bg-callToAction hover:text-white ${
            isSelectPanelOpen &&
            'rotate-180 rounded-full  bg-callToAction text-white'
          }  ${disable && 'hidden'}`}
        >
          <HiChevronDown className='h-4 w-4' />
        </span>
      </div>

      {/* items */}
      <ul
        className={`absolute left-0 top-[calc(100%+.25rem)] z-50 flex h-fit  w-full  flex-col
         gap-2 overflow-y-auto rounded-md p-[5px]  text-sm
         ${selectPanelStyles} ${isSelectPanelOpen ? 'block' : 'hidden'} ${
          disable && 'hidden'
        }`}
      >
        {options?.map((option, option_index) => (
          <li
            onClick={(event) => {
              event.stopPropagation();
              selectOption(option);
              setIsSelectPanelOpen(false);
            }}
            key={option_index}
            className={`w-fit rounded-full px-2 py-1  capitalize  hover:bg-callToAction/10  hover:font-normal hover:text-textColor ${getActiveOptionClass(
              option || ''
            )}`}
          >
            {typeof option === 'object' ? option.name : option}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Select;

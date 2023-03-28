import React, { useState, useEffect } from 'react';
import { Icon } from '@/components';
import { RiSearch2Line } from 'react-icons/ri';
import { useDebounceValue } from '@/hooks';

const GlobalFilter = ({
  value: initialValue,
  onChange,
  count,
  debounce = 2000,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  count: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  /**
   * component states
   */
  const [key, setKey] = useState<string | number>(initialValue);

  /**
   * component functions
   */
  const debounceValue = useDebounceValue(key, 200);

  useEffect(() => {
    setKey(initialValue);
  }, [initialValue]);

  useEffect(() => {
    onChange(debounceValue);
  }, [debounceValue]);

  return (
    <label className='flex items-baseline gap-x-2'>
      <div className='flex w-[200px] items-center  rounded-xl bg-secondary px-3'>
        <Icon
          icon={<RiSearch2Line className='icon' />}
          iconWrapperStyles='text-textColor/20'
        />
        <input
          type='text'
          {...props}
          value={key}
          onChange={(event) => setKey(event.target.value)}
          placeholder={`${count} records`}
          className='w-full bg-transparent px-1 py-2 text-textColor outline-none'
        />
      </div>
    </label>
  );
};

export default GlobalFilter;

import { useState } from 'react';
import { Courses, Lecturers, Tab, Units } from '@/components';
import {
  HiOutlineDocumentDuplicate,
  HiOutlineSquares2X2,
  HiOutlineUsers,
} from 'react-icons/hi2';

const School = () => {
  /**
   * pages states
   */
  const [index, setIndex] = useState(0);
  const schoolTabs = [
    {
      label: 'Courses',
      content: <Courses />,
      icon: <HiOutlineSquares2X2 className='icon' />,
    },
    {
      label: 'Units',
      content: <Units />,
      icon: <HiOutlineDocumentDuplicate className='icon' />,
    },
    {
      label: 'Lecturers',
      content: <Lecturers />,
      icon: <HiOutlineUsers className='icon' />,
    },
  ];

  return (
    <section className='h-full'>
      <Tab
        tabsData={schoolTabs}
        tabsBodyStyles='lg:grid grid-cols-6 duration-300'
        index={index}
        iconsOnlyTabs
        setIndex={setIndex}
        iconsOnlyTabsStyles='flex flex-row  flex-wrap duration-300 lg:flex-col gap-2 col-span-1 text-indigo-500'
        tabsContentHeight='mt-[1rem] py-2 lg:mt-0 scrollbar-hide '
      />
    </section>
  );
};

export default School;

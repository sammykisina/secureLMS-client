import {
  HiUserGroup,
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiAcademicCap,
  HiOutlineChatBubbleLeftRight,
  HiChatBubbleLeftRight,
  HiOutlineBookmark,
  HiBookmark,
  HiDocumentArrowUp,
  HiOutlineDocumentArrowUp,
  HiOutlineUserCircle,
  HiUserCircle,
} from 'react-icons/hi2';

const adminRoutes = [
  {
    name: 'School',
    inactiveIcon: <HiOutlineAcademicCap className='icon' />,
    activeIcon: <HiAcademicCap className='icon' />,
    to: '/',
  },
  {
    name: 'Students',
    inactiveIcon: <HiOutlineUserGroup className='icon' />,
    activeIcon: <HiUserGroup className='icon' />,
    to: '/students',
  },
];

const lecturerRoutes = [
  {
    name: 'Tasks',
    inactiveIcon: <HiOutlineBookmark className='icon' />,
    activeIcon: <HiBookmark className='icon' />,
    to: '/',
  },
  {
    name: 'Ranking',
    inactiveIcon: <HiOutlineDocumentArrowUp className='icon' />,
    activeIcon: <HiDocumentArrowUp className='icon' />,
    to: '/ranking',
  },
  {
    name: 'Messenger',
    inactiveIcon: <HiOutlineChatBubbleLeftRight className='icon' />,
    activeIcon: <HiChatBubbleLeftRight className='icon' />,
    to: '/messenger',
  },
  {
    name: 'Profile',
    inactiveIcon: <HiOutlineUserCircle className='icon' />,
    activeIcon: <HiUserCircle className='icon' />,
    to: '/profile',
  },
];

const studentRoutes = [
  {
    name: 'Tasks',
    inactiveIcon: <HiOutlineBookmark className='icon' />,
    activeIcon: <HiBookmark className='icon' />,
    to: '/',
  },
  {
    name: 'Results',
    inactiveIcon: <HiOutlineDocumentArrowUp className='icon' />,
    activeIcon: <HiDocumentArrowUp className='icon' />,
    to: '/results',
  },
  {
    name: 'Messenger',
    inactiveIcon: <HiOutlineChatBubbleLeftRight className='icon' />,
    activeIcon: <HiChatBubbleLeftRight className='icon' />,
    to: '/messenger',
  },
  {
    name: 'Profile',
    inactiveIcon: <HiOutlineUserCircle className='icon' />,
    activeIcon: <HiUserCircle className='icon' />,
    to: '/profile',
  },
];

const routes = { adminRoutes, lecturerRoutes, studentRoutes };

export default routes;

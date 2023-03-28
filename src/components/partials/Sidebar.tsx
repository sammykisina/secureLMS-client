import React, { useRef } from 'react';
import { HiChevronLeft } from 'react-icons/hi';
import { FiLogOut } from 'react-icons/fi';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Button, Icon, Logo, Link } from '@/components';
import { appAtoms } from '@/atoms';
import { useAuth, useClickOutside } from '@/hooks';
import { routers } from '@/routers';
import { useLocation } from 'react-router-dom';
import { Route } from '../../types/typings.t';

const Sidebar = () => {
  /**
   * component states
   */
  const sidebarComponentRef = useRef(null);
  const { isSidebarOpenState, showSidebarState } = appAtoms;
  const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(isSidebarOpenState);
  const setShowSidebar = useSetRecoilState(showSidebarState);
  const { logout, user } = useAuth();
  const { pathname } = useLocation();
  const { adminRoutes, lecturerRoutes, studentRoutes } = routers;
  const routes: Route[] =
    user?.role === 'admin'
      ? adminRoutes
      : user?.role === 'lecturer'
      ? lecturerRoutes
      : user?.role === 'student'
      ? studentRoutes
      : [];

  /**
   * component functions
   */
  useClickOutside(sidebarComponentRef, () => setShowSidebar(false));

  return (
    <aside
      ref={sidebarComponentRef}
      className={`${
        isSidebarOpen ? 'w-[200px]' : 'w-24'
      } relative z-40 flex h-screen flex-col justify-between border-r-2 border-secondary bg-primary p-5 pt-8 duration-300 `}
    >
      <Icon
        icon={
          <HiChevronLeft
            className={`h-5 w-5  ${!isSidebarOpen && 'rotate-180'}`}
          />
        }
        iconWrapperStyles='absolute cursor-pointer -right-[14px] top-[38px] w-7 h-7  rounded-full flex justify-center items-center z-50 border-2 border-secondary bg-white text-callToAction'
        purpose={() => {
          setIsSidebarOpen((prevIsSidebarOpenState) => !prevIsSidebarOpenState);
        }}
      />

      <div className='mt-5'>
        {/* logo */}
        <div className='flex justify-center'>
          <Logo
            logoStyles='text-[2rem] text-textColor'
            dotStyles='w-2 h-2 bg-callToAction'
          />
        </div>

        {/* the links */}
        <ul className='flex flex-col gap-2  pt-6'>
          {routes.map((route, routeIndex) => (
            <Link
              key={routeIndex}
              route={route}
              type='medium'
              fullWidth={true}
              active={pathname === route.to && 'navLinkActive'}
              moreActions={() => setShowSidebar(false)}
            />
          ))}
        </ul>
      </div>

      {/* logout button */}

      <Button
        type='button'
        intent='primary'
        fullWidth
        form='large'
        title={<FiLogOut className='icon' />}
        purpose={() => logout()}
      />
    </aside>
  );
};

export default Sidebar;

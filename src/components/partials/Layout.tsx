import { useRecoilValue } from 'recoil';
import { Toaster } from 'react-hot-toast';
import { appAtoms, studentAtoms, taskAtoms } from '@/atoms';
import { AppRouters } from '@/routers';
import {
  Modal,
  Sidebar,
  TakeTask,
  TopHeader,
  TaskQns,
  Widget,
} from '@/components';
import { useAuth } from '@/hooks';
import { Login } from '@/pages';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Layout = () => {
  /**
   * component states
   */
  const auth = useAuth();

  const { isSidebarOpenState, showSidebarState } = appAtoms;
  const showSidebar = useRecoilValue(showSidebarState);
  const isSidebarOpen = useRecoilValue(isSidebarOpenState);

  const { showTaskQnsWidgetState } = taskAtoms;
  const showTaskQnsWidget = useRecoilValue(showTaskQnsWidgetState);

  const { showTakeTaskModalState } = studentAtoms;
  const showTakeTaskModal = useRecoilValue(showTakeTaskModalState);
  const { pathname } = useLocation();

  /**
   * component functions
   */

  //update expire time on any user activity
  useEffect(() => {
    auth.updateExpiredTime();

    window.addEventListener('click', auth.updateExpiredTime);
    window.addEventListener('keypress', auth.updateExpiredTime);
    window.addEventListener('scroll', auth.updateExpiredTime);
    window.addEventListener('mousemove', auth.updateExpiredTime);

    // clean up
    return () => {
      window.removeEventListener('click', auth.updateExpiredTime);
      window.removeEventListener('keypress', auth.updateExpiredTime);
      window.removeEventListener('scroll', auth.updateExpiredTime);
      window.removeEventListener('mousemove', auth.updateExpiredTime);
    };
  }, []);

  //set interval to check for inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      auth.checkForInactivity();
    }, 1800000);

    return () => clearInterval(interval);
  }, []);

  if (
    !auth.token &&
    !(
      pathname === '/auth/verify-two-factory-code' ||
      pathname === '/email' ||
      pathname.endsWith('revoke-logins')
    )
  )
    return <Login />;

  return (
    <section className='relative mx-auto flex w-full max-w-[1200px] sm:px-[20px]'>
      <Toaster />

      {/* sidebar */}
      <div
        className={`absolute duration-300 sm:left-0 ${
          !auth.token && 'hidden'
        }  ${showSidebar ? 'left-0' : '-left-[100%]'}`}
      >
        <Sidebar />
      </div>

      <div
        className={`h-screen max-w-[1200px] flex-1 overflow-x-scroll p-2 duration-300 scrollbar-hide ${
          isSidebarOpen && auth.token
            ? 'sm:ml-[200px]'
            : !auth.token
            ? ''
            : 'sm:ml-24'
        }   `}
      >
        <TopHeader />

        <div className='mt-5 h-[47rem] overflow-y-scroll  scrollbar-hide xs:h-[40rem]'>
          <AppRouters />
        </div>
      </div>

      <Widget
        widgetState={showTaskQnsWidget}
        component={<TaskQns />}
        widgetStyles='w-[90vw] h-fit'
      />

      <Modal
        component={<TakeTask />}
        modalState={showTakeTaskModal}
        modalStyles='w-[90vw] h-fit'
      />
    </section>
  );
};

export default Layout;

import { NavLink } from 'react-router-dom';

const Logo = ({
  logoStyles,
  dotStyles,
}: {
  logoStyles: string;
  dotStyles: string;
}) => {
  return (
    <NavLink
      to='/'
      className={`flex cursor-pointer  items-center gap-1 font-bold  ${logoStyles}`}
    >
      <div className='text-shadow relative  whitespace-nowrap font-semibold leading-tight tracking-wider'>
        LMS
        <div
          className={`absolute  bottom-[0rem] -right-[0.2rem] self-end  rounded-full ${dotStyles}`}
        />
      </div>
    </NavLink>
  );
};

export default Logo;

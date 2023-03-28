import { Button, Link, Logo, SpinnerLoader, Title } from '@/components';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks';

const RevokeLogins = () => {
  /**
   * component states
   */
  const { id } = useParams();
  const auth = useAuth();

  return (
    <section className='mx-auto flex h-[630px]  w-full max-w-[1100px] flex-col items-center  justify-center sm:px-[24px]'>
      {/* logo & into */}
      <div className='mb-5 flex flex-col items-center'>
        <Logo
          logoStyles='text-[3rem] text-textColor'
          dotStyles='w-2 h-2 bg-callToAction'
        />

        <div className='text-lg text-textColor'>SecureLMS</div>
      </div>

      <div className='flex flex-col gap-3 items-center'>
        <Button
          title={
            auth.isRevokingLogins ? (
              <SpinnerLoader color='fill-white' />
            ) : (
              'Revoke All Logins'
            )
          }
          type='button'
          intent='primary'
          purpose={() => auth.revokeLoginsMutateAsync(id!)}
          fullWidth={false}
        />

        <Link
          route={{
            name: 'Login',
            to: '/auth/login',
          }}
        />
      </div>

      {/* Toaster */}
      <Toaster />
    </section>
  );
};

export default RevokeLogins;

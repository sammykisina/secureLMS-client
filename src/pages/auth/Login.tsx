import {
  Logo,
  Title,
  Error,
  Button,
  SpinnerLoader,
  Link,
  Toasts,
  Icon,
} from '@/components';
import { useAuth } from '@/hooks';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { Navigate } from 'react-router-dom';
import { LoginData } from '../../types/typings.t';
import { Toaster } from 'react-hot-toast';
import { appUtils } from '@/utils';
import { useState } from 'react';
import { HiEye, HiEyeSlash, HiOutlineArrowPath } from 'react-icons/hi2';

const Login = () => {
  /**
   * page states
   */
  const { isLogging, token, loginMutateAsync } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();
  const [generatedCapture, setGeneratedCaptcha] = useState(
    appUtils.generateCaptcha()
  );
  const [showPassword, setShowPassword] = useState(false);

  /**
   * page functions
   */
  const onSubmit: SubmitHandler<LoginData> = ({ id, password, captcha }) => {
    if (captcha?.toLowerCase() !== generatedCapture?.toLowerCase()) {
      console.log('captcha', captcha);
      console.log('generated', generatedCapture);

      Toasts.errorToast('Please enter the correct captcha.');
      return;
    }

    loginMutateAsync({ id, password });
  };

  if (token) return <Navigate to='/' replace />;

  return (
    <section className='mx-auto flex h-[630px] w-full max-w-[1100px] flex-col items-center  justify-center sm:px-[24px]'>
      {/* logo & into */}
      <div className='mb-5 flex flex-col items-center'>
        <Logo
          logoStyles='text-[3rem] text-textColor'
          dotStyles='w-2 h-2 bg-callToAction'
        />

        <div className='text-lg text-textColor'>SecureLMS</div>
      </div>

      {/*  into section */}
      <div className='mt-5 w-full px-6  sm:w-3/4 lg:w-1/2'>
        <Title title='Login' titleStyles='text-lg' />

        {/* the login details */}
        <div className='mt-3'>
          <form className='space-y-1 py-2' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-y-5 rounded-md border py-4 px-2'>
              <div className='relative'>
                <input
                  type='number'
                  {...register('id', {
                    required: 'Your ID is required.',
                  })}
                  className='input peer'
                  placeholder='ID'
                />
                <label className='inputLabel'>ID</label>

                {errors['id'] && (
                  <ErrorMessage
                    errors={errors}
                    name='id'
                    render={({ message }) => <Error errorMessage={message} />}
                  />
                )}
              </div>

              <div className='flex items-center gap-2'>
                <div className='relative flex-1'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Enter your password.',
                    })}
                    className='input peer'
                    placeholder='Password'
                  />
                  <label className='inputLabel'>Password</label>

                  {errors['password'] && (
                    <ErrorMessage
                      errors={errors}
                      name='password'
                      render={({ message }) => <Error errorMessage={message} />}
                    />
                  )}
                </div>

                <Icon
                  purpose={() => setShowPassword((prev) => !prev)}
                  icon={
                    showPassword ? (
                      <HiEyeSlash className='text-textColor' />
                    ) : (
                      <HiEye className='text-textColor' />
                    )
                  }
                />
              </div>
            </div>

            <div className='flex flex-col gap-y-5 rounded-md border py-4 px-2'>
              <div className='flex items-center justify-between gap-4'>
                <div className='flex gap-3 items-center border justify-center py-1 rounded-md flex-1'>
                  {generatedCapture.split('').map((char, charIndex) => (
                    <div
                      key={charIndex}
                      className={`${
                        appUtils.generateRotateAngle()?.[charIndex]
                      }`}
                    >
                      {char}
                    </div>
                  ))}
                </div>

                <Icon
                  icon={<HiOutlineArrowPath />}
                  iconWrapperStyles='bg-callToAction p-2 rounded-md text-primary'
                  purpose={() =>
                    setGeneratedCaptcha(appUtils.generateCaptcha())
                  }
                />
              </div>

              <div className='relative'>
                <input
                  type='text'
                  {...register('captcha', {
                    required: 'Enter the captcha.',
                  })}
                  className='input peer'
                  placeholder='Enter Captcha'
                />
                <label className='inputLabel'>Enter Captcha</label>

                {errors['password'] && (
                  <ErrorMessage
                    errors={errors}
                    name='password'
                    render={({ message }) => <Error errorMessage={message} />}
                  />
                )}
              </div>
            </div>

            <Button
              title={isLogging ? <SpinnerLoader color='fill-white' /> : 'Login'}
              type='submit'
              intent='primary'
            />
          </form>
        </div>
      </div>

      <div className='mt-10 flex justify-center flex-col items-center'>
        <Link
          route={{
            to: '/email',
            name: 'Forgot Password?',
          }}
        />
      </div>

      {/* Toaster */}
      <Toaster />
    </section>
  );
};

export default Login;

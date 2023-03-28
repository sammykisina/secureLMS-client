import { Button, Error, Logo, SpinnerLoader, Title } from '@/components';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { ForgotPassword } from '../../types/typings.t';
import { useAuth } from '@/hooks';
import { Toaster } from 'react-hot-toast';

const Email = () => {
  /**
   * component states
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPassword>();
  const auth = useAuth();

  /**
   * component functions
   */
  const onSubmit: SubmitHandler<ForgotPassword> = ({ email }) => {
    auth.sendEmailVerificationCodeMutateAsync({ email });
  };

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
        <Title title='Enter Your Email' titleStyles='text-lg' />

        {/* the login details */}
        <div className='mt-3'>
          <form className='space-y-1 py-2' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-y-5 rounded-md border py-4 px-2'>
              <div className='relative'>
                <input
                  type='email'
                  {...register('email', {
                    required: 'Please enter your account email.',
                  })}
                  className='input peer'
                  placeholder='Email'
                />
                <label className='inputLabel'>Email</label>

                {errors['email'] && (
                  <ErrorMessage
                    errors={errors}
                    name='email'
                    render={({ message }) => <Error errorMessage={message} />}
                  />
                )}
              </div>
            </div>

            <Button
              title={
                auth?.isSendingEmailVerificationCode ? (
                  <SpinnerLoader color='fill-white' />
                ) : (
                  'Send'
                )
              }
              type='submit'
              intent='primary'
            />
          </form>
        </div>
      </div>

      {/* Toaster */}
      <Toaster />
    </section>
  );
};

export default Email;

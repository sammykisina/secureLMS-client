import { Button, Error, Logo, SpinnerLoader, Title } from '@/components';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { CodeVerification } from '../../types/typings.t';
import { useAuth } from '@/hooks';
import { Toaster } from 'react-hot-toast';
import { useRecoilValue } from 'recoil';
import { authAtoms } from '@/atoms';

const VerifyTwoFactorCode = () => {
  /**
   * component states
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CodeVerification>();
  const { isVerifyingCode, verifyCodeMutateAsync, user } = useAuth();
  const forgotPassword = useRecoilValue(authAtoms.forgotPasswordState);

  /**
   * component functions
   */
  const onSubmit: SubmitHandler<CodeVerification> = ({ twoFactorCode }) => {
    verifyCodeMutateAsync({
      userId: user?.id!,
      twoFactorCode,
      forgotPassword: forgotPassword,
    });
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
        <Title title='Two Factor Authentication.' titleStyles='text-lg' />

        {/* the login details */}
        <div className='mt-3'>
          <form className='space-y-1 py-2' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-y-5 rounded-md border py-4 px-2'>
              <div className='relative'>
                <input
                  type='number'
                  {...register('twoFactorCode', {
                    required: 'Please enter the code send via email.',
                  })}
                  className='input peer'
                  placeholder='Code'
                />
                <label className='inputLabel'>Code</label>

                {errors['twoFactorCode'] && (
                  <ErrorMessage
                    errors={errors}
                    name='twoFactorCode'
                    render={({ message }) => <Error errorMessage={message} />}
                  />
                )}
              </div>
            </div>

            <Button
              title={
                isVerifyingCode ? (
                  <SpinnerLoader color='fill-white' />
                ) : (
                  'Verify'
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

export default VerifyTwoFactorCode;

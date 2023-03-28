import {
  Button,
  Error,
  Icon,
  SpinnerLoader,
  TabTitle,
  Title,
  Toasts,
} from '@/components';
import { useAuth } from '@/hooks';
import { format } from 'date-fns';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { PasswordUpdate } from '../../types/typings.t';
import { useState } from 'react';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';

const Profile = () => {
  /**
   * component states
   */
  const auth = useAuth();
  const profile =
    auth?.user?.role === 'student'
      ? auth?.studentProfile
      : auth?.lecturerProfile;
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<PasswordUpdate>({
    mode: 'onTouched',
  });
  const password = watch('password');

  /**
   * component functions
   */
  const onSubmit: SubmitHandler<PasswordUpdate> = async ({ password }) => {
    await auth?.updatePasswordMutateAsync({
      email: auth?.user?.email || '',
      password: password,
    });

    reset({
      password: '',
      confirmPassword: '',
    });

    setShowPassword(false);
  };

  return (
    <section className='flex flex-col h-full xs:h-[40rem] lg:h-[39rem] border rounded-[2rem] p-3'>
      <div className='flex justify-center items-center flex-col gap-2'>
        <div className='flex flex-col gap-5 w-full md:w-[30rem] lg:w-[35rem] border p-2 rounded-[1rem] divide-y'>
          {/* title */}
          <TabTitle title='General Information.' />

          <div className='p-2'>
            <div className='flex flex-col relative'>
              <span className='whitespace-nowrap'>
                {profile?.attributes?.name}
              </span>
              <span>{profile?.attributes?.email}</span>

              {profile && (
                <span className='rounded-full bg-callToAction/10 w-fit px-3 py-1 text-base flex items-center justify-center leading-loose text-callToAction my-2'>
                  Joined In {''}
                  {format(
                    new Date(profile?.attributes?.createdAt),
                    'EE, MMM d, yyy'
                  )}
                </span>
              )}
            </div>

            {auth?.user?.role === 'lecturer' ? (
              <div className='flex gap-1  w-full px-2 overflow-x-scroll scrollbar-hide mt-3'>
                {auth?.isFetchingLecturerProfile ? (
                  <SpinnerLoader color='fill-callToAction' size='w-4 h-4' />
                ) : (
                  auth?.lecturerProfile?.relationships.units?.map(
                    (unit, unitIndex) => (
                      <span
                        key={unitIndex}
                        className='rounded-full bg-callToAction/10 w-fit px-3 py-1 text-xs flex items-center justify-center leading-loose'
                      >
                        {unit?.attributes?.name}
                      </span>
                    )
                  )
                )}
              </div>
            ) : (
              <div className='flex items-center mt-3 gap-3'>
                {!auth?.isFetchingStudentProfile && (
                  <span className='rounded-full bg-callToAction/10 w-fit px-3 py-1 text-xs flex gap-2 items-center justify-center leading-loose text-callToAction whitespace-nowrap'>
                    {
                      auth?.studentProfile?.relationships?.course?.attributes
                        ?.name
                    }
                  </span>
                )}

                <div className='flex gap-1  w-full px-2 overflow-x-scroll scrollbar-hide flex-1'>
                  {auth?.isFetchingStudentProfile ? (
                    <SpinnerLoader color='fill-callToAction' size='w-4 h-4' />
                  ) : (
                    auth?.studentProfile?.relationships?.course?.relationships?.units?.map(
                      (unit, unitIndex) => (
                        <span
                          key={unitIndex}
                          className='rounded-full bg-callToAction/10 w-fit px-3 py-1 text-xs flex items-center justify-center leading-loose whitespace-nowrap'
                        >
                          {unit?.attributes?.name}
                        </span>
                      )
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-5 w-full md:w-[30rem] lg:w-[35rem] border p-2 rounded-[1rem] divide-y'>
          {/* title */}
          <TabTitle title='Update Password.' />

          <div className='flex justify-center '>
            <form
              className='w-full space-y-1 rounded-[2rem] p-6'
              onSubmit={handleSubmit(onSubmit)}
            >
              <Title title='UPDATE YOUR PASSWORD' titleStyles='text-lg' />
              <section className='flex w-full flex-col gap-4 py-3'>
                <div className='flex items-center gap-2'>
                  <div className='relative flex-1'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Minimum required length is 8 characters',
                        },
                        maxLength: {
                          value: 20,
                          message: 'Maximum required length is 20 characters',
                        },
                        pattern: {
                          value:
                            /^(\S)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])[a-zA-Z0-9~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]{10,16}$/,
                          message:
                            'Password should include at least one uppercase, one numeric value and one special character',
                        },
                      })}
                      className='input peer'
                      placeholder='Password'
                    />
                    <label className='inputLabel'>Password</label>

                    {errors['password'] && (
                      <ErrorMessage
                        errors={errors}
                        name='password'
                        render={({ message }) => (
                          <Error errorMessage={message} />
                        )}
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

                <div className='flex items-center gap-2'>
                  <div className='relative flex-1'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('confirmPassword', {
                        required: 'confirm password is required',
                        validate: (value) =>
                          value === password || 'Password do not march',
                      })}
                      className='input peer'
                      placeholder='Confirm Password'
                    />
                    <label className='inputLabel'>Confirm Password</label>

                    {errors['confirmPassword'] && (
                      <ErrorMessage
                        errors={errors}
                        name='confirmPassword'
                        render={({ message }) => (
                          <Error errorMessage={message} />
                        )}
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
              </section>

              <div className='flex justify-end'>
                <Button
                  title={
                    auth?.isUpdatingPassword ? (
                      <SpinnerLoader color='fill-white' />
                    ) : (
                      'Update'
                    )
                  }
                  type='submit'
                  intent='primary'
                  fullWidth={false}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;

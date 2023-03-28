import { Button, Error, SpinnerLoader, WidgetHeader } from '@/components';
import { courseAtoms } from '@/atoms';
import { useRecoilState } from 'recoil';
import { useForm, SubmitHandler } from 'react-hook-form';
import { CourseData } from '../../../../types/typings.t';
import { ErrorMessage } from '@hookform/error-message';
import { useSchool } from '@/hooks';
import { useEffect } from 'react';

const CreateOrEditCourse = () => {
  /**
   * component states
   */
  const {
    globalCourseState,
    isEditingCourseState,
    showCreateOrEditCourseWidgetState,
  } = courseAtoms;
  const [globalCourse, setGlobalCourse] = useRecoilState(globalCourseState);
  const [isEditingCourse, setIsEditingCourse] =
    useRecoilState(isEditingCourseState);
  const [showCreateOrEditCourseWidget, setShowCreateOrEditCourseWidget] =
    useRecoilState(showCreateOrEditCourseWidgetState);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseData>();

  const {
    isCreatingCourse,
    isUpdatingCourse,
    updateCourseMutateAsync,
    createCourseMutateAsync,
  } = useSchool();

  /**
   * component functions
   */
  const onSubmit: SubmitHandler<CourseData> = ({ name }) => {
    isEditingCourse
      ? updateCourseMutateAsync({
          courseId: globalCourse?.id!,
          courseUpdateData: {
            name,
            id: globalCourse?.id,
          },
        })
      : createCourseMutateAsync({
          name,
        });
  };

  useEffect(() => {
    if (isEditingCourse && globalCourse) {
      reset({
        name: globalCourse?.name,
      });
    }
  }, [isEditingCourse, globalCourse, reset]);

  return (
    <section>
      <WidgetHeader
        close={() => {
          setIsEditingCourse(false);
          setGlobalCourse(null);
          setShowCreateOrEditCourseWidget(false);
        }}
        title={!isEditingCourse ? 'CREATE COURSE' : 'EDIT COURSE'}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-6 px-2 mt-3'
      >
        <div className='flex flex-col gap-y-5 rounded-md border py-4 px-2'>
          <div className='relative'>
            <input
              type='text'
              className='input peer'
              placeholder='Course Name'
              {...register('name', {
                required: 'Course name is required.',
              })}
            />
            <label className='inputLabel'>Course Name</label>

            {errors['name'] && (
              <ErrorMessage
                errors={errors}
                name='name'
                render={({ message }) => <Error errorMessage={message} />}
              />
            )}
          </div>
        </div>

        <div className='flex justify-end'>
          <Button
            title={
              isEditingCourse ? (
                isUpdatingCourse ? (
                  <SpinnerLoader color='fill-white' />
                ) : (
                  'EDIT'
                )
              ) : isCreatingCourse ? (
                <SpinnerLoader color='fill-white' />
              ) : (
                'CREATE'
              )
            }
            type='submit'
            intent='primary'
          />
        </div>
      </form>
    </section>
  );
};

export default CreateOrEditCourse;

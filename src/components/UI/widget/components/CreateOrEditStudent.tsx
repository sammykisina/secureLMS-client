import {
  Button,
  Error,
  Select,
  SpinnerLoader,
  WidgetHeader,
} from '@/components';
import { studentAtoms } from '@/atoms';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { StudentData } from '../../../../types/typings.t';
import { useSchool, useStudent } from '@/hooks';
import { useEffect, useState } from 'react';

const CreateOrEditStudent = () => {
  /**
   * component states
   */

  const {
    globalStudentState,
    isEditingStudentState,
    showCreateOrEditStudentWidgetState,
  } = studentAtoms;
  const [isEditingStudent, setIsEditingStudent] = useRecoilState(
    isEditingStudentState
  );
  const [globalStudent, setGlobalStudent] = useRecoilState(globalStudentState);
  const setShowCreateOrEditStudentWidget = useSetRecoilState(
    showCreateOrEditStudentWidgetState
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StudentData>();
  const {
    isUpdatingStudent,
    updateStudentMutateAsync,
    isCreatingStudent,
    createStudentMutateAsync,
  } = useStudent();
  const { courses, generateCourseOptions } = useSchool();
  const [selectedCourse, setSelectedCourse] = useState({
    name: 'Select the course',
    value: '',
  });

  /**
   * component functions
   */
  const onSubmit: SubmitHandler<StudentData> = ({ email, name, regNumber }) => {
    isEditingStudent
      ? updateStudentMutateAsync({
          studentId: globalStudent?.id!,
          studentUpdateData: {
            email,
            name,
            regNumber,
            id: globalStudent?.id,
            password: regNumber,
            course_id: selectedCourse?.value,
          },
        })
      : createStudentMutateAsync({
          regNumber,
          name,
          password: regNumber,
          email,
          course_id: selectedCourse?.value,
        });
  };

  useEffect(() => {
    if (globalStudent && isEditingStudent) {
      reset({
        name: globalStudent?.name,
        email: globalStudent?.email,
        regNumber: globalStudent?.regNumber,
      });
    }
  }, [globalStudent, isEditingStudent, reset]);

  return (
    <section>
      <WidgetHeader
        close={() => {
          setIsEditingStudent(false);
          setGlobalStudent(null);
          setShowCreateOrEditStudentWidget(false);
        }}
        title={!isEditingStudent ? 'CREATE STUDENT' : 'EDIT STUDENT'}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-6 px-2 mt-3'
      >
        <div className='flex flex-col gap-y-5 rounded-md border py-4 px-2'>
          <div className='relative'>
            <input
              type='number'
              className='input peer'
              placeholder='Student Reg Number.'
              {...register('regNumber', {
                required: 'student reg number.',
              })}
            />
            <label className='inputLabel'>Student Reg Number</label>

            {errors['regNumber'] && (
              <ErrorMessage
                errors={errors}
                name='regNumber'
                render={({ message }) => <Error errorMessage={message} />}
              />
            )}
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-textColor/50'>Course</span>
            <Select
              multiple={false}
              options={generateCourseOptions(courses)}
              selectWrapperStyles='border  rounded-[0.9rem] py-1 w-[16rem] xs:w-[26rem]'
              selectPanelStyles='max-h-[8rem] bg-white border shadow-md'
              selected={selectedCourse}
              setSelected={setSelectedCourse}
            />
          </div>
        </div>

        <div className='flex flex-col gap-y-5 rounded-md border py-4 px-2'>
          <div className='relative'>
            <input
              type='text'
              className='input peer'
              placeholder='Name'
              {...register('name', {
                required: 'Student name is required.',
              })}
            />
            <label className='inputLabel'>Name</label>

            {errors['name'] && (
              <ErrorMessage
                errors={errors}
                name='name'
                render={({ message }) => <Error errorMessage={message} />}
              />
            )}
          </div>

          <div className='relative'>
            <input
              type='email'
              className='input peer'
              placeholder='Email'
              {...register('email', {
                required: 'Student email is required.',
              })}
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

        <div className='flex justify-end'>
          <Button
            title={
              isEditingStudent ? (
                isUpdatingStudent ? (
                  <SpinnerLoader color='fill-white' />
                ) : (
                  'EDIT'
                )
              ) : isCreatingStudent ? (
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

export default CreateOrEditStudent;

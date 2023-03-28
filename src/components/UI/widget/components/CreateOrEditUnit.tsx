import {
  Button,
  Error,
  Select,
  SpinnerLoader,
  Toasts,
  WidgetHeader,
} from '@/components';
import { unitAtoms } from '@/atoms';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  CourseData,
  SelectionOption,
  UnitData,
} from '../../../../types/typings.t';
import { ErrorMessage } from '@hookform/error-message';
import { useSchool } from '@/hooks';
import { useEffect, useState } from 'react';

const CreateOrEditUnit = () => {
  /**
   * component states
   */
  const {
    globalUnitState,
    isEditingUnitState,
    showCreateOrEditUnitWidgetState,
  } = unitAtoms;
  const [globalUnit, setGlobalUnit] = useRecoilState(globalUnitState);
  const [isEditingUnit, setIsEditingUnit] = useRecoilState(isEditingUnitState);
  const setShowCreateOrEditUnitWidget = useSetRecoilState(
    showCreateOrEditUnitWidgetState
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UnitData>();

  const {
    isCreatingUnit,
    createUnitMutateAsync,
    isUpdatingUnit,
    updateUnitMutateAsync,
    courses,
    generateCourseOptions,
  } = useSchool();

  const [selectedCourse, setSelectedCourse] = useState<SelectionOption>({
    name: 'Select the unit course',
    value: '',
  });

  /**
   * component functions
   */
  const onSubmit: SubmitHandler<CourseData> = ({ name }) => {
    if (selectedCourse.value === '') {
      Toasts.errorToast("Select the unit's course.");
      return;
    }

    isEditingUnit
      ? updateUnitMutateAsync({
          unitId: globalUnit?.id!,
          unitUpdateData: {
            name,
            course_id: selectedCourse?.value,
            id: globalUnit?.id,
          },
        })
      : createUnitMutateAsync({
          name,
          course_id: selectedCourse?.value,
        });
  };

  useEffect(() => {
    if (isEditingUnit && globalUnit) {
      reset({
        name: globalUnit?.name,
      });

      setSelectedCourse({
        name: globalUnit?.course!,
        value: globalUnit?.course_id,
      });
    }
  }, [isEditingUnit, globalUnit, reset]);

  return (
    <section>
      <WidgetHeader
        close={() => {
          setIsEditingUnit(false);
          setGlobalUnit(null);
          setShowCreateOrEditUnitWidget(false);
        }}
        title={!isEditingUnit ? 'CREATE UNIT' : 'EDIT UNIT'}
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
              placeholder='Unit Name'
              {...register('name', {
                required: 'Course name is required.',
              })}
            />
            <label className='inputLabel'>Unit Name</label>

            {errors['name'] && (
              <ErrorMessage
                errors={errors}
                name='name'
                render={({ message }) => <Error errorMessage={message} />}
              />
            )}
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-textColor/50'>Course</span>
            <Select
              multiple={false}
              options={generateCourseOptions(courses)}
              selectWrapperStyles='border  rounded-[0.9rem] py-1 w-[18rem] xs:w-[26rem]'
              selectPanelStyles='max-h-[6rem] bg-white border border-dark shadow-md'
              selected={selectedCourse}
              setSelected={setSelectedCourse}
            />
          </div>
        </div>

        <div className='flex justify-end'>
          <Button
            title={
              isEditingUnit ? (
                isUpdatingUnit ? (
                  <SpinnerLoader color='fill-white' />
                ) : (
                  'EDIT'
                )
              ) : isCreatingUnit ? (
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

export default CreateOrEditUnit;

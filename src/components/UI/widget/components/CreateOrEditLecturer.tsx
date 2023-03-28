import {
  Button,
  Error,
  Select,
  SpinnerLoader,
  Toasts,
  WidgetHeader,
} from '@/components';
import { lecturerAtoms } from '@/atoms';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import {
  LecturerData,
  SelectionOption,
  StudentData,
} from '../../../../types/typings.t';
import { useLecturer, useSchool } from '@/hooks';
import { useEffect, useState } from 'react';

const CreateOrEditLecturer = () => {
  /**
   * component states
   */

  const {
    globalLecturerState,
    isEditingLecturerState,
    showCreateOrEditLecturerWidgetState,
  } = lecturerAtoms;

  const [isEditingLecturer, setIsEditingLecturer] = useRecoilState(
    isEditingLecturerState
  );
  const [globalLecturer, setGlobalLecturer] =
    useRecoilState(globalLecturerState);
  const setShowCreateOrEditLecturerWidget = useSetRecoilState(
    showCreateOrEditLecturerWidgetState
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LecturerData>();
  const {
    isUpdatingLecturer,
    updateLecturerMutateAsync,
    isCreatingLecturer,
    createLecturerMutateAsync,
  } = useLecturer();
  const { units, generateUnitOptions, generateUnitIds } = useSchool();

  const [selectedUnits, setSelectedUnits] = useState<SelectionOption[]>([]);

  /**
   * component functions
   */
  const onSubmit: SubmitHandler<LecturerData> = ({
    email,
    name,
    workNumber,
  }) => {
    if (selectedUnits.length === 0) {
      Toasts.errorToast('Please select the lecturer units.');
      return;
    }

    isEditingLecturer
      ? updateLecturerMutateAsync({
          lecturerId: globalLecturer?.id!,
          lecturerUpdateData: {
            email,
            name,
            workNumber,
            id: globalLecturer?.id,
            unitIds: generateUnitIds(selectedUnits!),
            password: workNumber,
          },
        })
      : createLecturerMutateAsync({
          workNumber,
          name,
          password: workNumber,
          email,
          unitIds: generateUnitIds(selectedUnits!),
        });
  };

  useEffect(() => {
    if (globalLecturer && isEditingLecturer) {
      reset({
        name: globalLecturer?.name,
        email: globalLecturer?.email,
        workNumber: globalLecturer?.workNumber,
      });

      setSelectedUnits(generateUnitOptions(globalLecturer?.units!));
    }
  }, [globalLecturer, isEditingLecturer, reset]);

  return (
    <section>
      <WidgetHeader
        close={() => {
          setIsEditingLecturer(false);
          setGlobalLecturer(null);
          setShowCreateOrEditLecturerWidget(false);
        }}
        title={!isEditingLecturer ? 'CREATE LECTURER' : 'EDIT LECTURER'}
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
              placeholder='Lecturer Work Number.'
              {...register('workNumber', {
                required: 'lecturer work number is required.',
              })}
            />
            <label className='inputLabel'>Lecturer Work Number.</label>

            {errors['workNumber'] && (
              <ErrorMessage
                errors={errors}
                name='workNumber'
                render={({ message }) => <Error errorMessage={message} />}
              />
            )}
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

          <div className='flex items-center gap-2'>
            <span className='text-textColor/50'>Units</span>
            <Select
              multiple={true}
              options={generateUnitOptions(units)}
              selectWrapperStyles='border  rounded-[0.9rem] py-2 w-[17rem] xs:w-[26rem]'
              selectPanelStyles='max-h-[6rem] bg-white border border-dark shadow-md'
              selected={selectedUnits}
              setSelected={setSelectedUnits}
            />
          </div>
        </div>

        <div className='flex justify-end'>
          <Button
            title={
              isEditingLecturer ? (
                isUpdatingLecturer ? (
                  <SpinnerLoader color='fill-white' />
                ) : (
                  'EDIT'
                )
              ) : isCreatingLecturer ? (
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

export default CreateOrEditLecturer;

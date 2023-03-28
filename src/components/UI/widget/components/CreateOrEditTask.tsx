import {
  Button,
  Error,
  Select,
  SpinnerLoader,
  Toasts,
  WidgetHeader,
} from '@/components';
import { taskAtoms } from '@/atoms';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth, useSchool, useTask } from '@/hooks';
import { SelectionOption, TaskData } from '../../../../types/typings.t';
import { useEffect, useState } from 'react';
import { ErrorMessage } from '@hookform/error-message';
import {
  T_Image_1,
  T_Image_2,
  T_Image_3,
  T_Image_4,
  T_Image_5,
  T_Image_6,
} from '@/assets';
import { appUtils } from '@/utils';

const CreateOrEditTask = () => {
  /**
   * component states
   */
  const {
    globalTaskState,
    isEditingTaskState,
    showCreateOrEditTaskWidgetState,
  } = taskAtoms;
  const [globalTask, setGlobalTask] = useRecoilState(globalTaskState);
  const [isEditingTask, setIsEditingTask] = useRecoilState(isEditingTaskState);
  const setShowCreateOrEditTaskWidget = useSetRecoilState(
    showCreateOrEditTaskWidgetState
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskData>();
  const [selectedUnit, setSelectedUnit] = useState<SelectionOption>({
    name: 'Select the unit the task is for.',
    value: '',
  });

  const { lecturerProfile, user } = useAuth();
  const { generateUnitOptions } = useSchool();
  const images = [
    T_Image_1,
    T_Image_2,
    T_Image_3,
    T_Image_4,
    T_Image_5,
    T_Image_6,
  ];
  const bgColors = [
    'bg-amber-500',
    'bg-orange-500',
    'bg-lime-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
  ];
  const {
    createTaskMutateAsync,
    isCreatingTask,
    isUpdatingTask,
    updateTaskMutateAsync,
  } = useTask();

  /**
   * component functions
   */
  const onSubmit: SubmitHandler<TaskData> = ({
    description,
    numberOfQuestions,
    numberOfValidDays,
    numberOfPointsForEachQuestion,
    timeToTakeInTask,
  }) => {
    if (selectedUnit.value === '') {
      Toasts.errorToast('Select the unit for which this task is for.');
      return;
    }

    isEditingTask
      ? updateTaskMutateAsync({
          taskId: globalTask?.id!,
          taskUpdateData: {
            description,
            icon: globalTask?.attributes?.icon!,
            numberOfQuestions,
            numberOfValidDays,
            unit_id: selectedUnit.value,
            numberOfPointsForEachQuestion,
            timeToTakeInTask,
            bgColor: globalTask?.attributes?.bgColor!,
          },
        })
      : createTaskMutateAsync({
          description,
          icon: appUtils.getRandom(images),
          numberOfQuestions,
          numberOfValidDays,
          unit_id: selectedUnit.value,
          numberOfPointsForEachQuestion,
          timeToTakeInTask,
          lecturer_id: user?.id!,
          bgColor: appUtils.getRandom(bgColors),
          code: appUtils.generateTaskCode(),
        });
  };

  useEffect(() => {
    if (isEditingTask && globalTask) {
      reset({
        description: globalTask?.attributes?.description,
        numberOfQuestions: globalTask?.attributes?.numberOfQuestions,
        numberOfPointsForEachQuestion:
          globalTask?.attributes?.numberOfPointsForEachQuestion,
        numberOfValidDays: globalTask?.attributes?.numberOfValidDays,
        timeToTakeInTask: globalTask?.attributes?.timeToTakeInTask,
      });

      setSelectedUnit({
        name: globalTask?.relationships?.unit?.attributes?.name,
        value: globalTask?.relationships?.unit?.id,
      });
    }
  }, [reset, isEditingTask, globalTask]);

  return (
    <section>
      <WidgetHeader
        close={() => {
          setIsEditingTask(false);
          setGlobalTask(null);
          setShowCreateOrEditTaskWidget(false);
        }}
        title={!isEditingTask ? 'CREATE TASK' : 'EDIT TASK'}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-6 px-2 mt-3'
      >
        <section className='flex flex-col gap-6 px-2'>
          <div className='flex flex-col gap-y-5 rounded-md border py-4 px-2'>
            <div className='relative'>
              <input
                type='text'
                className='input peer'
                placeholder='Task Description'
                {...register('description', {
                  required: 'Task description is required.',
                })}
              />
              <label className='inputLabel'>Task Description</label>

              {errors['description'] && (
                <ErrorMessage
                  errors={errors}
                  name='description'
                  render={({ message }) => <Error errorMessage={message} />}
                />
              )}
            </div>

            <div className='flex items-center gap-2'>
              <span className='text-textColor/50'>Unit</span>
              <Select
                multiple={false}
                options={generateUnitOptions(
                  lecturerProfile?.relationships?.units
                )}
                selectWrapperStyles='border  rounded-[0.9rem] py-1 w-[18rem] xs:w-[26rem]'
                selectPanelStyles='max-h-[6rem] bg-white border border-dark shadow-md'
                selected={selectedUnit}
                setSelected={setSelectedUnit}
              />
            </div>

            <div className='relative'>
              <input
                type='number'
                className='input peer'
                placeholder='Total time to answer questions. (mins)'
                {...register('timeToTakeInTask', {
                  required:
                    'Enter total time to take when answering questions.',
                })}
              />
              <label className='inputLabel'>
                Total time to answer questions. (mins)
              </label>

              {errors['timeToTakeInTask'] && (
                <ErrorMessage
                  errors={errors}
                  name='timeToTakeInTask'
                  render={({ message }) => <Error errorMessage={message} />}
                />
              )}
            </div>
          </div>

          <div className='flex flex-col gap-y-5 rounded-md border py-4 px-2'>
            <div className='relative'>
              <input
                type='number'
                className='input peer'
                placeholder='Number Of Questions.'
                {...register('numberOfQuestions', {
                  required: 'Task description is required.',
                })}
              />
              <label className='inputLabel'>Number Of Questions.</label>

              {errors['numberOfQuestions'] && (
                <ErrorMessage
                  errors={errors}
                  name='numberOfQuestions'
                  render={({ message }) => <Error errorMessage={message} />}
                />
              )}
            </div>

            <div className='relative'>
              <input
                type='number'
                className='input peer'
                placeholder='Number of Points.'
                {...register('numberOfPointsForEachQuestion', {
                  required: 'enter number of points for each question.',
                })}
              />
              <label className='inputLabel'>Number of Points.</label>

              {errors['numberOfPointsForEachQuestion'] && (
                <ErrorMessage
                  errors={errors}
                  name='numberOfPointsForEachQuestion'
                  render={({ message }) => <Error errorMessage={message} />}
                />
              )}
            </div>

            <div className='relative'>
              <input
                type='number'
                className='input peer'
                placeholder='Number Of Days To Invalid Questions.'
                {...register('numberOfValidDays', {
                  required: 'Task description is required.',
                })}
              />
              <label className='inputLabel'>
                Number Of Days To Invalid Questions.
              </label>

              {errors['numberOfValidDays'] && (
                <ErrorMessage
                  errors={errors}
                  name='numberOfValidDays'
                  render={({ message }) => <Error errorMessage={message} />}
                />
              )}
            </div>
          </div>
        </section>

        <div className='flex justify-end'>
          <Button
            title={
              isEditingTask ? (
                isUpdatingTask ? (
                  <SpinnerLoader color='fill-white' />
                ) : (
                  'EDIT'
                )
              ) : isCreatingTask ? (
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

export default CreateOrEditTask;

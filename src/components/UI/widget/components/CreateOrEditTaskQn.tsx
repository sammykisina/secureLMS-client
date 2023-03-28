import {
  Button,
  Error,
  Select,
  SpinnerLoader,
  Title,
  WidgetHeader,
} from '@/components';
import { taskAtoms } from '@/atoms';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useState } from 'react';
import { useTask } from '@/hooks';

export type TaskQns = {
  question: string;
  correctAnswer: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
};

const CreateOrEditTaskQn = () => {
  /**
   * component states
   */
  const {
    showCreateOrEditTaskQnWidgetState,
    globalTaskQNState,
    isEditingTaskQnState,
    globalTaskState,
  } = taskAtoms;
  const [globalTaskQN, setGlobalTaskQN] = useRecoilState(globalTaskQNState);
  const [isEditingTaskQn, setIsEditingTaskQn] =
    useRecoilState(isEditingTaskQnState);
  const setShowCreateOrEditTaskQnWidget = useSetRecoilState(
    showCreateOrEditTaskQnWidgetState
  );
  const globalTask = useRecoilValue(globalTaskState);
  const [selectedCorrectAnswer, setSelectedCorrectAnswer] = useState({
    name: 'Select this question correct answer.',
    value: '',
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskQns>();
  const {
    isCreatingTaskQn,
    createTaskQnMutateAsync,
    isUpdatingTaskQn,
    updateTaskQnMutateAsync,
  } = useTask();

  /**
   * component function
   */
  const onSubmit: SubmitHandler<TaskQns> = ({
    answer1,
    answer2,
    answer3,
    answer4,
    question,
  }) => {
    const answers = [
      {
        identity: 'answer1',
        answer: answer1,
      },
      { identity: 'answer2', answer: answer2 },
      {
        identity: 'answer3',
        answer: answer3,
      },
      {
        identity: 'answer4',
        answer: answer4,
      },
    ];

    isEditingTaskQn
      ? ''
      : createTaskQnMutateAsync({
          question,
          correctAnswer: selectedCorrectAnswer?.value,
          task_id: globalTask?.id!,
          answers,
        });
  };

  return (
    <section>
      <WidgetHeader
        close={() => {
          setGlobalTaskQN(null);
          setIsEditingTaskQn(false);
          setShowCreateOrEditTaskQnWidget(false);
        }}
        title={isEditingTaskQn ? 'EDIT TASK QN.' : 'CREATE TASK QN.'}
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
              placeholder='Question'
              {...register('question', {
                required: 'Question is required.',
              })}
            />
            <label className='inputLabel'>Question</label>

            {errors['question'] && (
              <ErrorMessage
                errors={errors}
                name='question'
                render={({ message }) => <Error errorMessage={message} />}
              />
            )}
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <Title title='Answers' />

          <div className='flex flex-col gap-y-5 rounded-md border py-4 px-2'>
            <div className='relative'>
              <input
                type='text'
                className='input peer'
                placeholder='Answer 1'
                {...register('answer1', {
                  required: 'Answer 1 is required.',
                })}
              />
              <label className='inputLabel'>Answer 1</label>

              {errors['answer1'] && (
                <ErrorMessage
                  errors={errors}
                  name='answer1'
                  render={({ message }) => <Error errorMessage={message} />}
                />
              )}
            </div>

            <div className='relative'>
              <input
                type='text'
                className='input peer'
                placeholder='Answer 2'
                {...register('answer2', {
                  required: 'Answer 2 is required.',
                })}
              />
              <label className='inputLabel'>Answer 2</label>

              {errors['answer2'] && (
                <ErrorMessage
                  errors={errors}
                  name='answer2'
                  render={({ message }) => <Error errorMessage={message} />}
                />
              )}
            </div>

            <div className='relative'>
              <input
                type='text'
                className='input peer'
                placeholder='Answer 3'
                {...register('answer3', {
                  required: 'Answer 3 is required.',
                })}
              />
              <label className='inputLabel'>Answer 3</label>

              {errors['answer3'] && (
                <ErrorMessage
                  errors={errors}
                  name='answer3'
                  render={({ message }) => <Error errorMessage={message} />}
                />
              )}
            </div>

            <div className='relative'>
              <input
                type='text'
                className='input peer'
                placeholder='Answer 4'
                {...register('answer4', {
                  required: 'Answer 4 is required.',
                })}
              />
              <label className='inputLabel'>Answer 4</label>

              {errors['answer4'] && (
                <ErrorMessage
                  errors={errors}
                  name='answer4'
                  render={({ message }) => <Error errorMessage={message} />}
                />
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <Title title='Correct Answer' />

          <div className='flex flex-col gap-y-5 rounded-md border py-4 px-2'>
            <div className='flex items-center gap-2'>
              <span className='text-textColor/50'>Course</span>
              <Select
                multiple={false}
                options={[
                  { name: 'Answer 1', value: 'answer1' },
                  { name: 'Answer 2', value: 'answer2' },
                  { name: 'Answer 3', value: 'answer3' },
                  { name: 'Answer 4', value: 'answer4' },
                ]}
                selectWrapperStyles='border  rounded-[0.9rem] py-1 w-[18rem] xs:w-[26rem]'
                selectPanelStyles='max-h-[6rem] bg-white border border-dark shadow-md'
                selected={selectedCorrectAnswer}
                setSelected={setSelectedCorrectAnswer}
              />
            </div>
          </div>
        </div>

        <div className='flex justify-end'>
          <Button
            title={
              isEditingTaskQn ? (
                isUpdatingTaskQn ? (
                  <SpinnerLoader color='fill-white' />
                ) : (
                  'EDIT'
                )
              ) : isCreatingTaskQn ? (
                <SpinnerLoader color='fill-white' />
              ) : (
                'ADD'
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

export default CreateOrEditTaskQn;

import {
  Button,
  CreateOrEditTaskQn,
  Title,
  Widget,
  WidgetHeader,
} from '@/components';
import { taskAtoms } from '@/atoms';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { FC } from 'react';
import { APIQuestion } from '../../../../types/typings.t';

const TaskQns = () => {
  /**
   * component states
   */
  const {
    globalTaskState,
    showTaskQnsWidgetState,
    showCreateOrEditTaskQnWidgetState,
  } = taskAtoms;
  const [globalTask, setGlobalTask] = useRecoilState(globalTaskState);
  const setShowTaskQnsWidget = useSetRecoilState(showTaskQnsWidgetState);
  const [showCreateOrEditTaskQnWidget, setShowCreateOrEditTaskQnWidget] =
    useRecoilState(showCreateOrEditTaskQnWidgetState);

  /**
   * component functions
   */
  const Question: FC<{ question: APIQuestion; questionIndex: number }> = ({
    question,
    questionIndex,
  }) => {
    return (
      <section className='border p-2 rounded-[1rem]'>
        <div
          className={`icon p-4 flex justify-center items-center font-bold rounded-full text-textColor ${globalTask?.attributes?.bgColor}`}
        >
          {questionIndex + 1}
        </div>

        <div className='mt-2'>
          <span>{question?.attributes?.question}</span>

          <div className='ml-5 mt-2 flex flex-col gap-2'>
            {question?.relationships?.answers?.map((answer, answerIndex) => (
              <div key={answerIndex} className='flex gap-2'>
                <div className='relative'>
                  <span>{answerIndex + 1}).</span>
                  <div
                    className={`bg-green-500 absolute top-0 -left-2 w-3 rounded-full h-3 animate-bounce ${
                      question?.attributes?.correctAnswer !=
                        answer?.attributes?.identity && 'hidden'
                    }`}
                  />
                </div>
                <p className='text-textColor'>{answer?.attributes?.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <section>
      <WidgetHeader
        close={() => {
          setGlobalTask(null);
          setShowTaskQnsWidget(false);
        }}
        title='TASK QNS'
      />

      <div className='flex items-center justify-between  px-2 mt-2'>
        {/* title */}
        <div className='flex items-center gap-3'>
          <Title title='QNS' />
          <span
            className={`rounded-full ${globalTask?.attributes?.bgColor} w-fit px-3 py-1 text-xs flex gap-2 items-center justify-center leading-loose text-textColor`}
          >
            {' '}
            {globalTask?.relationships?.questions?.length} of{' '}
            {globalTask?.attributes?.numberOfQuestions}{' '}
          </span>
        </div>

        <div
          className={`${
            globalTask?.relationships?.questions?.length ===
              globalTask?.attributes?.numberOfQuestions && 'hidden'
          }`}
        >
          <Button
            title='ADD QN'
            type='button'
            intent='primary'
            fullWidth={false}
            purpose={() => setShowCreateOrEditTaskQnWidget(true)}
          />
        </div>
      </div>

      {/* qns */}
      <section className='mt-5 px-2 flex flex-col gap-2  max-h-[30rem] scrollbar-hide overflow-y-scroll'>
        {globalTask?.relationships?.questions?.length! > 0 ? (
          globalTask?.relationships?.questions?.map(
            (question, questionIndex) => (
              <Question
                key={questionIndex}
                question={question}
                questionIndex={questionIndex}
              />
            )
          )
        ) : (
          <div className='border h-[20rem] rounded-[2rem] flex justify-center items-center'>
            No Questions Added For The Task
          </div>
        )}
      </section>

      <Widget
        widgetState={showCreateOrEditTaskQnWidget}
        component={<CreateOrEditTaskQn />}
        widgetStyles='w-[90vw] h-fit'
      />
    </section>
  );
};

export default TaskQns;

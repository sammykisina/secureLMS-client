import React, { useState } from 'react';
import { taskAtoms } from '@/atoms';
import { useRecoilState } from 'recoil';
import { Button, Icon, SpinnerLoader } from '@/components';
import { APIAnswer } from '../../../../types/typings.t';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { useAuth, useStudent } from '@/hooks';

const TakeTask = () => {
  /**
   * component states
   */
  const { globalTaskState } = taskAtoms;
  const [globalTask, setGlobalTask] = useRecoilState(globalTaskState);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    localStorage.getItem('currentQuestionIndex')
      ? JSON.parse(localStorage.getItem('currentQuestionIndex')!)
      : 0
  );
  const [chosenAnswer, setChosenAnswer] = useState<APIAnswer | null>(
    JSON.parse(localStorage.getItem('chosenAnswer')!)
  );
  const [results, setResults] = useState(
    localStorage.getItem('results')
      ? JSON.parse(localStorage.getItem('results')!)
      : 0
  );

  const { createStudentTaskResultsMutateAsync, isCreatingStudentTaskResult } =
    useStudent();

  const { user } = useAuth();

  /**
   * component functions
   */
  const save = () => {
    if (
      localStorage.removeItem('showTakeTaskModalState') !== undefined ||
      localStorage.removeItem('showTakeTaskModalState') !== null
    ) {
      createStudentTaskResultsMutateAsync({
        points:
          results *
          parseInt(globalTask?.attributes?.numberOfPointsForEachQuestion!),
        student_id: user?.id!,
        task_id: globalTask?.id!,
      });
    }
  };

  return (
    <section className='p-2'>
      {/* time and qns */}
      <div className='flex items-center justify-between'>
        <span className='rounded-full bg-green-400/10 w-fit px-3 py-1 text-xs flex items-center justify-center leading-loose'>
          QN {currentQuestionIndex + 1} of{' '}
          {globalTask?.relationships?.questions?.length}
        </span>
      </div>

      {/* qn  and answers*/}
      {globalTask?.relationships?.questions?.length! > 0 && (
        <div className='mt-2'>
          <p className='font-bold ml-2'>
            {
              globalTask?.relationships?.questions[currentQuestionIndex]
                .attributes?.question
            }
          </p>

          <div className='flex flex-col gap-3 mt-4'>
            {globalTask?.relationships?.questions[
              currentQuestionIndex
            ].relationships?.answers.map((answer, answerIndex) => (
              <div
                key={answerIndex}
                onClick={() => {
                  if (!chosenAnswer) {
                    setChosenAnswer(answer);
                    localStorage.setItem(
                      'chosenAnswer',
                      JSON.stringify(answer)
                    );
                  }

                  if (
                    answer?.attributes?.identity ===
                    globalTask?.relationships?.questions[currentQuestionIndex]
                      .attributes?.correctAnswer
                  ) {
                    setResults(results + 1);
                    localStorage.setItem(
                      'results',
                      JSON.stringify(results + 1)
                    );
                  }
                }}
                className={`cursor-pointer flex items-center hover:bg-callToAction duration-300 ${
                  answer?.attributes?.identity ===
                    chosenAnswer?.attributes?.identity && 'bg-callToAction'
                }`}
              >
                <span className='bg-callToAction p-2 icon flex justify-center items-center rounded-full text-white'>
                  {chosenAnswer ? (
                    globalTask?.relationships?.questions[currentQuestionIndex]
                      .attributes?.correctAnswer ===
                    answer?.attributes?.identity ? (
                      <Icon icon={<IoCheckmarkDoneSharp />} />
                    ) : (
                      answerIndex + 1
                    )
                  ) : (
                    answerIndex + 1
                  )}
                </span>

                <p
                  key={answerIndex}
                  className='bg-callToAction/10 rounded-full px-4  py-2'
                >
                  {answer?.attributes?.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={`flex justify-end mt-4 ${chosenAnswer ? 'block' : 'hidden'}`}
      >
        <Button
          title={
            globalTask?.relationships?.questions.length ===
            currentQuestionIndex + 1 ? (
              isCreatingStudentTaskResult ? (
                <SpinnerLoader color='fill-white' />
              ) : (
                'End'
              )
            ) : (
              'Next'
            )
          }
          type='submit'
          intent='primary'
          fullWidth={false}
          purpose={() => {
            if (
              globalTask?.relationships?.questions.length ===
              currentQuestionIndex + 1
            ) {
              createStudentTaskResultsMutateAsync({
                points:
                  results *
                  parseInt(
                    globalTask?.attributes?.numberOfPointsForEachQuestion!
                  ),
                student_id: user?.id!,
                task_id: globalTask?.id!,
              });
            } else {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
              setChosenAnswer(null);
              localStorage.setItem(
                'currentQuestionIndex',
                JSON.stringify(currentQuestionIndex + 1)
              );
            }

            localStorage.removeItem('chosenAnswer');
          }}
        />
      </div>
    </section>
  );
};

export default TakeTask;

const Error = ({ errorMessage }: { errorMessage: string }) => {
  return <span className='error'>{errorMessage}</span>;
};

export default Error;

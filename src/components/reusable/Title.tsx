const Title = ({
  title,
  titleStyles,
}: {
  title: string;
  titleStyles?: string;
}) => {
  return (
    <h2
      className={`whitespace-nowrap font-semibold leading-tight tracking-wider  ${
        titleStyles ? titleStyles : 'text-textColor'
      }`}
    >
      {title}
    </h2>
  );
};

export default Title;

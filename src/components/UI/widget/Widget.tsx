import type { FC, ReactNode } from 'react';

type WidgetProps = {
  component: ReactNode;
  widgetState: boolean;
  widgetStyles: string;
};

const Widget: FC<WidgetProps> = ({ component, widgetState, widgetStyles }) => {
  return (
    <aside
      className={`${widgetState ? 'widgetWrapper show ' : 'widgetWrapper'} `}
    >
      <div className={`widget ${widgetStyles} flex flex-col gap-y-4 py-5`}>
        {component}
      </div>
    </aside>
  );
};

export default Widget;

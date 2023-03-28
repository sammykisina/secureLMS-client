import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode, FC } from 'react';

const buttonStyles = cva(
  'flex justify-center items-center py-2 rounded-full  focus:outline-none whitespace-nowrap disabled:cursor-not-allowed',
  {
    variants: {
      intent: {
        primary: 'bg-callToAction text-white',
        secondary: 'bg-secondary/10 text-textColor',
        danger: 'bg-red-500 text-white',
        link: 'text-primary font-semibold',
      },
      form: {
        small: 'h-[25px]  px-[16px] text-[14px]',
        medium: 'h-[40px]  px-[16px] text-[16px]',
        large: 'h-[50px]  px-[16px] text-[16px]',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-fit',
      },
    },
    defaultVariants: {
      intent: 'primary',
      form: 'medium',
      fullWidth: true,
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonStyles> {
  title?: string | ReactNode;
  icon?: ReactNode;
  icon_wrapper_styles?: string;
  purpose?: () => void;
  disabled?: boolean;
  type: 'button' | 'submit' | 'reset' | undefined;
}

const Button: FC<ButtonProps> = ({
  intent,
  fullWidth,
  type,
  form,
  title,
  purpose,
  disabled,
}) => {
  return (
    <button
      onClick={purpose}
      type={type}
      className={buttonStyles({ intent, fullWidth, form })}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default Button;

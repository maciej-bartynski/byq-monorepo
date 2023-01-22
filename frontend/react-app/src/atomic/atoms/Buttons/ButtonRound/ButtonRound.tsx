import stringsConcatWithSpace from 'lib/tools/stringsConcatWithSpace';
import { FC } from 'react';
import ButtonPrimary from '../ButtonPrimary';
import ButtonSecondary from '../ButtonSecondary';
import { ButtonProps } from '../types';
import defaultCss from './ButtonRound.module.css';

const ButtonRound: FC<ButtonProps & {
    variant?: 'primary' | 'secondary'
}> = ({ variant = 'primary', ...props }) => {

    const ButtonComponent = variant === 'primary'
        ? ButtonPrimary
        : ButtonSecondary;

    const resolvedCssClass = stringsConcatWithSpace(defaultCss.root, props.className)

    return (
        <ButtonComponent
            {...props}
            className={resolvedCssClass}
        />
    )
}

export default ButtonRound
import type { SVGProps } from 'react';
import BackButtonSvg from '@/assets/images/back-button-icon.svg?react';

export type BackButtonIconProps = SVGProps<SVGSVGElement>;

export default function BackButtonIcon({
    'aria-hidden': ariaHidden = true,
    ...rest
}: BackButtonIconProps) {
    return <BackButtonSvg aria-hidden={ariaHidden} {...rest} />
}
import type { SVGProps } from 'react';
import HamburgerIconSvg from '@/assets/images/hamburger-icon.svg?react';

export type HamburgerIconProps = SVGProps<SVGSVGElement>;

export default function HamburgerIcon({
    'aria-hidden': ariaHidden = true,
    ...rest
}: HamburgerIconProps) {
    return <HamburgerIconSvg aria-hidden={ariaHidden} {...rest} />
}
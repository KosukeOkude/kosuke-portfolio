import type { SVGProps } from 'react';
import ArrowLeftSvg from '@/assets/images/arrow-left.svg?react';

export type ArrowLeftIconProps = SVGProps<SVGSVGElement>;

export default function ArrowLeftIcon({
  'aria-hidden': ariaHidden = true,
  ...rest
}: ArrowLeftIconProps) {
  return <ArrowLeftSvg aria-hidden={ariaHidden} {...rest} />;
}
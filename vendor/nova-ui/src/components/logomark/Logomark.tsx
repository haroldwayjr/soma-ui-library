import type { CSSProperties, ReactElement, Ref } from 'react'

import { cx } from '../../helper/cx'
import { rootStyle } from './Logomark.css'

export interface LogomarkProps {
  className?: string
  /** Accessible name. Omit when a visible wordmark already names the product. */
  label?: string
  ref?: Ref<SVGSVGElement>
  style?: CSSProperties
}

export function Logomark({
  className,
  label,
  ref,
  style,
}: LogomarkProps): ReactElement {
  const named = label !== undefined && label.trim().length > 0

  return (
    <svg
      aria-hidden={named ? undefined : true}
      aria-label={named ? label : undefined}
      className={cx(rootStyle, className)}
      focusable="false"
      ref={ref}
      role={named ? 'img' : undefined}
      style={style}
      viewBox="0 0 22 24"
    >
      <path d="M18.6667 24C20.5075 24 21.9999 22.4737 21.9999 20.5909C21.9999 18.7081 20.5075 17.1818 18.6667 17.1818C16.8258 17.1818 15.3335 18.7081 15.3335 20.5909C15.3335 22.4737 16.8258 24 18.6667 24Z" />
      <path d="M3.33383 6.8182C5.1747 6.8182 6.66702 5.2919 6.66702 3.4091C6.66702 1.52631 5.1747 0 3.33383 0C1.49296 0 0.00063671 1.52631 0.00063671 3.4091C0.00063671 5.2919 1.49296 6.8182 3.33383 6.8182Z" />
      <path d="M18.6667 6.8182C20.5075 6.8182 21.9999 5.2919 21.9999 3.4091C21.9999 1.52631 20.5075 0 18.6667 0C16.8258 0 15.3335 1.52631 15.3335 3.4091C15.3335 5.2919 16.8258 6.8182 18.6667 6.8182Z" />
      <path d="M3.33392 24C5.17479 24 6.66711 22.4737 6.66711 20.5909C6.66711 18.7081 5.17479 17.1818 3.33392 17.1818C1.49305 17.1818 0.000724532 18.7081 0.000724532 20.5909C0.000724532 22.4737 1.49305 24 3.33392 24Z" />
      <path d="M3.33393 15.4091C3.79414 15.4472 6.37323 14.9544 8.41468 14.543C10.1225 14.1988 11.8781 14.1988 13.5859 14.543C15.6274 14.9544 18.2065 15.4472 18.6667 15.4091C20.5076 15.4091 21.9999 13.8828 21.9999 12C21.9999 10.1172 20.5076 8.59091 18.6667 8.59091C17.9639 8.59091 15.5391 9.05288 13.6024 9.4461C11.8837 9.79504 10.1169 9.79504 8.39825 9.4461C6.46152 9.05288 4.03667 8.59091 3.33393 8.59091C1.49303 8.59091 0.000708191 10.1172 0.000708191 12C0.000708191 13.8828 1.49303 15.4091 3.33393 15.4091Z" />
    </svg>
  )
}

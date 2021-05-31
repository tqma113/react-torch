import React from 'react'
import { useHistory } from '../hook'

export type LinkProps = React.PropsWithChildren<{
  href: string
  className?: string
  style?: React.CSSProperties
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}>

export const Link = ({
  href,
  children,
  style,
  className,
  onClick,
}: LinkProps) => {
  const history = useHistory()

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    history.push(href)
    event.preventDefault()
  }

  return (
    <a
      className={className}
      href={href}
      onClick={onClick || handleClick}
      style={style}
    >
      {children}
    </a>
  )
}

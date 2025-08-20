import { ReactNode } from 'react'

const Spacing = ({children}: {children:ReactNode}) => {
  return (
    <div className="spacing">{children}</div>
  )
}

export default Spacing
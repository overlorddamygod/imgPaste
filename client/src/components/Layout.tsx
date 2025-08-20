import { ReactNode } from "react"
import Header from "./Header"

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <div className="spacing h-full">
        {children}
      </div>
    </>
  )
}

export default Layout
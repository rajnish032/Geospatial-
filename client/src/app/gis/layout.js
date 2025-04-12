import Navbar from "../user/components/Navbar"
const AccountLayout = ({ children }) => {
  return (
    <>
      <Navbar/>
      {children}
    </>
  )
}

export default AccountLayout
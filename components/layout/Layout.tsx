interface layoutProps {
    children: React.ReactNode
}

const Layout: React.FC<layoutProps> = ({ children }) => {
    return <div className="max-w-screen-lg mx-auto pt-[52px]">{children}</div>
}

export default Layout

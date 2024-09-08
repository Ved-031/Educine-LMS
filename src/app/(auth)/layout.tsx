interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({children}: AuthLayoutProps) => {
    return ( 
        <div className="flex items-center justify-center w-full h-full">
            {children}
        </div>
     );
}
 
export default AuthLayout;
import { Helmet } from "react-helmet";

const MyHelmet = ({title, titled, children}) => {
    return (
        <Helmet>
            <title>{title ? title : titled ? `${titled} | Utility Social` : 'Utility Social'}</title>
            {children}
        </Helmet>
    );
};

export default MyHelmet;
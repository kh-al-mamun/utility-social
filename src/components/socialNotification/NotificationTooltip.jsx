import { Tooltip, tooltipClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationList from './NotificationList';
import { useLocation } from 'react-router-dom';

// this component is placed on SocialNavigation
const NotificationTooltip = ({ children, notifications }) => {
    const location = useLocation();

    return (
        <CustomWidthTooltip
            arrow
            // if the user is already on notification page the tooltip will not be showed
            title={location.pathname.includes('notification') ? null : <NotificationList notifications={notifications}/>}
        >
            {children}
        </CustomWidthTooltip>
    );
};

const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 'none',
    },
});

export default NotificationTooltip;
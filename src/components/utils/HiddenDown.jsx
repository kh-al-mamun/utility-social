import { useMediaQuery } from "@mui/material";

const HiddenDown = ({children, breakpoint = 'md', up = false}) => {
    const hidden = useMediaQuery(theme => up ? theme.breakpoints.up(breakpoint) : theme.breakpoints.down(breakpoint));
    if(hidden) return null;
    return children;
};

export default HiddenDown;
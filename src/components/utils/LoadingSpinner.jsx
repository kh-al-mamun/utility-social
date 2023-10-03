import { CircularProgress } from "@mui/material";

const LoadingSpinner = ({
    size = 30,
    color = 'secondary',
    sx = { margin: '0 auto' }
}) => {

    return <CircularProgress
        disableShrink
        color={color}
        size={size}
        sx={{display: 'block', ...sx}}
    />
};

export default LoadingSpinner;
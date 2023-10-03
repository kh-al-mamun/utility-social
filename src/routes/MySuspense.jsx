import { Box, CircularProgress } from '@mui/material';
import { Suspense } from 'react';

const MySuspense = ({children}) => {
    return (
        <Suspense fallback={<FallBacker />}>
            {children}
        </Suspense>
    );
};

const FallBacker = () => {
    return (
        <Box display="flex" justifyContent="center">
            <CircularProgress color="secondary" />
        </Box>
    )
}

export default MySuspense;
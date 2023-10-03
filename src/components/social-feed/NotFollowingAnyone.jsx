import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Box } from '@mui/material';
import FollowSuggestion from '../shared/FollowSuggestion';
import HiddenDown from '../utils/HiddenDown';

const NotFollowingAnyone = () => {
    return (
        <Box>
            <SentimentVeryDissatisfiedIcon
                color='secondary'
                sx={{
                    mx: 'auto',
                    display: 'block',
                    width: { xs: '10vh', md: '10vw' },
                    height: { xs: '10vh', md: '10vw' },
                    mt: { xs: 4, md: 8 }
                }}
            />
            <p style={{
                fontSize: '1.1rem',
                color: 'gray',
                textAlign: 'center'
            }}>
                You are not following anyone. Follow people to see what they share.
            </p>
            <br /> <br />

            <HiddenDown breakpoint='md' up>
                <FollowSuggestion
                    paperStyles={{ px: 3, border: 'none' }}
                />
            </HiddenDown>
        </Box>
    );
};

export default NotFollowingAnyone;
import './utils.css';
import WifiChannelIcon from '@mui/icons-material/WifiChannel';

const LoadingLogo = () => {
    return (
        <div style={{
            position: 'absolute',
            zIndex: 1,
            height: '100%',
            width: '100%',
            top: '0',
            left: '0',
            display: 'grid',
            placeItems: 'center',
            background: '#1E1E1E'
        }}>
            <WifiChannelIcon
                className='pulsate'
                sx={{ fontSize: '5rem' }}
            />
            {/* <div className='pulse'></div> */}
        </div>
    );
};

export default LoadingLogo;
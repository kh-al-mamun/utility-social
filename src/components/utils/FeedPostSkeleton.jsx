const FeedPostSkeleton = () => {
    return (
        <div style={{
            background: 'rgba(255, 255, 255, .2)',
            borderRadius: '2px',
            marginBottom: '3rem',
            marginTop: '10px',
            height: '100vh',
            padding: '1rem 0px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0 10px',
            }}>
                <div style={{ width: '45px', height: '45px', background: 'gray', borderRadius: '50%' }} />
                <div>
                    <div style={{ width: '150px', height: '15px', background: 'gray' }} />
                    <div style={{ width: '150px', height: '10px', background: 'gray', marginTop: '10px' }} />
                </div>
            </div>

            <div style={{ height: '100%', background: 'gray' }} />

            <p style={{ margin: '0px 10px' }}>...</p>
        </div>
    );
};

export default FeedPostSkeleton;
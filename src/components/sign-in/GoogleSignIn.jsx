import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { AuthContext } from '../../providers/AuthProvider';
import { Button } from '../utils/Imports';
import GoogleIcon from '@mui/icons-material/Google';
import { useMutation } from '@apollo/client';
import { STORE_USER } from '../../mutations/user';
import baseUrl from '../../baseUrl';

const GoogleSignIn = ({ from }) => {
    const navigate = useNavigate();
    const { signInWithGoogle } = useAuth(AuthContext);
    const [StoreUser, { loading }] = useMutation(STORE_USER)

    const handleGoogleSignIn = async () => {
        try {
            // initiate sign in with Google
            const result = await signInWithGoogle();
            const { email, displayName, photoURL } = result.user;
            const res = await fetch(`${baseUrl}/jwt/is-account-exists/${email}`); // checking user existence
            const data = await res.json();

            // navigate existing users
            if (data.isAccountExists) {
                navigate(from, { replace: true });
                return;
            }

            // store new user to database
            await StoreUser({
                variables: {
                    input: {
                        email,
                        displayName,
                        image: photoURL,
                        firstName: "",
                        lastName: "",
                        username: email.split("@")[0].slice(0, 5).concat(Math.random() * 100000000).slice(0, 12),
                        created_at: Date.now(),
                        last_notification_checked: Date.now(),
                    }
                }
            })
            navigate(from, { replace: true });
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <Button
            fullWidth
            variant='contained'
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{ gap: 2, textTransform: 'none', bgcolor: '#234b76' }}
        >
            <GoogleIcon />
            <span>Sign in with Google</span>
        </Button>
    );
};

export default GoogleSignIn;
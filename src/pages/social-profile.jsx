import { Avatar, Box } from "../components/utils/Imports";
import SideUsername from "../components/social-profile/SideUsername";
import StatsCount from "../components/social-profile/StatsCount";
import { useMediaQuery } from "@mui/material";
import ProfileBio from "../components/social-profile/ProfileBio";
import ProfileTabs from "../components/social-profile/ProfileTabs";
import { useQuery } from "@apollo/client";
import { GET_PUBLIC_PROFILE } from "../queries/user";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/utils/LoadingSpinner";
import useUser from "../hooks/useUser";
import ErrorFetchingData from "../components/utils/ErrorFetchingData";
import MyHelmet from "../components/shared/MyHelmet";

const ProfilePage = () => {
    const { username } = useParams();
    const { username: loggedInUsername, followingAggregate } = useUser();
    const underMd = useMediaQuery(theme => theme.breakpoints.down('md'));
    const { data, loading, error } = useQuery(GET_PUBLIC_PROFILE, { variables: { username } });
    const isOwner = username === loggedInUsername;
    let content;

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorFetchingData error={error} />
    const { _id: profileId, displayName, bio, website, image, posts, followerCount, followingCount } = data.publicProfile;
    const isAlreadyFollowing = followingAggregate.following.some(f => f.profileId === profileId);

    // for larger screen
    if (!underMd) {
        content = (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
            }}>
                <Avatar src={image} alt="" sx={{ width: 150, height: 150 }} />
                <Box display="flex" flexDirection="column" flexGrow={1} gap={2}>
                    <SideUsername
                        username={username}
                        isOwner={isOwner}
                        profileId={profileId}
                        isAlreadyFollowing={isAlreadyFollowing}
                        image={image}
                    />
                    <StatsCount
                        followerCount={followerCount}
                        followingCount={followingCount}
                        postCount={posts.length}
                    />
                    <ProfileBio
                        displayName={displayName}
                        bio={bio}
                        website={website}
                    />
                </Box>
            </Box>
        )
    }

    // for smaller screen
    else {
        content = (
            <Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 3,
                }}>
                    <Avatar src={image} alt="" sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 } }} />
                    <Box width="100%">
                        <SideUsername
                            username={username}
                            isOwner={isOwner}
                            profileId={profileId}
                            isAlreadyFollowing={isAlreadyFollowing}
                            image={image}
                        />
                    </Box>
                </Box>

                <ProfileBio
                    sx={{ marginTop: 3 }}
                    displayName={displayName}
                    bio={bio}
                    website={website}
                />

                <StatsCount
                    sx={{ py: 1.2, fontSize: '14px', }}
                    followerCount={followerCount}
                    followingCount={followingCount}
                    postCount={posts.length}
                />
            </Box>
        )
    }

    return (
        <Box>
            <MyHelmet titled="Profile"/>
            {content}
            <ProfileTabs isOwner={isOwner} posts={posts} />
        </Box>
    )
};


export default ProfilePage;
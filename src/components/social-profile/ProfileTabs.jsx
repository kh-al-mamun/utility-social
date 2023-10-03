import { useState } from "react";
import { Box, Divider, Typography } from '../utils/Imports';
import { Tab, Tabs, useMediaQuery } from "@mui/material";
import GridOnIcon from '@mui/icons-material/GridOn';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import GridPost from "../shared/GridPost";
import useUser from "../../hooks/useUser";

const ProfileTabs = ({ isOwner, posts }) => {
    const [value, setValue] = useState(0);
    const isUnderMD = useMediaQuery(theme => theme.breakpoints.down('md'));

    return (
        <Box mt={isUnderMD ? 5 : 7}>
            <Tabs
                value={value}
                onChange={(_, value) => setValue(value)}
                aria-label="Posts and Saves"
                variant={isUnderMD ? "fullWidth" : "standard"}
                sx={{ width: { md: 'fit-content' }, mx: 'auto' }}
            >
                <Tab
                    icon={<GridOnIcon sx={{ width: 25, height: 25 }} />}
                    iconPosition="start"
                    label={isUnderMD ? undefined : "POSTS"}
                    sx={{ mr: { md: 5 } }}
                />
                {isOwner && <Tab
                    icon={<BookmarkIcon sx={{ width: 25, height: 25 }} />}
                    iconPosition="start"
                    label={isUnderMD ? undefined : "SAVED"}
                />}
            </Tabs>
            <Divider sx={{ mb: 4 }} />

            {value === 0 && <UserPosts isOwner={isOwner} posts={posts} />}
            {value === 1 && <SavedPosts />}
        </Box>
    );
};


const UserPosts = ({ isOwner, posts = [] }) => {
    if (posts.length === 0) {
        return (
            <NoItems
                icon={<GridOnIcon sx={{ width: { xs: 25, md: 40 }, height: { xs: 25, md: 40 } }} />}
                title="Posts"
                subtitle={isOwner ? "No posts! Add some and they will appear here." : "User haven't added any posts yet."}
            />
        )
    }

    return (
        <Box
            display="grid"
            sx={{ gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: { xs: 2, md: 4 } }}
        >
            {posts.map((post, i) => <GridPost key={i} post={post} />)}
        </Box>
    )
}


const SavedPosts = () => {
    const {savedPosts} = useUser();
    console.log(savedPosts);

    if (!savedPosts || savedPosts.length === 0) {
        return (
            <NoItems
                icon={<BookmarkIcon sx={{ width: { xs: 30, md: 45 }, height: { xs: 30, md: 45 } }} />}
                title="Save"
                subtitle="Save photos and videos you want to see again. No one is notified and only you can see what you've saved."
            />
        )
    }

    return (
        <Box
            display="grid"
            sx={{ gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: { xs: 2, md: 4 } }}
        >
            {savedPosts.map((saved, i) => <GridPost key={i} post={saved.post} />)}
        </Box>
    )
}


const NoItems = ({ icon, title, subtitle }) => {
    return (
        <Box
            color="GrayText"
            maxWidth={300}
            mx="auto"
            textAlign="center"
            sx={{ mt: { xs: 1, md: 8 } }}
        >
            <Box
                mx="auto"
                border={1}
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ opacity: .5, width: { xs: 40, md: 65 }, height: { xs: 40, md: 65 } }}
            >
                {icon}
            </Box>
            <Typography
                mt={2}
                fontWeight={600}
                sx={{ fontSize: { xs: 20, md: 25 } }}
            >
                {title}
            </Typography>
            <Typography
                variant="subtitle1"
                // sx={{ fontSize: { xs: 12, md: 16 } }}
            >
                {subtitle}
            </Typography>
        </Box>
    )
}

export default ProfileTabs;
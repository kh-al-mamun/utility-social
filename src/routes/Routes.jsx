import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import PrivateRoute from "./PrivateRoute";
import React from "react";
import MySuspense from "./MySuspense";
// import SocialFeedPage from "../pages/social-feed";
// import ProfilePage from "../pages/social-profile";
// import ExplorePage from "../pages/social-explore";
// import PostPage from "../pages/social-post";
// import EditProfilePage from "../pages/social-edit-profile";
// import EditProfile from "../components/social-edit-profile/EditProfile";
// import ChangePassword from "../components/social-edit-profile/ChangePassword";
import Home from "../pages/Home";
import DashboardPage from "../pages/social-dashboard";
import NotFoundPage from "../pages/not-found";
import NotificationPage from "../pages/social-notification";
import ChangeUsername from "../components/social-edit-profile/ChangeUsername";
import ChangeEmail from "../components/social-edit-profile/ChangeEmail";

const TodoMain = React.lazy(() => import("../pages/todos"));
const SongMain = React.lazy(() => import("../pages/songs"));
const SignIn = React.lazy(() => import("../pages/sign-in"));
const SignUp = React.lazy(() => import("../pages/sign-up"));
const SocialFeedPage = React.lazy(() => import("../pages/social-feed"));
const ProfilePage = React.lazy(() => import("../pages/social-profile"))
const ExplorePage = React.lazy(() => import("../pages/social-explore"))
const PostPage = React.lazy(() => import("../pages/social-post"))
const EditProfilePage = React.lazy(() => import("../pages/social-edit-profile"))
const ReportAProblemPage = React.lazy(() => import("../pages/report-a-problem"))
const EditProfile = React.lazy(() => import("../components/social-edit-profile/EditProfile"))
const ChangePassword = React.lazy(() => import("../components/social-edit-profile/ChangePassword"))

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <NotFoundPage />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/sign-in',
                element: <MySuspense><SignIn /></MySuspense>
            },
            {
                path: '/sign-up',
                element: <MySuspense><SignUp /></MySuspense>
            },
            {
                path: '/todos',
                element: <MySuspense><PrivateRoute><TodoMain /></PrivateRoute></MySuspense>
            },
            {
                path: '/songs',
                element: <MySuspense><PrivateRoute><SongMain /></PrivateRoute></MySuspense>
            },
            {
                path: '/social',
                element: <MySuspense><PrivateRoute><SocialFeedPage /></PrivateRoute></MySuspense>
            },
            {
                path: '/social/explore',
                element: <MySuspense><PrivateRoute><ExplorePage /></PrivateRoute></MySuspense>
            },
            {
                path: '/social/notification',
                element: <PrivateRoute><NotificationPage /></PrivateRoute>
            },
            {
                path: '/social/report-a-problem',
                element: <MySuspense><ReportAProblemPage /></MySuspense>
            },
            {
                path: '/social/p/:postId',
                element: <MySuspense><PrivateRoute><PostPage /></PrivateRoute></MySuspense>
            },
            {
                path: '/social/profile/:username',
                element: <MySuspense><PrivateRoute><ProfilePage /></PrivateRoute></MySuspense>
            },
            {
                path: '/social/account/dashboard',
                element: <PrivateRoute><DashboardPage /></PrivateRoute>
            },
            {
                path: '/social/account/edit',
                element: <MySuspense><PrivateRoute><EditProfilePage /></PrivateRoute></MySuspense>,
                children: [
                    {
                        path: '',
                        element: <MySuspense><EditProfile /></MySuspense>
                    },
                    {
                        path: 'password',
                        element: <MySuspense><ChangePassword /></MySuspense>
                    },
                    {
                        path: 'username',
                        element: <MySuspense><ChangeUsername /></MySuspense>
                    },
                    {
                        path: 'email',
                        element: <MySuspense><ChangeEmail /></MySuspense>
                    },
                ]
            },
        ]
    }
])

export default router;
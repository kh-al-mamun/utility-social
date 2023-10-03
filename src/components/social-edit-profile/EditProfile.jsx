import { TextField } from "@mui/material";
import { Avatar, Box, Typography, Button } from "../utils/Imports";
import useUser from "../../hooks/useUser";
import MyBackDrop from "../shared/MyBackDrop";
import { useForm } from "react-hook-form";
import EditProfileName from "./EditProfileName";
import EditProfileWebsite from "./EditProfileWebsite";
import EditProfileBio from "./EditProfileBio";
import EditProfilePhone from "./EditProfilePhone";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../../mutations/user";
import { GET_PUBLIC_PROFILE, GET_USER } from "../../queries/user";
import useSnack from "../../hooks/useSnack";
import uploadProfilePicture from "../../utils/uploadProfilePicture";
import { useState } from "react";

const EditProfile = () => {
    const { makeSnack } = useSnack();
    const { userInfoLoading, _id, image, username, displayName, email, website, bio, phone, refetch } = useUser();
    const { register, handleSubmit, formState: { errors, isValid, isSubmitting, isDirty } } = useForm({ mode: 'onBlur' });
    const [UpdateUser, { loading }] = useMutation(UPDATE_USER);

    const handleProfileUpdate = async (inputs) => {
        try {
            const result = await UpdateUser({
                variables: {
                    userId: _id,
                    updatedDoc: inputs
                },
                refetchQueries: [GET_USER, GET_PUBLIC_PROFILE]
            })
            if (result.data && result.data.updateUser) {
                makeSnack(result.data.updateUser.message, "success");
                refetch();
            }
        } catch (error) {
            makeSnack(error.message, "error")
        }
    }

    if (userInfoLoading) return <MyBackDrop open={true} />
    return (
        <Box component="form" onSubmit={handleSubmit(handleProfileUpdate)}>
            <EditProfilePicture image={image} username={username} userId={_id} makeSnack={makeSnack} />

            <EditProfileName
                register={register}
                defaultValue={displayName}
                boxSettings={boxSettings}
                errors={errors}
            />
            <EditProfileWebsite
                register={register}
                defaultValue={website}
                boxSettings={boxSettings}
                errors={errors}
            />
            <EditProfileBio
                register={register}
                defaultValue={bio}
                boxSettings={boxSettings}
                errors={errors}
            />

            <Box sx={{ ...boxSettings }}>
                <Box></Box>
                <Box>
                    <Typography variant="subtitle1" color="GrayText">Personal Information</Typography>
                    <Typography variant="body1" color="GrayText" fontSize={12} sx={{ display: { xs: 'none', sm: 'block' } }}>
                        Provide personal information even if the account is used for a business, a pet or something else.
                        This won{"'"}t be a part of your public profile.
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ ...boxSettings }}>
                <Typography component="label" textAlign="end" mt={1} sx={{ fontSize: { xs: 14, md: 18 } }}>
                    Email
                </Typography>
                <TextField
                    fullWidth
                    disabled
                    defaultValue={email}
                    type="text"
                    size='small'
                    variant="outlined"
                    title="Email can not be changed"
                    inputProps={{
                        className: 'editor-input',
                        style: { cursor: 'not-allowed' }
                    }}
                />
            </Box>
            <EditProfilePhone
                register={register}
                defaultValue={phone}
                boxSettings={boxSettings}
                errors={errors}
            />

            <Box sx={{ ...boxSettings }}>
                <Box></Box>
                <Button
                    disabled={!isValid || isSubmitting || !isDirty || loading}
                    variant="contained"
                    color="secondary"
                    type="submit"
                >
                    Submit
                </Button>
            </Box>
        </Box>
    );
};

const EditProfilePicture = ({ image, username, userId, makeSnack }) => {
    const [uploading, setUploading] = useState(false);
    const [UpdateUser, { loading }] = useMutation(UPDATE_USER, { refetchQueries: [GET_USER] })

    const handleProfilePhotoUpload = async (event) => {
        setUploading(true);
        try {
            const url = await uploadProfilePicture(event.target.files[0])
            const result = await UpdateUser({
                variables: {
                    userId,
                    updatedDoc: { image: url }
                }
            })
            if (result.data && result.data.updateUser) {
                makeSnack("Profile photo updated", "success")
            }
        } catch (error) {
            makeSnack(error.message, 'error')
        } finally {
            setUploading(false);
        }
    }

    return (
        <Box sx={{ ...boxSettings }}>
            <Avatar src={image} sx={{ width: 60, height: 60, marginLeft: 'auto' }} />
            <div>
                <Typography
                    fontSize={20}
                    fontWeight={500}
                >
                    {username}
                </Typography>
                <Typography
                    component="label"
                    htmlFor="changePicture"
                    fontSize={13}
                    color="#F19F27"
                    sx={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
                >
                    {uploading ? 'Uploading...' : 'Change profile picture'}
                </Typography>
                <input
                    onChange={handleProfilePhotoUpload}
                    disabled={uploading || loading}
                    accept="image/*"
                    id="changePicture"
                    type="file"
                    style={{ width: '0px', overflow: 'hidden' }}
                />
            </div>
        </Box>
    )
}

// export const EditComponent = ({ type = "text", label, defaultValue }) => {
//     const isBio = label === 'Bio';
//     const isEmail = label === 'Email';

//     return (
//         <Box sx={{ ...boxSettings }}>
//             <Typography component="label" htmlFor={label} textAlign="end" mt={1} sx={{ fontSize: { xs: 14, md: 18 } }}>
//                 {label}
//             </Typography>
//             <TextField
//                 fullWidth
//                 variant="outlined"
//                 id={label}
//                 type={type}
//                 disabled={isEmail}
//                 rows={isBio ? 4 : 1}
//                 defaultValue={defaultValue}
//                 multiline={isBio ? true : false}
//                 size={isBio ? "medium" : 'small'}
//                 inputProps={{
//                     className: 'editor-input',
//                     style: isEmail ? { cursor: 'not-allowed' } : {}
//                 }}
//             />
//         </Box>
//     )
// }

const boxSettings = {
    display: 'grid',
    gap: { xs: 2, sm: 4 },
    gridTemplateColumns: '1.4fr 4fr',
    mt: 3
}

export default EditProfile;
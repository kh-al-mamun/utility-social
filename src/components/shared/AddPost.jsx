import { Card, CardMedia } from "@mui/material";
import { Box, Button, IconButton, Typography } from '../utils/Imports'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useEffect, useRef, useState } from "react";
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import useImageUpload from "../../hooks/useImageUpload";
import serialize from "../../utils/serialize";
import useUser from "../../hooks/useUser";
import { useApolloClient, useMutation } from "@apollo/client";
import { ADD_POST } from "../../mutations/posts";
import useSnack from "../../hooks/useSnack";
import { GET_PUBLIC_PROFILE } from "../../queries/user";

const AddPost = ({ closeDialog = null }) => {
    const uploadedRef = useRef([]);
    const { _id } = useUser();
    const { makeSnack } = useSnack();
    const client = useApolloClient();
    const [uploaded, setUploaded] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadImage, { isUploading, isError, error, data }] = useImageUpload();
    const [editor] = useState(() => withReact(createEditor()))
    const [value, setValue] = useState(initialValue);
    const [AddPost, { loading, error: mutationError }] = useMutation(ADD_POST)

    useEffect(() => {
        if (data && data.url) {
            const prev = [...uploadedRef.current];
            uploadedRef.current = [...prev, {
                asset_id: data.asset_id,
                url: data.url,
                width: data.width,
                height: data.height,
                type: data.resource_type,
                format: data.format,
            }];
        }
        setUploaded([...uploadedRef.current])
    }, [data])

    const handleAddPost = async () => {
        const newPost = {
            userId: _id,
            caption: serialize({ children: value }),
            media: uploadedRef.current,
            created_at: Date.now(),
        }

        if (newPost.caption == '<br>' && newPost.media.length === 0) {
            makeSnack("Can't add an empty post", "error")
            return;
        }

        const result = await AddPost({
            variables: { newPost }
        })

        if (result.data && result.data.addPost.insertedId) {
            makeSnack(result.data.addPost.message, "success")
            client.refetchQueries({include: [GET_PUBLIC_PROFILE]})
            if(closeDialog) closeDialog();
        }
    }

    return (
        <Box
            border={1}
            borderRadius={2}
            borderColor="GrayText"
            padding={2}
        >
            <Typography
                variant="h6"
                mb={2}
                sx={{ opacity: .7 }}
            >
                Add a post
            </Typography>
            <Box
                width={55}
                height={55}
                borderRadius="50%"
                component="label"
                htmlFor="uploadPostPhoto"
                display="grid"
                sx={{ placeItems: 'center', cursor: 'pointer', mx: 'auto' }}
            >
                <IconButton sx={{ pointerEvents: 'none', border: 2 }} size="large" disabled>
                    <AddAPhotoIcon fontSize="inherit" />
                </IconButton>
                <input
                    onChange={(e) => { setSelectedImage(e.target.files[0]); uploadImage(e.target.files[0]) }}
                    style={{ width: '0px', overflow: 'hidden' }}
                    type="file"
                    accept="image"
                    id="uploadPostPhoto"
                    name="uploadPostPhoto"
                />
            </Box>

            {/* Shows message on upload and on error */}
            {(isUploading || isError) && (
                <Typography
                    my={1}
                    color={isError ? "#ed7d7d" : "GrayText"}
                    textAlign="center"
                    sx={{ userSelect: 'none' }}
                >
                    {isError ? `${error.message}` : `Uploading ${selectedImage.name}`}
                </Typography>
            )}

            {/* Uploaded images */}
            <Box mt={2} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                {uploaded.map(media => (
                    <Card key={media.asset_id} sx={{ width: 50, position: 'relative' }}>
                        <CardMedia
                            sx={{ height: 50 }}
                            image={media.url}
                        />
                    </Card>
                ))}
            </Box>

            {/* Textarea */}
            <Box sx={uploadedRef.current.length > 0 ? { mt: 1, mb: 2 } : { mt: 3, mb: 2 }}>
                <Slate editor={editor} initialValue={initialValue} onChange={(value) => setValue(value)}>
                    <Editable
                        placeholder="Write here..."
                        style={{ border: '1px solid gray', borderRadius: '5px', minHeight: '120px', padding: '10px', color: 'rgb(184, 178, 178)' }}
                    />
                </Slate>
            </Box>

            {mutationError && (
                <Typography
                    my={1}
                    color="#ed7d7d"
                    textAlign="center"
                    sx={{ userSelect: 'none' }}
                >
                    {mutationError.message}
                </Typography>
            )}

            {/* Submit button */}
            <Button
                onClick={handleAddPost}
                disabled={isUploading || loading}
                fullWidth
                variant="contained"
                color="secondary"
            >
                Add Post
            </Button>
        </Box>
    );
};


const initialValue = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
]

export default AddPost;
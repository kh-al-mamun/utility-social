import { useEffect, useState } from "react";

const initialStatus = {
    isUploading: false,
    success: false,
    isError: false,
    error: undefined,
}

const useImageUpload = () => {
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState(initialStatus);
    const handleImageUpload = (image) => {
        try {
            if (!image) {
                throw new Error(`Requires a image file.`)
            }
            else if (!image.type.startsWith('image/')) {
                throw new Error(`Only images are supported. you are trying to upload a ${image.type.split('/')[0]}.`)
            }
            setImage(image)
        } 
        catch (error) {
            setStatus({
                isUploading: false,
                success: false,
                isError: true,
                error,
            })
        }
    };

    useEffect(() => {
        if (image) {
            (async () => {
                setStatus({
                    isUploading: true,
                    success: false,
                    isError: false,
                    error: undefined
                })
                try {
                    const data = new FormData();
                    data.append('file', image);
                    data.append('upload_preset', 'utility-social');
                    data.append('cloud_name', 'ahmedwakil66');
                    const response = await fetch('https://api.cloudinary.com/v1_1/ahmedwakil66/image/upload', {
                        method: 'POST',
                        accept: 'application/json',
                        body: data,
                    })
                    const result = await response.json();
                    
                    if(result.error) {
                        throw new Error(result.error.message)
                    }
                    
                    setImage(null);
                    setStatus({
                        isUploading: false,
                        success: true,
                        isError: false,
                        error: undefined,
                        data: result,
                    });
                }
                catch (error) {
                    setImage(null);
                    setStatus({
                        isUploading: false,
                        success: false,
                        isError: true,
                        error,
                    });
                }
            })()
        }
    }, [image])

    return [handleImageUpload, status]
};

export default useImageUpload;
const uploadProfilePicture = async (image) => {
    if(!image.type.startsWith('image/')) {
        throw new Error(`Only images are supported. you are trying to upload a ${image.type.split('/')[0]}.`)
    }
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'profile-pictures');
    data.append('cloud_name', 'ahmedwakil66');
    const response = await fetch('https://api.cloudinary.com/v1_1/ahmedwakil66/image/upload', {
        method: 'POST',
        accept: 'application/json',
        body: data,
    })
    const result = await response.json();
    console.log('api result', result);
    return result.url;
}

export default uploadProfilePicture;
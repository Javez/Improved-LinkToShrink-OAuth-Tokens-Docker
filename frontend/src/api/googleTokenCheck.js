const isGoogleTokenValid = async (token) => {
    try {
        const response = await fetch(
            `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
        );
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

export default isGoogleTokenValid;

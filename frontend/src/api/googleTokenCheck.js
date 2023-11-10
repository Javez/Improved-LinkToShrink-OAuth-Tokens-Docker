async function isGoogleTokenValid(id_token) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`
    );
    const data = await response.json();

    if (data.error_description) {
      console.error(data.error_description);
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("An error occurred while validating the token:", error);
    return false;
  }
}
export default isGoogleTokenValid;

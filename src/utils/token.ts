// Generates random number token, then transfored to string
export const generateToken = () => Math.floor(100000 + Math.random() * 900000).toString()
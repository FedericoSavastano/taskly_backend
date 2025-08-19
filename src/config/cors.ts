import { CorsOptions } from 'cors'

//Allows that the npm run dev:api command can use unlisted frontend urls

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
        const whitelist = [process.env.FRONTEND_URL]

        if(process.argv[2] === '--api') {
            whitelist.push(undefined)
        }

        if(whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('CORS Error'))
        }
    }
}
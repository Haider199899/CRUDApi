import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../model/user.model';
dotenv.config();

const NAMESPACE = 'Auth';

const signJWT = (user:IUser, callback: (error: Error | null, token: string | null) => void): void => {
    var timeSinceEpoch = new Date().getTime();
    var expirationTime = timeSinceEpoch + Number(process.env.SERVER_TOKEN_EXPIRETIME) * 100000;
    var expirationTimeInSeconds = Math.floor(expirationTime / 1000);

    console.log(NAMESPACE, `Attempting to sign token for ${user._id}`);

    try {
        jwt.sign(
            {
                email:user.email
            },
            'superSecret',
            {
                issuer: 'superIssuer',
                algorithm: 'HS256',
                expiresIn: expirationTimeInSeconds
            },
            (error, token) => {
                if (error) {
                    callback(error, null);
                } else if (token) {
                    callback(null, token);
                }
            }
        );
    } catch (error:any) {
        console.error(NAMESPACE, error.message, error);
        callback(error, null);
    }
};

export default signJWT;
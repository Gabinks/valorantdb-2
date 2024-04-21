import * as jwt from 'jsonwebtoken'
export function checkTokenExpiration(token){
    if(!token){
        return {expired: true};
    }
    try {
        const decodedToken = jwt.decode(token);
        if (decodedToken!.exp * 1000 < Date.now()) {
            return {expired: true};
        }
    } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
        return {expired: true};
    }
}
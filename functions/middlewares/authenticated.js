const admin = require("firebase-admin");
module.exports = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        res.status(403).send('Unauthorized');
        return;
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        res.locals.email = decodedIdToken.email;
        next();
    } catch (e) {
        res.status(403).send('Unauthorized');
    }
}
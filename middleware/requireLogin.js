// Verifica se o usuário está conectado
module.exports = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
};

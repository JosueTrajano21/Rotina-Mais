// aqui fica login, registro, logout.

exports.showLogin = (req, res) => {
  res.render("login", { titulo: "Login", css: 'login.css'  });
};


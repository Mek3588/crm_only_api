// app.use((err, req, res, next) => {
//     console.error(err);

//     if (err instanceof URIError) {
//         return res.status(400).json({ error: "Invalid request" });
//     }

//     // Handle other types of errors as needed
//     return res.status(500).json({ error: "Internal server error" });
// });
// const setupCSRFMiddleware = async (app) => {
//     // const csrfProtect = csrf({ cookie: true });
//     // app.use(cookieParser());
//     // app.use( csrfProtect);
// }

// const syntaxErrorMiddleware = async (req, res, next) => {
//     if (err instanceof SyntaxError) {
//         return res.status(400).json({ error: "Syntax error in request" });
//     }
//     if (err instanceof URIError) {
//         return res.status(400).json({ error: "Invalid request" });
//     }

//     // Handle other types of errors as needed
//     return res.status(500).json({ error: "Internal server error" });
// };
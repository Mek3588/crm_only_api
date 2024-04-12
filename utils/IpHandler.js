const getRequestIP = async (req) => {
    let ip = req.socket.remoteAddress || req.headers['x-forwarded-for'];
    if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7)
    }
    try {
        return ip;
    }
    catch (error) {
        return error;

    }
};

export default { getRequestIP }; 
module.exports.getMongoDBUrl = function (username, password) {
    return `mongodb+srv://${username}:${password}@cluster0.n6kmy75.mongodb.net/?retryWrites=true&w=majority`;
};

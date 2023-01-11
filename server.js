require('dotenv').config();

const app = require('./app');
const connectDB = require('./src/db/connect');

const port = process.env.PORT || 3030;


const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		app.listen(port);
        console.log("Db connected and app listening on port " + port)
	} catch (error) {
		console.log(error);
	}
};

start();

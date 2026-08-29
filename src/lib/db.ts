import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		if (mongoose.connections[0].readyState) {
			console.log('Database already connected');
			return;
		}

	await mongoose.connect(process.env.MONGO_URI!, {
		dbName: process.env.DB_NAME || 'Recruitment',
	});

		console.log('MongoDB connected successfully');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		throw error;
	}
};

export default connectDB;
import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		if (mongoose.connections[0]?.readyState) {
			console.log('Database already connected');
			return;
		}

		const mongoUri = process.env.MONGO_URI;
		if (!mongoUri) {
			throw new Error(
				'MongoDB connection string is missing. Set MONGO_URI or MONGODB_URI in your environment.'
			);
		}

		await mongoose.connect(mongoUri, {
			dbName: process.env.DB_NAME || 'Recruitment',
		});

		console.log('MongoDB connected successfully');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		throw error;
	}
};

export default connectDB;
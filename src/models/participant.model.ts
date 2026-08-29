import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	registrationNumber: {
		type: String,
		required: true,
		unique: true,
	},
	phone: {
		type: String,
		required: true,
	},
	year: {
		type: String,
		required: true,
	},
	domain: {
		type: String,
		required: true,
	},
	degreeWithBranch: {
		type: String,
		required: true,
	},
	links: {
		github: {
			type: String,
			default: null,
		},
		demo: {
			type: String,
			default: null,
		},
		deployment: {
			type: String,
			default: null,
		},
	},
	status: {
		type: String,
		enum: [
			'registered',
			'taskSubmitted',
			'interviewShortlisted',
			'onboarding',
		],
		default: 'registered',
	},
});

participantSchema.index({ domain: 1, year: 1 });
participantSchema.index({ status: 1 });
participantSchema.index({ name: 'text' });
participantSchema.index({ email: 1 }, { unique: true });
participantSchema.index({ registrationNumber: 1 }, { unique: true });

const ParticipantUser = mongoose.models.recruitment26 || mongoose.model('recruitment26', participantSchema);

export default ParticipantUser;
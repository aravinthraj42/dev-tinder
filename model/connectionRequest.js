const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['accepted', 'rejected', 'interested', 'blocked', 'ignored'],
            message: '{VALUE} is not a valid status'
        },
            // default: 'pending'
    },
}, {
    timestamps: true
   }
);
// Compound index to ensure unique connection requests between users
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
 
connectionRequestSchema.pre('save', function () {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error('Cannot send connection request to yourself');
    }
});
const ConnectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequestModel;
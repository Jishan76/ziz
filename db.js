const mongoose = require('mongoose');

const { Schema } = mongoose;
mongoose.set('strictQuery', false);

// Define the schema
const threadSchema = new Schema({
  threadId: { type: String, required: true, unique: true },
  approved: { type: Boolean, default: false },
  approvalMessage: { type: String, default: "You're not allowed to use this command. This command requires approval." } // Default approval message
});

// Define the model with the collection name
const Thread = mongoose.model('Thread', threadSchema, 'approvedThreads'); // Specify the collection name

// Define default approval message constant
const DEFAULT_APPROVAL_MESSAGE = "You're not allowed to use this command. This command requires approval.";

module.exports = { Thread, DEFAULT_APPROVAL_MESSAGE };

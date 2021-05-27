const schema = mongoose.Schema({
    guildID: String,
    userID: String,
    username: String,

    roles: Array,
    level: { type: Number, default: 1 },
    nextLevel: { type: Number, default: 110 },
    xp: { type: Number, default: 0 },
    messages: { type: Number, default: 0 },
    warn: { type: Number, default: 0 },
    mute: { type: Boolean, default: false },
    unmute: { type: Number, default: 0 },
    _time: { type: Number, default: 0 }
});
module.exports = mongoose.model("User", schema)
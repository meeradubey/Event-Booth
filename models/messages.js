module.exports = (sequelize, DataTypes) => {
    const message_blob = sequelize.define("message_blob", {
        // email_invite_id: DataTypes.INTEGER,
        video_blob_id: DataTypes.STRING,
    });
    return message_blob;
};
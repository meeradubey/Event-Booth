module.exports = (sequelize, DataTypes) => {
    const email_invite = sequelize.define("email_invite", {
      invite_name: DataTypes.STRING,
      invite_email: DataTypes.STRING,
      event_id: DataTypes.INTEGER
    });
    return email_invite;
  };
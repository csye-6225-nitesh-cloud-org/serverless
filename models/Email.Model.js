const db = require('./index')
const { DataTypes } = require('sequelize');

const EmailLog = db.sequelize.define('EmailLog', {
    email_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    verificationLink: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    sentDate:{
        type: DataTypes.DATE,
        allowNull: true
    },
    messageId: {
        type: DataTypes.STRING,
        allowNull: true
    },
   
}, {
    timestamps: true
});

module.exports = EmailLog ;

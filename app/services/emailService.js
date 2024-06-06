const nodemailerService = require('../utils/nodemailerService');

const emailService = {};

emailService.sendTaskNotification = async (to, subject, body) => {
    try {
        await nodemailerService.sendEmail(to, subject, body);
        console.log('Email notification sent successfully.');
    } catch (error) {
        console.error('Error sending email notification:', error);
        throw new Error('Failed to send email notification');
    }
};

module.exports = emailService;

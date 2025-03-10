export const withdrawalRejected = `
<div class="container">
    <div class="header">
        <h2 style="color: #ff6636">Withdrawal Failed 😞</h2>
    </div>
    <div class="content">
        <p>Hello <strong>{{TEACHER_NAME}}</strong>,</p>
        <p>We regret to inform you that your withdrawal request could not be processed. 🚫</p>
        <p><strong>Amount: </strong> {{AMOUNT}}</p>
        <p><strong>Request Time: </strong> {{TRANSACTION_DATE}}</p>
        <p>Please check your bank account details and try again. 🏦</p>
        <p>If you have any questions, please contact <a href="mailto:{{EMAIL_USERNAME}}" style="color: #ff6636; text-decoration: none;">{{EMAIL_USERNAME}}</a>. 📧</p>
        <p>Thank you for being with <strong>BrainBox Platform</strong>! 🙏</p>
    </div>
</div>
`;

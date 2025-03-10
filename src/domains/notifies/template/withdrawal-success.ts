export const withdrawalSuccess = `
<div class="container">
    <div class="header">
        <h2 style="color: #ff6636">Withdrawal Successful! 🎉</h2>
    </div>
    <div class="content">
        <p>Hello <strong>{{TEACHER_NAME}}</strong>,</p>
        <p>Congratulations! Your withdrawal request has been successfully processed. ✅</p>
        <p><strong>Amount: </strong> {{AMOUNT}} 💰</p>
        <p><strong>Processing Time: </strong> {{TRANSACTION_DATE}} ⏰</p>
        <p>This amount has been transferred to your bank account. 🏦</p>
        <p>If you have any questions, please contact <a href="mailto:{{EMAIL_USERNAME}}" style="color: #ff6636; text-decoration: none;">{{EMAIL_USERNAME}}</a>. 📧</p>
        <p>Thank you for being with <strong>BrainBox Platform</strong>! 🙏</p>
    </div>
</div>
`;

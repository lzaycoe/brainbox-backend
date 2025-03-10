export const emailSignature = `
<hr style="border: 0; border-top: 1px solid #ddd;">
<table style="font-family: Arial, sans-serif; font-size: 14px; color: #333; border-collapse: collapse; width: 100%; max-width: 500px;">
  <tr>
    <td style="padding: 10px; vertical-align: middle;">
      <img src="https://res.cloudinary.com/dmggkeyon/image/upload/v1741569119/rsyf1u7bwviuxbfjv91h.png" alt="BrainBox Logo" style="border-radius: 8px; width: 80px; height: 80px;">
    </td>
    <td style="padding: 10px; vertical-align: middle;">
      <strong style="font-size: 16px; color: #ff6636;">BrainBox Platform</strong><br>
      <span style="color: #555;">E-learning Platform</span><br>
      <a href="mailto:{{EMAIL_USERNAME}}" style="color: #ff6636; text-decoration: none;">{{EMAIL_USERNAME}}</a><br>
      <a href="{{FRONTEND_URL}}" style="color: #ff6636; text-decoration: none;">{{FRONTEND_URL}}</a>
    </td>
  </tr>
</table>
<div class="footer">
    <p>&copy; 2025 BrainBox Platform. All rights reserved.</p>
</div>
`;

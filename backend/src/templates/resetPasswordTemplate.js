const resetPasswordTemplate = (resetLink) => {
  return `
<!DOCTYPE html>
<html>
<head>
<style>
body{
  font-family:Arial,sans-serif;
  background:#f5f7fb;
  padding:40px;
}
.container{
  max-width:600px;
  margin:auto;
  background:#fff;
  border-radius:12px;
  padding:40px;
}
.btn{
  display:inline-block;
  padding:14px 28px;
  background:#4f46e5;
  color:#fff !important;
  text-decoration:none;
  border-radius:8px;
}
</style>
</head>

<body>

<div class="container">

<h2>Reset Your Password</h2>

<p>Click the button below to reset your password.</p>

<a class="btn" href="${resetLink}">
Reset Password
</a>

<p>This link expires in <b>15 minutes</b>.</p>

</div>

</body>
</html>
`;
};

export default resetPasswordTemplate;

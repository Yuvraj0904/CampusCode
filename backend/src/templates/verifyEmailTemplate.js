const verifyEmailTemplate = (verifyLink) => {
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
  background:#16a34a;
  color:#fff !important;
  text-decoration:none;
  border-radius:8px;
}
</style>
</head>

<body>

<div class="container">

<h2>Verify Your Email</h2>

<p>Welcome to CampusCode.</p>

<p>Please verify your email by clicking the button below.</p>

<a class="btn" href="${verifyLink}">
Verify Email
</a>

<p>This link expires in <b>15 minutes</b>.</p>

</div>

</body>
</html>
`;
};

export default verifyEmailTemplate;

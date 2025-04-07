<?php
session_start();

// Configuration
$BACKEND_URL = 'http://localhost:3000';

// Check if already logged in
if (isset($_COOKIE['access_token'])) {
    header('Location: dashboard.php');
    exit();
}

// Handle potential error messages
$error = isset($_GET['error']) ? htmlspecialchars($_GET['error']) : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Authentication Demo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
            background-color: #f0f2f5;
        }
        .login-container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .login-btn {
            background-color: #4285F4;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }
        .login-btn:hover {
            background-color: #3367D6;
        }
        .error-message {
            color: red;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>Authentication Demo</h1>
        
        <?php if (!empty($error)): ?>
            <div class="error-message">
                <?php echo $error; ?>
            </div>
        <?php endif; ?>

        <h2>Login with Google</h2>
        <a href="<?php echo $BACKEND_URL; ?>/auth/google" class="login-btn">
            Continue with Google
        </a>
    </div>
</body>
</html>
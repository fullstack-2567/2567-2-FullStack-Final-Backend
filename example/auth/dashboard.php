<?php
session_start();

// Configuration - Replace with your actual backend URL
$BACKEND_URL = 'http://localhost:3000';

// Function to check if user is logged in
function isLoggedIn() {
    return isset($_COOKIE['access_token']);
}

// Function to get current user
function getCurrentUser() {
    if (!isLoggedIn()) {
        return null;
    }

    $ch = curl_init("{$GLOBALS['BACKEND_URL']}/auth/me");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $_COOKIE['access_token']
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        $userData = json_decode($response, true);
        return $userData['data'];
    }

    return null;
}

// Redirect to login if not authenticated
if (!isLoggedIn()) {
    header('Location: login.php');
    exit();
}

// Handle logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    // Make logout request to backend
    $ch = curl_init("{$BACKEND_URL}/auth/logout");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $_COOKIE['access_token']
    ]);

    curl_exec($ch);
    curl_close($ch);

    // Clear cookies
    setcookie('access_token', '', time() - 3600, '/', '', true, true);
    setcookie('refresh_token', '', time() - 3600, '/', '', true, true);

    // Redirect to login
    header('Location: login.php');
    exit();
}

// Get current user
$user = getCurrentUser();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Dashboard</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
            background-color: #f0f2f5;
        }
        .dashboard-container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .user-info {
            margin-bottom: 20px;
        }
        .logout-btn {
            background-color: #DB4437;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <?php if ($user): ?>
            <div class="user-info">
                <h1>Welcome, <?php echo htmlspecialchars($user['name']); ?></h1>
                <p>Email: <?php echo htmlspecialchars($user['email']); ?></p>
                <p>Role: <?php echo htmlspecialchars($user['role']); ?></p>
                <p>Created At: <?php echo htmlspecialchars($user['created_at']); ?></p>
            </div>
            <a href="?action=logout" class="logout-btn">Logout</a>
        <?php else: ?>
            <p>Unable to retrieve user information</p>
            <a href="login.php" class="logout-btn">Back to Login</a>
        <?php endif; ?>
    </div>
</body>
</html>
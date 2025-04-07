<?php
session_start();

// Configuration - Replace with your actual backend URL
$BACKEND_URL = 'http://localhost:3000';

// Function to log errors
function logError($message) {
    error_log('[OAUTH CALLBACK] ' . $message);
}

// Check if this is a callback from Google
if (!isset($_GET['code'])) {
    logError('No authorization code received');
    header('Location: login.php?error=Authorization failed');
    exit();
}

// Attempt to exchange the code for tokens
try {
    // Initialize cURL
    $ch = curl_init("{$BACKEND_URL}/auth/google/callback");
    
    // Set cURL options to follow redirect
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    // Execute the request
    $response = curl_exec($ch);
    
    // Check for cURL errors
    if (curl_errno($ch)) {
        throw new Exception('cURL error: ' . curl_error($ch));
    }
    
    // Get HTTP status code
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    // Close cURL
    curl_close($ch);
    
    // Log the response and status code for debugging
    logError('Response: ' . $response);
    logError('HTTP Status Code: ' . $httpCode);
    
    // Check if authentication was successful
    if ($httpCode === 302 || isset($_COOKIE['access_token'])) {
        // Redirect to dashboard
        header('Location: dashboard.php');
        exit();
    } else {
        // Authentication failed
        throw new Exception('Authentication failed');
    }
} catch (Exception $e) {
    // Log the error
    logError($e->getMessage());
    
    // Redirect back to login with error
    header('Location: login.php?error=' . urlencode($e->getMessage()));
    exit();
}
?>
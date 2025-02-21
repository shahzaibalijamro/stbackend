const express = require('express');
const router = express.Router();
const { 
    createEmploye, 
    login, 
    getUser, 
    getAllUsers, 
    editUser, 
    deleteUser 
} = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth'); // Ensure you are destructuring `auth` and `adminAuth` correctly

// User Routes

// @route   POST /api/auth/addemploye
// @desc    Register a user
// @access  Public
router.post('/addemploye', createEmploye);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/user
// @desc    Get user info
// @access  Private
router.get('/user', getUser);  // `auth` middleware to protect the route

// @route   GET /api/auth/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', getAllUsers);  // `adminAuth` middleware to ensure only admins can access

// @route   PUT /api/auth/edituser/:id
// @desc    Edit user info
// @access  Private/Admin
router.put('/edituser/:id', editUser);  // `adminAuth` middleware for admin-only access

// @route   DELETE /api/auth/user/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/user/:id', deleteUser);  // `adminAuth` middleware for admin-only access

module.exports = router;

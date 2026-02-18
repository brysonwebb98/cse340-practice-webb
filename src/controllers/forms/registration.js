import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';

const router = Router();

/**
 * Validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),
    body('emailConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Email addresses must match'),
    body('password')
        .isLength({ min: 8 })
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain at least one special character'),
    body('passwordConfirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords must match')
];

/**
 * Display the registration form page.
 */
const showRegistrationForm = (req, res) => {
    // TODO: Render the registration form view (forms/registration/form)
    // TODO: Pass title: 'User Registration' in the data object
    res.render('forms/registration/form', {
        title : 'User Registration'
    });
};

/**
 * Handle user registration with validation and password hashing.
 */
const processRegistration = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Store each validation error as a separate flash message
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/register');
    }    

    try {
        const { name, email, password } = req.body;
        // Check if email already exists in database
        // TODO: Call emailExists(email) and store the result in a variable
        const exists = await emailExists(email);

        if (exists) {
            req.flash('warning', 'An account with that email already exists. Please log in instead.');
            return res.redirect('/register');
        }

        // Hash the password before saving to database
        // TODO: Use bcrypt.hash(password, 10) to hash the password
        // TODO: Store the result in a variable called hashedPassword
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Save user to database with hashed password
        // TODO: Call saveUser(name, email, hashedPassword)
        await saveUser(name, email, hashedPassword);

        // TODO: Log success message to console
        // TODO: Redirect to /register/list to show successful registration
        // NOTE: Later when we add authentication, we'll change this to require login first
        req.flash('success', 'Registration successful! Please log in!');
        return res.redirect('/login');
    } catch (error) {
        // TODO: Log the error to console
        // TODO: Redirect back to /register
        console.error('Error processing registration:', error);
        req.flash('error', 'Registration failed. Please try again later.');
        return res.redirect('/register');
    }
};

const showAllUsers = async (req, res) => {
    // Initialize users as empty array
    let users = [];

    try {
        // TODO: Call getAllUsers() and assign to users variable
        users = await getAllUsers()
    } catch (error) {
        // TODO: Log the error to console
        // users remains empty array on error
        console.log(error);
        users = [];
    }

    // TODO: Render the users list view (forms/registration/list)
    // TODO: Pass title: 'Registered Users' and the users variable in the data object
    res.render('forms/registration/list', {
        title: 'Registered Users',
        users: users
    })
};

/**
 * GET /register - Display the registration form
 */
router.get('/', showRegistrationForm);
/**
 * POST /register - Handle registration form submission with validation
 */
router.post('/', registrationValidation, processRegistration,
    [
        body('name')
            .trim()
            .isLength({min: 2, max:100})
            .withMessage('Name must be between 2 and 100 characters')
            .matches(/^[a-zA-Z\s'-]+$/)
            .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),
        body('email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .isLength({max:255})
            .withMessage('Email address is too long'),
        body('password')
            .isLength({min: 8, max: 128})
            .withMessage('Password must be between 8 and 128 characters')
            .matches(/[0-9]/)
            .withMessage('Password must contain a number')
            .matches(/[a-z]/)
            .withMessage('Password must contain at least one lowercase letter')
            .matches(/[A-Z]/)
            .withMessage('Password must contain at least one uppercase letter')
            .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
            .withMessage('Password must contain a special character')

    ]
);
/**
 * GET /register/list - Display all registered users
 */
router.get('/list', showAllUsers);
export default router;
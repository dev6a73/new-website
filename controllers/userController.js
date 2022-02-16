var Users = require('../models/user_model');

var async = require('async');

const { body,validationResult } = require('express-validator');

exports.index = function(req, res) {
    async.parallel({
        user_count: function(callback) {
            Users.countDocuments({}, callback);
        },}, function(err, results) {
            res.render('index', { title: 'Title', error: err, data: results });
    });
};

// Display list of all Users.
exports.users_list = function(req, res, next) {

    Users.find()
      .sort([['username', 'ascending']])
      .exec(function (err, list_users) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('users_list', { title: 'List of users', user_list: list_users });
    });
  
};  
  
// Display detail page for a specific Users.
exports.users_detail = function(req, res, next) {

    async.parallel({
        users: function(callback) {
            Users.findById(req.params.id)
            .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.users==null) { // No results.
            var err = new Error('Users not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('users_detail', { title: 'Users Detail', users: results.users} );
    });

};

// Display Users create form on GET.
exports.users_create_get = function(req, res, next) {
    res.render('users_form', { title: 'Sign up'});
};

// Handle Users create on POST.
exports.users_create_post = [

    // Validate and sanitize fields.
    body('username').trim().isLength({ min: 1 }).escape().withMessage('username must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('password').trim().isLength({ min: 1 }).escape().withMessage('password must be specified.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('users_form', { title: 'Sign up', users: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Users object with escaped and trimmed data.
            var users = new Users(
                {
                    username: req.body.username,
                    password: req.body.password,
                });
            users.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new users record.
                res.redirect(users.url);
            });
        }
    }
];

// Display Users login form on GET.
exports.users_login_get = function(req, res, next) {
    res.render('users_login', { title: 'Log in'});
};

// Handle Users login on POST.
exports.users_login_post = [

    // Validate and sanitize fields.
    body('username').trim().isLength({ min: 1 }).escape().withMessage('username must be specified.'),
    body('password').trim().isLength({ min: 1 }).escape().withMessage('password must be specified.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('users_login', { title: 'Log in', users: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Users object with escaped and trimmed data.
            var users
            users.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new users record.
                res.redirect(users.url);
            });
        }
    }
];

// Display Users delete form on GET.
exports.users_delete_get = function(req, res, next) {

    async.parallel({
        users: function(callback) {
            Users.findById(req.params.id).exec(callback)
        },
        users_books: function(callback) {
            Book.find({ 'users': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.users==null) { // No results.
            res.redirect('/catalog/users');
        }
        // Successful, so render.
        res.render('users_delete', { title: 'Delete this account', users: results.users, users_books: results.users_books } );
    });

};

// Handle Users delete on POST.
exports.users_delete_post = function(req, res, next) {

    async.parallel({
        users: function(callback) {
        Users.findById(req.body.usersid).exec(callback)
        },
        users_books: function(callback) {
        Book.find({ 'users': req.body.usersid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.users_books.length > 0) {
            // Users has books. Render in same way as for GET route.
            res.render('users_delete', { title: 'Delete this account', users: results.users, users_books: results.users_books } );
            return;
        }
        else {
            // Users has no books. Delete object and redirect to the list of users.
            Users.findByIdAndRemove(req.body.usersid, function deleteUsers(err) {
                if (err) { return next(err); }
                // Success - go to users list
                res.redirect('/catalog/users')
            })
        }
    });
};

// Display Users update form on GET.
exports.users_update_get = function (req, res, next) {

    Users.findById(req.params.id, function (err, users) {
        if (err) { return next(err); }
        if (users == null) { // No results.
            var err = new Error('Users not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('users_form', { title: 'Update the account', users: users });

    });
};

// Handle Users update on POST.
exports.users_update_post = [

    // Validate and santize fields.
    body('username').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('password').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Users object with escaped and trimmed data (and the old id!)
        var users = new Users(
            {
                username: req.body.username,
                password: req.body.password,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('users_form', { title: 'Update the account', users: users, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Users.findByIdAndUpdate(req.params.id, users, {}, function (err, theusers) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(theusers.url);
            });
        }
    }
];

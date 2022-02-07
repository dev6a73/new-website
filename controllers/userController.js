var User = require('../models/user_model');

var async = require('async');

const { body,validationResult } = require('express-validator');

exports.index = function(req, res) {
    res.send("redirect")
};

// Display list of all users.
exports.user_list = function(req, res, next) {

    User.find({}, 'username')
        .sort({title : 1})
        .populate('username')
        .exec(function (err, list_users) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('user_list', { title: 'User List', user_list: list_users });
      });
  
  };
  

// Display detail page for a specific user.
exports.user_detail = function(req, res, next) {

    async.parallel({
        user: function(callback) {

            User.findById(req.params.id)
              .populate()
              .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.user==null) { // No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('user_detail', { title: results.user.title, user: results.user, user_instances: results.user_instance } );
    });

};

// Display user create form on GET.
exports.user_create_get = function(req, res, next) {

    // Get all authors and genres, which we can use for adding to our user.
    async.parallel({
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('user_form', { title: 'Create User'});
    });

};

// Handle user create on POST.
exports.user_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        next();
    },

    // Validate and sanitize fields.
    body('username', 'Username must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('password', 'Password must not be empty.').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a User object with escaped and trimmed data.
        var user = new User(
          { username: req.body.username,
            password: req.body.password,
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
            }, function(err, results) {
                if (err) { return next(err); }
                res.render('user_form', { title: 'Create User', user: user, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save user.
            user.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new user record.
                   res.redirect(user.url);
                });
        }
    }
];

// Display user delete form on GET.
exports.user_delete_get = function(req, res, next) {

    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).populate('author').populate('genre').exec(callback);
        },
        user_userinstances: function(callback) {
            UserInstance.find({ 'user': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.user==null) { // No results.
            res.redirect('/catalog/users');
        }
        // Successful, so render.
        res.render('user_delete', { title: 'Delete User', user: results.user, user_instances: results.user_userinstances } );
    });

};

// Handle user delete on POST.
exports.user_delete_post = function(req, res, next) {

    // Assume the post has valid id (ie no validation/sanitization).

    async.parallel({
        user: function(callback) {
            User.findById(req.body.id).populate('author').populate('genre').exec(callback);
        },
        user_userinstances: function(callback) {
            UserInstance.find({ 'user': req.body.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.user_userinstances.length > 0) {
            // User has user_instances. Render in same way as for GET route.
            res.render('user_delete', { title: 'Delete User', user: results.user, user_instances: results.user_userinstances } );
            return;
        }
        else {
            // User has no UserInstance objects. Delete object and redirect to the list of users.
            User.findByIdAndRemove(req.body.id, function deleteUser(err) {
                if (err) { return next(err); }
                // Success - got to users list.
                res.redirect('/catalog/users');
            });

        }
    });

};

// Display user update form on GET.
exports.user_update_get = function(req, res, next) {

    // Get user, users and genres for form.
    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).populate('user').populate('genre').exec(callback);
        },
        users: function(callback) {
            Author.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.user==null) { // No results.
                var err = new Error('User not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected genres as checked.
            for (var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
                for (var user_g_iter = 0; user_g_iter < results.user.genre.length; user_g_iter++) {
                    if (results.genres[all_g_iter]._id.toString()===results.user.genre[user_g_iter]._id.toString()) {
                        results.genres[all_g_iter].checked='true';
                    }
                }
            }
            res.render('user_form', { title: 'Update User', users: results.users, genres: results.genres, user: results.user });
        });

};

// Handle user update on POST.
exports.user_update_post = [

    // Convert the genre to an array
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate and sanitize fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a User object with escaped/trimmed data and old id.
        var user = new User(
          { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (user.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('user_form', { title: 'Update User',authors: results.authors, genres: results.genres, user: user, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            User.findByIdAndUpdate(req.params.id, user, {}, function (err,theuser) {
                if (err) { return next(err); }
                   // Successful - redirect to user detail page.
                   res.redirect(theuser.url);
                });
        }
    }
];

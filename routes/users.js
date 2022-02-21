var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/userController');

// GET catalog home page.
router.get('/', user_controller.index);

// GET request for list of all user items.
router.get('/lists?', user_controller.users_list);

router.get('/login', user_controller.users_login_get);

router.post('/login', user_controller.users_login_post);

// GET request for creating a user. NOTE This must come before routes that display user (uses id).
router.get('/create', user_controller.users_create_get);

// POST request for creating user.
router.post('/create', user_controller.users_create_post);

// GET request to delete user.
router.get('/:id/delete', user_controller.users_delete_get);

// POST request to delete user.
router.post('/:id/delete', user_controller.users_delete_post);

// GET request to update user.
router.get('/:id/update', user_controller.users_update_get);

// POST request to update user.
router.post('/:id/update', user_controller.users_update_post);

// GET request for one user.
router.get('/:id', user_controller.users_detail);


module.exports = router;

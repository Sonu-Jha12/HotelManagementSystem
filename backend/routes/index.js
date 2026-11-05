const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const crud = require('../controllers/crudController');
const auth = require('../controllers/authController');
const booking = require('../controllers/bookingController');
const stats = require('../controllers/statsController');
const Room = require('../models/Room');
const Guest = require('../models/Guest');

const rooms = crud(Room, { beforeDelete: id => booking.guard('room', id) });
const guests = crud(Guest, { beforeDelete: id => booking.guard('guest', id) });

router.post('/auth/login', auth.login);
router.use(protect);

router.get('/stats', stats.dashboard);

router.get('/rooms/available', booking.availableRooms);
router.route('/rooms').get(rooms.list).post(rooms.create);
router.route('/rooms/:id').get(rooms.get).put(rooms.update).delete(adminOnly, rooms.remove);

router.route('/guests').get(guests.list).post(guests.create);
router.route('/guests/:id').get(guests.get).put(guests.update).delete(adminOnly, guests.remove);

router.route('/bookings').get(booking.list).post(booking.create);
router.patch('/bookings/:id/status', booking.setStatus);
router.post('/bookings/:id/payments', booking.addPayment);
router.route('/bookings/:id/services').get(booking.listServices).post(booking.addService);
router.delete('/bookings/:id', adminOnly, booking.remove);

router.route('/users').get(adminOnly, auth.listUsers).post(adminOnly, auth.createUser);
router.delete('/users/:id', adminOnly, auth.removeUser);

module.exports = router;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler, HttpError } = require('../middleware/error');

const sign = u => jwt.sign({ id: u._id, name: u.name, role: u.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: (req.body.email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) throw HttpError(401, 'Wrong email or password');
  res.json({ token: sign(user), user: { name: user.name, role: user.role } });
});
exports.listUsers = asyncHandler(async (req, res) => res.json(await User.find().select('-password')));
exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!password || password.length < 6) throw HttpError(400, 'Password needs at least 6 characters');
  const u = await User.create({ name, email, role, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ _id: u._id, name: u.name, email: u.email, role: u.role });
});
exports.removeUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) throw HttpError(400, 'You cannot delete your own account');
  await User.findByIdAndDelete(req.params.id); res.json({ ok: true });
});
exports.seedAdmin = async () => {
  if (await User.exists({ role: 'admin' })) return;
  await User.create({ name: 'Admin', email: process.env.ADMIN_EMAIL, role: 'admin', password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10) });
  console.log('Admin created:', process.env.ADMIN_EMAIL);
};

const { asyncHandler } = require('../middleware/error');
// Builds list/get/create/update/remove controllers for any model
module.exports = (Model, { beforeDelete } = {}) => ({
  list: asyncHandler(async (req, res) => res.json(await Model.find().sort('-createdAt'))),
  get: asyncHandler(async (req, res) => res.json(await Model.findById(req.params.id))),
  create: asyncHandler(async (req, res) => res.status(201).json(await Model.create(req.body))),
  update: asyncHandler(async (req, res) =>
    res.json(await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }))),
  remove: asyncHandler(async (req, res) => {
    if (beforeDelete) await beforeDelete(req.params.id);
    await Model.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  })
});

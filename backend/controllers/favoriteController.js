import User from '../models/user.model.js';

export const getFavorites = async (req, res) => {
  const user = await User.findById(req.user.id).populate({ path: 'favoriteServices', populate: [{ path: 'expertId', populate: { path: 'userId', select: 'name email' } }, { path: 'categoryId', select: 'name slug' }] }).select('favoriteServices');
  return res.json({ success: true, data: user?.favoriteServices || [] });
};

export const addFavorite = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, { $addToSet: { favoriteServices: req.params.serviceId } }, { new: true }).select('favoriteServices');
  return res.json({ success: true, data: user.favoriteServices });
};

export const removeFavorite = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, { $pull: { favoriteServices: req.params.serviceId } }, { new: true }).select('favoriteServices');
  return res.json({ success: true, data: user.favoriteServices });
};

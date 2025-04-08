const Model = require("../models/model");

/**
 * Sample Controller - You should replace this with controllers based on your schema design
 */
const controller = {
  /**
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getData: async (req, res, next) => {
    try {
      const data = await Model.getData();

      res.json({
        success: true,
        count: data.length,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  },
  getAllArtist: async (req, res, next) => {
    try {
      const data = await Model.getAllArtist();

      res.json({
        success: true,
        count: data.length,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  },
  getArtistData: async (req, res, next) => {
    try {
      const { artistId } = req.params;
      const { countryCodes, days } = req.query;

      if (!artistId) {
        return res.status(400).json({ error: "artistId is required" });
      }

      if (!countryCodes) {
        return res.status(400).json({ error: "countryCodes is required" });
      }

      const countryCodesArray = countryCodes.split(",");
      const daysNumber = parseInt(days, 10) || 7;

      const data = await Model.getArtistData({
        artistId,
        countryCodes: countryCodesArray,
        days: daysNumber,
      });

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },
  getArtistIdByName: async (req, res, next) => {
    try {
      const { artistName } = req.params; 

      if (!artistName) {
        return res.status(400).json({ error: "artistName is required" });
      }

      const artistId = await Model.getArtistIdByName(artistName); 

      res.json({
        success: true,
        data: { artistId }, 
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = controller;

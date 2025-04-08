const { query } = require("../db");

/**
 * Sample Model - You should replace this with models based on yout schema design
 */
class Model {
  /**
   * @returns {Promise<Array>} Array of records
   */
  static async getData({ limit = 20, offset = 0 } = {}) {
    // Simple parameterized query example

    const result = await query(
      "SELECT * FROM artists ORDER BY artist_id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    return result.rows;
  }

  static async getArtistData({
    artistId = "",
    countryCodes = [], 
    days = 7, 
  } = {}) {
    if (!artistId) {
      throw new Error("artistId is required");
    }

    if (!countryCodes.length) {
      throw new Error("countryCodes array cannot be empty");
    }

    const placeholders = countryCodes
      .map((_, index) => `$${index + 2}`)
      .join(", ");

    const result = await query(
      `SELECT daily_metrics.*
       FROM daily_metrics
       JOIN tracks ON tracks.track_id = daily_metrics.track_id
       WHERE tracks.artist_id = $1
         AND daily_metrics.country_code IN (${placeholders})
         AND daily_metrics.date >= NOW() - INTERVAL '${days} days'`, 
      [artistId, ...countryCodes]
    );

    return result.rows;
  }

  static async getArtistIdByName(queryString = "") {
    if (!queryString) {
      throw new Error("Query string cannot be empty");
    }

    const result = await query(
      `SELECT artist_id
       FROM artists
       WHERE LOWER(artist_name) LIKE LOWER($1)
       LIMIT 1`,
      [`%${queryString}%`] 
    );

    if (result.rows.length === 0) {
      throw new Error("No artist found matching the query");
    }

    return result.rows[0].artist_id;
  }

  static async getAllArtist() {
    const result = await query(
      `SELECT artist_name
       FROM artists`
    );

    if (result.rows.length === 0) {
      throw new Error("No artists found in database");
    }

    return result.rows;
  }
}

module.exports = Model;

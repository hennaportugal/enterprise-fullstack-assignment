import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import api from "../../utils/api";
import CountrySelector from "../CountrySelector/CountrySelector";
import MetricSelector from "../MetricSelector/MetricSelector";
import TimeRangeToggle from "../TimeRange/TimeRangeToggle";
import FollowerConversionChart from "../Chart/FollowerConversionChart";
import ListenerToStreamChart from "../Chart/ListenerToStreamChart";
import PlaylistEfficiencyChart from "../Chart/PlaylistEfficiencyChart";

const HomePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countryCodes, setCountryCodes] = useState<string[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string | null>("");
  const [selectedMetric, setSelectedMetric] = useState<string>("");
  const [timeRange, setTimeRange] = useState<number>(7);
  const [artistId, setArtistId] = useState<string>("");
  const [artistSuggestions, setArtistSuggestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [highestEfficiency, setHighestEfficiency] = useState<number>(0);
  const [highestEfficiencyDate, setHighestEfficiencyDate] = useState<
    string | null
  >(null);
  const [chartType, setChartType] = useState<string>("BAR");

  const handleTimeRangeChange = (days: number) => {
    setTimeRange(days);
  };

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim().length > 2) {
      const filtered = artistSuggestions.filter((artist) =>
        artist.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = async (artistName: string) => {
    setSearchTerm(artistName);
    setFilteredSuggestions([]);

    const fetchArtistId = async (artistName: string) => {
      try {
        if (!artistName) {
          throw new Error("Artist name is required");
        }

        const response = await api.getArtistIdByName(artistName);

        return response.data.artistId;
      } catch (error) {
        throw new Error("Failed to fetch artist ID");
      }
    };
    setArtistId(await fetchArtistId(artistName));
    setSelectedArtist(artistName);
  };

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        if (!artistId) {
          throw new Error("Artist ID is required");
        }

        if (!countryCodes.length) {
          throw new Error("At least one country code is required");
        }

        setLoading(true);

        const data = await api.getArtistData(artistId, countryCodes, timeRange);

        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid data format");
        }

        setData(data);
        setError(null);
      } catch (err) {
        setError("Failed to load artist data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchArtistSuggestions = async () => {
      try {
        const data = await api.getAllArtists();

        setArtistSuggestions(
          data.data.map((artist: any) => artist.artist_name)
        );
        setError(null);
      } catch (err) {
        setError("Failed to load artists. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchArtistSuggestions();

    if (artistId && countryCodes.length > 0) {
      fetchArtistData();
    }
  }, [artistId, countryCodes, timeRange]);

  useEffect(() => {
    if (data.length > 0) {
      const highestEfficiencyData = data.reduce(
        (max, item) => {
          const efficiency = item.streams / (item.playlist_adds || 1);
          return efficiency > max.efficiency
            ? { efficiency, date: item.date }
            : max;
        },
        { efficiency: 0, date: null }
      );

      setHighestEfficiency(highestEfficiencyData.efficiency);
      setHighestEfficiencyDate(highestEfficiencyData.date);
    }
  }, [data]);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {/* Header Section */}
        <h1>Global Editorial Playlist Dashboard</h1>
        <p>Find regional breakout artists and analyze playlist performance</p>

        {/* Filters Section */}
        <div className={styles.flexRow}>
          <CountrySelector onCountryChange={setCountryCodes} />
          <div className={styles.artistSearch}>
            <div className={styles.label}>Artist Search</div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Type artist name..."
              className={styles.searchInput}
            />
            {filteredSuggestions.length > 0 && (
              <ul className={styles.suggestions}>
                {filteredSuggestions.map((artist, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(artist)}
                    className={styles.suggestionItem}
                  >
                    {artist}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <MetricSelector onMetricChange={handleMetricChange} />
          <TimeRangeToggle onTimeRangeChange={handleTimeRangeChange} />
        </div>

        {/* Summary Section */}
        <div className={styles.summary}>
          <div className={styles.flexRow}>
            <h3>Summary KPIs</h3>
            <div className={styles.title}>
              Based on current filter selection
            </div>
          </div>

          <div className={styles.flexRow}>
            {(selectedMetric && countryCodes && artistId && (
              <>
                <div className={styles.artistCard}>
                  <div className={styles.label}>Selected Artist</div>
                  <h2>{selectedArtist}</h2>
                </div>
                <div className={styles.artistCard}>
                  <div className={styles.label}>Total Streams</div>
                  <h2>
                    {data
                      .reduce((sum, item) => sum + (item.streams || 0), 0)
                      .toLocaleString()}
                  </h2>
                </div>
                <div className={styles.artistCard}>
                  <div className={styles.label}>Playlist Adds</div>
                  <h2>
                    {data
                      .reduce((sum, item) => sum + (item.playlist_adds || 0), 0)
                      .toLocaleString()}
                  </h2>
                </div>
                <div className={styles.artistCard}>
                  <div className={styles.label}>Highest Efficiency</div>
                  <h2>
                    {data.length > 0
                      ? highestEfficiency.toLocaleString()
                      : "N/A"}
                  </h2>
                  <div className={styles.date}>
                    {data.length > 0 && highestEfficiencyDate
                      ? `${new Date(highestEfficiencyDate).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" }
                        )}`
                      : "No date available"}
                  </div>
                </div>
              </>
            )) || (
              <div className={styles.flexColumn}>
                <p>No artist selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className={styles.charts}>
          <h3>Performance Chart</h3>
          <div className={styles.flexColumn}>
            {(data.length !== 0 && (
              <>
                {selectedMetric && (
                  <div className={styles.chartTypeButtons}>
                    <button
                      className={chartType === "BAR" ? styles.activeButton : ""}
                      onClick={() => setChartType("BAR")}
                    >
                      Bar Chart
                    </button>
                    <button
                      className={
                        chartType === "LINE" ? styles.activeButton : ""
                      }
                      onClick={() => setChartType("LINE")}
                    >
                      Line Chart
                    </button>
                  </div>
                )}

                {selectedMetric == "LISTENER_TO_STREAM_RATIO" && (
                  <div className={styles.charts}>
                    <ListenerToStreamChart
                      data={data.map((item) => ({
                        unique_listeners: item.unique_listeners || 0,
                        date: item.date,
                        streams: item.streams || 0,
                      }))}
                      chartType={chartType}
                    />
                  </div>
                )}
                {selectedMetric == "FOLLOWER_CONVERSION_RATE" && (
                  <div className={styles.charts}>
                    <FollowerConversionChart
                      data={data.map((item) => ({
                        date: item.date,
                        streams: item.streams || 0,
                        followers_gains: item.followers_gains || 0,
                        conversion_rate:
                          Math.round(
                            (item.followers_gains / item.streams) * 100
                          ) || 0,
                      }))}
                      chartType={chartType}
                    />
                  </div>
                )}
                {selectedMetric == "PLAYLIST_EFFICIENCY" && (
                  <div className={styles.charts}>
                    <PlaylistEfficiencyChart
                      data={data.map((item) => ({
                        playlist_adds: item.playlist_adds || 0,
                        date: item.date,
                        streams: item.streams || 0,
                        efficiency:
                          Math.round(
                            item.streams / (item.playlist_adds || 1)
                          ) || 0,
                      }))}
                      chartType={chartType}
                    />
                  </div>
                )}
              </>
            )) || (
              <div className={styles.flexColumn}>
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import React, { useState } from "react";
import styles from "./CountrySelector.module.scss";

interface CountrySelectorProps {
  onCountryChange: (countryCodes: string[]) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  onCountryChange,
}) => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const countries = [
    { name: "United States", code: "US" },
    { name: "Canada", code: "CA" },
    { name: "Great Britain", code: "GB" },
    { name: "South Korea", code: "KR" },
    { name: "Philippines", code: "PH" },
    { name: "Mexico", code: "MX" },
    { name: "Australia", code: "AU" },
  ];

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = event.target.value;
    if (selectedCode && !selectedCountries.includes(selectedCode)) {
      const updatedCountries = [...selectedCountries, selectedCode];
      setSelectedCountries(updatedCountries);
      onCountryChange(updatedCountries);
    }
    event.target.value = "";
  };

  const handleRemove = (code: string) => {
    const updatedCountries = selectedCountries.filter(
      (country) => country !== code
    );
    setSelectedCountries(updatedCountries);
    onCountryChange(updatedCountries);
  };

  return (
    <div className={styles.countrySelector}>
      <div className={styles.label}>Country</div>
      <div className={styles.dropdown}>
        {selectedCountries.map((code) => (
          <div key={code} className={styles.chip}>
            {countries.find((country) => country.code === code)?.name}
            <button
              onClick={() => handleRemove(code)}
              className={styles.removeButton}
            >
              &times;
            </button>
          </div>
        ))}
        <select
          id="country-selector"
          onChange={handleSelect}
          className={styles.selectInput}
        >
          <option value="">Select Countries</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CountrySelector;

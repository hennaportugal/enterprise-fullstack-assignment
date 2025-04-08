import dynamic from "next/dynamic";

const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((mod) => mod.ResponsiveBar),
  { ssr: false }
);
const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((mod) => mod.ResponsiveLine),
  { ssr: false }
);

const FollowerConversionChart = ({
  data,
  chartType,
}: {
  data: any[];
  chartType: string;
}) => {
  const lineData = [
    {
      id: "Follower Gain",
      color: "hsl(220, 70%, 50%)",
      data: data.map((item) => ({
        x: item.date || "Unknown Date",
        y: item.followers_gains,
      })),
    },
    {
      id: "Streams",
      color: "hsl(220, 70%, 50%)",
      data: data.map((item) => ({
        x: item.date || "Unknown Date",
        y: item.streams,
      })),
    },
  ];
  return (
    <div style={{ height: 400 }}>
      {chartType == "BAR" && (
        <ResponsiveBar
          data={data}
          keys={["conversion_rate"]}
          indexBy="date"
          margin={{ top: 10, right: 130, bottom: 100, left: 80 }}
          padding={0.3}
          valueScale={{ type: "linear", min: 0, max: "auto" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "nivo" }}
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 45,
            legend: "Date",
            legendPosition: "middle",
            legendOffset: 50,
            format: (value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            },
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Follower Gain / Streams (%)",
            legendPosition: "middle",
            legendOffset: -60,
            format: (value) => value.toFixed(2),
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          tooltip={({ id, value, indexValue }) => {
            const date = new Date(indexValue);
            return (
              <div
                style={{
                  padding: "5px 10px",
                  background: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <strong>{id}</strong>: {value.toLocaleString()}%
                <br />
                <small>
                  {date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </small>
              </div>
            );
          }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          role="application"
          ariaLabel="Nivo bar chart demo"
          barAriaLabel={(e) =>
            `${e.id}: ${e.formattedValue} in ${e.indexValue}`
          }
        />
      )}
      {chartType == "LINE" && (
        <ResponsiveLine
          data={lineData}
          margin={{ top: 50, right: 130, bottom: 100, left: 80 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: 0,
            max: "auto",
            stacked: false,
            reverse: false,
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 45,
            legend: "Date",
            legendPosition: "middle",
            legendOffset: 50,
            format: (value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            },
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Follower Gain / Streams (%)",
            legendPosition: "middle",
            legendOffset: -60,
          }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          tooltip={({ point }) => (
            <div
              style={{
                padding: "5px 10px",
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <strong>{point.serieId}</strong>: {point.data.y.toLocaleString()}{" "}
              <br />
              <small>
                {new Date(point.data.x).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </small>
            </div>
          )}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 12,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      )}
    </div>
  );
};

export default FollowerConversionChart;

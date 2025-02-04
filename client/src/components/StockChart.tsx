import React, { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi, Time } from "lightweight-charts";
import { format } from "date-fns";

interface StockData {
  time: string;
  price: number;
  volume: number;
}

interface StockChartProps {
  data: StockData[];
  timeRange: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, timeRange }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "#1E222D" },
          textColor: "#9CA3AF",
          fontFamily: "Inter, sans-serif",
        },
        grid: {
          vertLines: { color: "#262932", style: 1 },
          horzLines: { color: "#262932", style: 1 },
        },
        width: chartContainerRef.current.clientWidth,
        height: 500,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: "#374151",
          textColor: "#9CA3AF",
          fixLeftEdge: true,
          fixRightEdge: true,
          tickMarkFormatter: (time: number) => {
            const date = new Date(time * 1000);
            if (timeRange === "1D") {
              return format(date, "HH:mm");
            } else if (timeRange === "1W") {
              return format(date, "EEE");
            } else if (timeRange === "1M") {
              return format(date, "MMM d");
            } else {
              return format(date, "MMM d");
            }
          },
        },
        rightPriceScale: {
          borderColor: "#374151",
          textColor: "#9CA3AF",
          scaleMargins: {
            top: 0.1,
            bottom: 0.2,
          },
          borderVisible: true,
        },
        crosshair: {
          mode: 1,
          vertLine: {
            width: 1,
            color: "rgba(255, 255, 255, 0.3)",
            style: 3,
            labelBackgroundColor: "#374151",
          },
          horzLine: {
            width: 1,
            color: "rgba(255, 255, 255, 0.3)",
            style: 3,
            labelBackgroundColor: "#374151",
          },
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: true,
        },
        handleScale: {
          mouseWheel: true,
          pinch: true,
          axisPressedMouseMove: true,
        },
      });

      // Add area series
      const areaSeries = chart.addAreaSeries({
        topColor: "rgba(59, 130, 246, 0.3)",
        bottomColor: "rgba(59, 130, 246, 0.0)",
        lineColor: "#3B82F6",
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        crosshairMarkerBorderColor: "#3B82F6",
        crosshairMarkerBackgroundColor: "#1E222D",
        priceLineVisible: true,
        priceLineWidth: 1,
        priceLineColor: "#3B82F6",
        priceLineStyle: 2,
        lastValueVisible: true,
        lastPriceAnimation: 1,
      });

      // Add volume series
      const volumeSeries = chart.addHistogramSeries({
        color: "#3B82F6",
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "",
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      // Format data for the chart
      const areaData = data.map((item) => ({
        time: (new Date(item.time).getTime() / 1000) as Time,
        value: item.price,
      }));

      const volumeData = data.map((item) => ({
        time: (new Date(item.time).getTime() / 1000) as Time,
        value: item.volume,
        color:
          item.price > (data[data.indexOf(item) - 1]?.price || item.price)
            ? "rgba(34, 197, 94, 0.5)"
            : "rgba(239, 68, 68, 0.5)",
      }));

      areaSeries.setData(areaData);
      volumeSeries.setData(volumeData);

      // Add price formatter
      chart.applyOptions({
        localization: {
          priceFormatter: (price: number) => {
            return new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 2,
            }).format(price);
          },
        },
      });

      // Create custom tooltip
      const toolTipWidth = 80;
      const toolTipHeight = 80;
      const toolTipMargin = 15;

      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "12px";
      container.style.top = "12px";
      container.style.zIndex = "1";
      container.style.display = "none";
      container.style.padding = "8px 12px";
      container.style.boxSizing = "border-box";
      container.style.fontSize = "12px";
      container.style.color = "#9CA3AF";
      container.style.background = "#262932";
      container.style.borderRadius = "6px";
      container.style.border = "1px solid #374151";
      container.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
      chartContainerRef.current.appendChild(container);

      chart.subscribeCrosshairMove((param) => {
        if (
          param.point === undefined ||
          !param.time ||
          param.point.x < 0 ||
          param.point.x > chartContainerRef.current!.clientWidth ||
          param.point.y < 0 ||
          param.point.y > chartContainerRef.current!.clientHeight
        ) {
          container.style.display = "none";
        } else {
          const data = param.seriesData.get(areaSeries) as
            | { value: number }
            | undefined;
          const volumeData = param.seriesData.get(volumeSeries) as
            | { value: number }
            | undefined;

          if (data) {
            const price = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 2,
            }).format(data.value);

            const volume = volumeData
              ? new Intl.NumberFormat("en-IN").format(volumeData.value)
              : "N/A";

            const date = new Date((param.time as number) * 1000);
            const dateStr = format(
              date,
              timeRange === "1D" ? "HH:mm:ss" : "MMM d, yyyy HH:mm"
            );

            container.innerHTML = `
              <div style="font-size: 14px; margin-bottom: 4px; color: white;">${dateStr}</div>
              <div style="font-size: 14px; margin-bottom: 4px;">
                <span style="color: #9CA3AF;">Price:</span>
                <span style="color: #3B82F6; font-weight: 500;">${price}</span>
              </div>
              <div style="font-size: 14px;">
                <span style="color: #9CA3AF;">Volume:</span>
                <span style="color: #3B82F6; font-weight: 500;">${volume}</span>
              </div>
            `;
            container.style.display = "block";
          }
        }
      });

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener("resize", handleResize);

      chartRef.current = chart;

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    }
  }, [data, timeRange]);

  return (
    <div className="relative">
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};

export default StockChart;

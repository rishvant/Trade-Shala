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
          background: { type: ColorType.Solid, color: "#ffffff" },
          textColor: "#64748b",
          fontFamily: "Inter, sans-serif",
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { color: "#f1f5f9" },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: "#e2e8f0",
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
          borderColor: "#e2e8f0",
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
        },
        crosshair: {
          mode: 1,
          vertLine: {
            width: 1,
            color: "#94a3b8",
            style: 3,
            labelBackgroundColor: "#64748b",
          },
          horzLine: {
            width: 1,
            color: "#94a3b8",
            style: 3,
            labelBackgroundColor: "#64748b",
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

      const lineSeries = chart.addLineSeries({
        color: "#2563eb",
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        crosshairMarkerBorderColor: "#2563eb",
        crosshairMarkerBackgroundColor: "#ffffff",
        priceLineVisible: true,
        priceLineWidth: 1,
        priceLineColor: "#2563eb",
        priceLineStyle: 2,
        lastValueVisible: true,
        lastPriceAnimation: 1,
        baseLineVisible: true,
        baseLineColor: "#e2e8f0",
        baseLineWidth: 1,
        baseLineStyle: 1,
      });

      // Add area gradient
      lineSeries.applyOptions({
        lineType: 2,
        priceFormat: {
          type: "price",
          precision: 2,
          minMove: 0.01,
        },
        priceScaleId: "right",
      });

      // Format data for the chart
      const lineData = data.map((item) => ({
        time: (new Date(item.time).getTime() / 1000) as Time,
        value: item.price,
      }));

      lineSeries.setData(lineData);

      // Add price formatter
      chart.applyOptions({
        localization: {
          priceFormatter: (price: number) => {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 2,
            }).format(price);
          },
        },
      });

      // Create tooltip
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.display = "none";
      container.style.padding = "8px 12px";
      container.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
      container.style.border = "1px solid #e2e8f0";
      container.style.borderRadius = "6px";
      container.style.boxShadow =
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
      container.style.fontSize = "12px";
      container.style.color = "#1e293b";
      container.style.zIndex = "1000";
      container.style.pointerEvents = "none";
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
          const data = param.seriesData.get(lineSeries) as
            | { value: number }
            | undefined;

          if (data) {
            const price = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 2,
            }).format(data.value);

            const date = new Date((param.time as number) * 1000);
            const dateStr = format(
              date,
              timeRange === "1D" ? "HH:mm:ss" : "MMM d, yyyy HH:mm"
            );

            container.innerHTML = `
              <div style="font-weight: 500; margin-bottom: 4px;">${dateStr}</div>
              <div style="color: #2563eb; font-weight: 600;">${price}</div>
            `;
            container.style.display = "block";

            const tooltipWidth = container.offsetWidth;
            const tooltipHeight = container.offsetHeight;

            let left = param.point.x + 20;
            let top = param.point.y - tooltipHeight - 10;

            if (left + tooltipWidth > chartContainerRef.current!.clientWidth) {
              left = param.point.x - tooltipWidth - 20;
            }

            if (top < 0) {
              top = param.point.y + 10;
            }

            container.style.left = left + "px";
            container.style.top = top + "px";
          }
        }
      });

      // Fit content
      chart.timeScale().fitContent();

      chartRef.current = chart;

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
          chart.timeScale().fitContent();
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    }
  }, [data, timeRange]);

  return (
    <div className="relative">
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
};

export default StockChart;

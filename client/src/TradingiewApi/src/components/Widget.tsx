import React, { useEffect, useRef } from "react";


interface WidgetProps {
  scriptHTML: unknown;
  scriptSRC: string;
  containerId?: string;
  type?: "Widget" | "MediumWidget";
  
}

declare const TradingView: any;

const Widget: React.FC<WidgetProps> = ({
  scriptHTML,
  scriptSRC,
  containerId,
  type,
  
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let refValue: HTMLDivElement;

    const initWidget = () => {
      if (ref.current) {
        const script = document.createElement("script");
        script.setAttribute("data-nscript", "afterInteractive");
        script.src = scriptSRC;
        script.async = true;
        script.type = "text/javascript";

        if (type === "Widget" || type === "MediumWidget") {
          script.onload = () => {
            if (typeof TradingView !== undefined) {
              script.innerHTML = JSON.stringify(
                type === "Widget"
                  ? new TradingView.widget(scriptHTML)
                  : type === "MediumWidget"
                  ? new TradingView.MediumWidget(scriptHTML)
                  : undefined
              );
            }
          };
        } else {
          script.innerHTML = JSON.stringify(scriptHTML);
        }
        if (!ref.current.querySelector('script[src="' + scriptSRC + '"]')) {
          ref.current.appendChild(script);
        }
        refValue = ref.current;
      }
    };
    requestAnimationFrame(initWidget);

    return () => {
      if (refValue) {
        while (refValue.firstChild) {
          refValue.removeChild(refValue.firstChild);
        }
      }
    };
  }, [ref, scriptHTML, type, scriptSRC]);

  const containerKey = containerId || "tradingview_" + scriptHTML;

  return (
    <div style={{ display: "contents" }}>
      {type === "Widget" || type === "MediumWidget" ? (
        <div id={containerId} key={containerKey}>
          <div ref={ref} style={{ display: "contents" }} />
        </div>
      ) : (
        <div ref={ref} style={{ display: "contents" }} key={containerKey} />
      )}
      
    </div>
  );
};

export default Widget;

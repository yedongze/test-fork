import * as React from "react";
import JSONViewer from "react-json-view";
import RoundSlider from "../../RoundSlider";

import produce from "immer";
import moonSrc from "./images/moon.svg";
import bellSrc from "./images/bell.png";
import useTimeState from "./hooks/useTimeState";
import "./styles.css";

// import { useForm, Controller } from "react-hook-form";

const cssContainerStyle = {
  "background-color": "#191719",
  "border-radius": "50%",
  "background-repeat": "no-repeat",
  "background-size": "cover",
  "border": "1px solid black",
  "width": 32,
  "height": 32,
};
const moonStyle = {
  ...cssContainerStyle,
  "background-image": `url(${moonSrc})`,
  transform: "rotate(-90deg)"
};
const bellStyle = {
  ...cssContainerStyle,
  "background-image": `url(${bellSrc})`,
  transform: "rotate(-90deg)"
};

export const Example = (): JSX.Element => {
  const { time, loading } = useTimeState();
  const [sliderElem, setSliderElem] = React.useState<any>(null);
  const [classHandler, setClassHandler] = React.useState<any>({
    1: {
      class: ".rs-first",
      css: moonStyle
    },
    2: {
      class: ".rs-second",
      css: bellStyle
    }
  });

  const onLoadSlider = (obj: Record<string, unknown>) => {
    if (obj.$sliderElem !== null) {
      setSliderElem(obj.$sliderElem);
    }
  };
  const handleUpdate = React.useCallback((event: any) => {
    const {
      handle: { index, angle }
    } = event;
    const handleClass: any = {
      1: {
        class: ".rs-first",
        css: {
          ...moonStyle,
          transform: `rotate(-${angle}deg)`
        }
      },
      2: {
        class: ".rs-second",
        css: {
          ...bellStyle,
          transform: `rotate(-${angle}deg)`
        }
      }
    };
    setClassHandler(
      produce((draft: any) => {
        draft[index] = handleClass[index];
      })
    );
  }, []);
  // set backgroumd image on shapes
  React.useEffect(() => {
    if (sliderElem) {
      [1, 2].forEach((index) => {
        sliderElem
          .find(`${classHandler[index].class} .rs-handle`)
          .css(classHandler[index].css);
      });
      setSliderElem(sliderElem);
    }
    console.log("after update sliderElemn", sliderElem);
  }, [classHandler, sliderElem]);
  const sliderProps = React.useMemo(
    () => ({
      // change: handleChange,
      sliderType: "range",
      svgMode: true,
      update: handleUpdate,
      max: time.length,
      handleSize: 32,
      borderColor: "transparent",
      pathColor: "#191719",
      endAngle: "+360",
      startAngle: 90,
      radius: 120,
      lineCap: "round",
      width: 40,
      
      rangeColor: "rgb(252, 186, 3)",
      editableTooltip: false,
      showTooltip: false
    }),
    [time, handleUpdate]
  );

  if (loading) return <div>...loading data</div>;

  return (
    <div className="container">
      <RoundSlider
        name="clock"
        onLoadSlider={onLoadSlider}
        sliderProps={sliderProps}
      />
    </div>
  );
};

export default Example;

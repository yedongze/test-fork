import * as React from "react";
//@ts-ignore
import $ from "jquery";
import "round-slider";
import "round-slider/dist/roundslider.min.css";

const { useEffect, useState, useRef, useCallback } = React;

const sliderPropsDefaults = {
  min: 0,
  max: 100,
  step: 1,
  value: null,
  radius: 85,
  width: 16,
  handleSize: "+0",
  startAngle: 0,
  endAngle: "+360",
  animation: true,
  showTooltip: true,
  editableTooltip: true,
  readOnly: false,
  disabled: false,
  keyboardAction: true,
  mouseScrollAction: false,
  sliderType: "default",
  circleShape: "full",
  handleShape: "round",
  lineCap: "butt",

  // the 'startValue' property decides at which point the slider should start.
  // otherwise, by default the slider starts with min value. this is mainly used
  // for min-range slider, where you can customize the min-range start position.
  startValue: null,

  // SVG related properties
  svgMode: false,
  borderWidth: 1,
  borderColor: null,
  pathColor: null,
  rangeColor: null,
  tooltipColor: null,

  // events
  beforeCreate: null,
  create: null,
  start: null,
  // 'beforeValueChange' will be triggered before 'valueChange', and it can be cancellable
  beforeValueChange: null,
  drag: null,
  change: null,
  // 'update' event is the combination of 'drag' and 'change'
  update: null,
  // 'valueChange' event is similar to 'update' event, in addition it will trigger
  // even the value was changed through programmatically also.
  valueChange: null,
  stop: null,
  tooltipFormat: null
};

type SliderMethodsTypes = {
  setValue: (val: any, index?: number) => void;
};

type SliderMethods = {
  setSliderValue: (val: any) => void;
};

type cbArgs = {
  $sliderElem: unknown | null;
};

type RounSliderProps = {
  name: string;
  sliderProps?: {
    [key: string]: unknown;
  };
  onLoadSlider?: (obj: cbArgs) => void;
} & Record<string, unknown>;

/** Component slider */
export const RoundSlider = (props: RounSliderProps): JSX.Element => {
  const {
    sliderProps = sliderPropsDefaults,
    onLoadSlider = () => null,
    name
  } = props;
  const roundSliderRef = useRef(null);
  const [$sliderElem, setSliderElem] = useState<any>(null);
  useEffect(() => {
    if (roundSliderRef.current && $sliderElem === null) {
      const defaultSliderProps = {
        ...sliderPropsDefaults,
        ...sliderProps
      };
      const $roundSlider = $(roundSliderRef.current);
      $roundSlider.roundSlider(defaultSliderProps);
      setSliderElem($roundSlider);
    }
  }, [sliderProps, $sliderElem]);
  useEffect(() => {
    onLoadSlider({ $sliderElem });
  }, [$sliderElem, onLoadSlider]);

  return <div id={`id-${name}`} ref={roundSliderRef} />;
};

export default RoundSlider;
